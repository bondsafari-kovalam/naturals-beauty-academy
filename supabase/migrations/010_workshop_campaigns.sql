-- Workshop campaigns: campaign URLs (slug), status, seat limits and online registrations.
-- Requires 004_admin_auth.sql (public.is_admin()), 002_courses.sql (set_updated_at) and 007_workshops.sql.
-- ADDITIVE ONLY: no table or column is dropped; existing workshops keep their data.
-- Run once in Supabase: Dashboard → SQL Editor → New query → paste → Run. Safe to re-run.

begin;

-- ---------------------------------------------------------------------------
-- 1. New workshop columns
-- ---------------------------------------------------------------------------
alter table public.workshops
  add column if not exists slug text,
  add column if not exists short_description text,
  add column if not exists status text not null default 'draft',
  add column if not exists total_seats integer,
  add column if not exists registration_open boolean not null default true;

do $$
begin
  if not exists (select 1 from pg_constraint where conname = 'workshops_status_check') then
    alter table public.workshops add constraint workshops_status_check check (status in ('draft', 'published', 'completed', 'cancelled'));
  end if;
  if not exists (select 1 from pg_constraint where conname = 'workshops_slug_format') then
    alter table public.workshops add constraint workshops_slug_format check (slug is null or (char_length(slug) <= 120 and slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'));
  end if;
  if not exists (select 1 from pg_constraint where conname = 'workshops_short_description_length') then
    alter table public.workshops add constraint workshops_short_description_length check (short_description is null or char_length(short_description) <= 300);
  end if;
  if not exists (select 1 from pg_constraint where conname = 'workshops_total_seats_range') then
    alter table public.workshops add constraint workshops_total_seats_range check (total_seats is null or total_seats between 1 and 10000);
  end if;
end $$;

-- Existing published workshops stay published (status replaces the old is_published flag).
update public.workshops set status = 'published' where is_published and status = 'draft';

-- Campaign URL for existing workshops: /workshops/<title>, with the date added if two share a title.
with base as (
  select id, date,
    coalesce(nullif(left(trim(both '-' from lower(regexp_replace(title, '[^a-zA-Z0-9]+', '-', 'g'))), 100), ''), 'workshop') as slug_base,
    row_number() over (partition by lower(regexp_replace(title, '[^a-zA-Z0-9]+', '-', 'g')) order by date, created_at) as n
  from public.workshops
  where slug is null
)
update public.workshops w
set slug = case when b.n = 1 and not exists (select 1 from public.workshops x where x.slug = b.slug_base) then b.slug_base else b.slug_base || '-' || to_char(b.date, 'yyyy-mm-dd') end
from base b
where w.id = b.id;

create unique index if not exists workshops_slug_key on public.workshops (slug);
alter table public.workshops alter column slug set not null;
create index if not exists workshops_status_date_idx on public.workshops (status, date);

-- Keep the legacy is_published flag in step with status (older code and policies read it).
create or replace function public.workshops_sync_published()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.is_published := new.status = 'published';
  return new;
end;
$$;

drop trigger if exists workshops_sync_published on public.workshops;
create trigger workshops_sync_published
  before insert or update on public.workshops
  for each row execute function public.workshops_sync_published();

drop trigger if exists workshops_set_updated_at on public.workshops;
create trigger workshops_set_updated_at
  before update on public.workshops
  for each row execute function public.set_updated_at();

-- Visitors see published workshops only (drafts, completed and cancelled stay hidden).
drop policy if exists "Public can view published workshops" on public.workshops;
create policy "Public can view published workshops"
  on public.workshops for select to anon, authenticated
  using (status = 'published');

-- ---------------------------------------------------------------------------
-- 2. Registrations
-- ---------------------------------------------------------------------------
create table if not exists public.workshop_registrations (
  id uuid primary key default gen_random_uuid(),
  -- restrict: a workshop with registrations cannot be deleted by accident (cancel it instead).
  workshop_id uuid not null references public.workshops (id) on delete restrict,
  full_name text not null check (char_length(btrim(full_name)) between 2 and 120),
  phone text not null check (phone ~ '^\+[1-9][0-9]{7,14}$'),
  email text check (email is null or (char_length(email) <= 254 and email ~ '^[^@[:space:]]+@[^@[:space:]]+\.[^@[:space:]]+$')),
  message text check (message is null or char_length(message) <= 1000),
  utm_source text check (utm_source is null or char_length(utm_source) <= 100),
  utm_medium text check (utm_medium is null or char_length(utm_medium) <= 100),
  utm_campaign text check (utm_campaign is null or char_length(utm_campaign) <= 150),
  utm_content text check (utm_content is null or char_length(utm_content) <= 150),
  utm_term text check (utm_term is null or char_length(utm_term) <= 150),
  referrer text check (referrer is null or char_length(referrer) <= 500),
  landing_path text check (landing_path is null or char_length(landing_path) <= 300),
  status text not null default 'pending' check (status in ('pending', 'confirmed', 'cancelled', 'attended')),
  admin_notes text check (admin_notes is null or char_length(admin_notes) <= 2000),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  -- One registration per phone number per workshop.
  constraint workshop_registrations_unique_phone unique (workshop_id, phone)
);

create index if not exists workshop_registrations_workshop_idx on public.workshop_registrations (workshop_id, created_at desc);
create index if not exists workshop_registrations_created_idx on public.workshop_registrations (created_at desc);
create index if not exists workshop_registrations_status_idx on public.workshop_registrations (status);

drop trigger if exists workshop_registrations_set_updated_at on public.workshop_registrations;
create trigger workshop_registrations_set_updated_at
  before update on public.workshop_registrations
  for each row execute function public.set_updated_at();

-- Only admins can read, update or delete registrations. Visitors have NO direct access at all:
-- they register through register_for_workshop() below, which checks everything server-side.
alter table public.workshop_registrations enable row level security;

drop policy if exists "Admins can manage workshop registrations" on public.workshop_registrations;
create policy "Admins can manage workshop registrations"
  on public.workshop_registrations for all to authenticated
  using ((select public.is_admin()))
  with check ((select public.is_admin()));

revoke all on public.workshop_registrations from anon;
grant select, insert, update, delete on public.workshop_registrations to authenticated;

-- ---------------------------------------------------------------------------
-- 3. Public functions
-- ---------------------------------------------------------------------------

-- Registers a visitor for a published, upcoming, open workshop. Returns { ok, code } and never personal data.
-- The workshop row is locked (FOR UPDATE) so two people cannot take the last seat at the same time.
-- Seats counted: every registration that is not cancelled (admins cancel a registration to free its seat).
create or replace function public.register_for_workshop(
  p_slug text, p_full_name text, p_phone text, p_email text default null, p_message text default null,
  p_utm_source text default null, p_utm_medium text default null, p_utm_campaign text default null,
  p_utm_content text default null, p_utm_term text default null, p_referrer text default null, p_landing_path text default null
)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  w public.workshops%rowtype;
  taken integer;
  new_id uuid;
  clean_email text := nullif(lower(btrim(coalesce(p_email, ''))), '');
begin
  select * into w from public.workshops where slug = p_slug for update;
  if not found or w.status <> 'published' then return jsonb_build_object('ok', false, 'code', 'not_found'); end if;
  if w.date < (now() at time zone 'Asia/Kolkata')::date then return jsonb_build_object('ok', false, 'code', 'ended'); end if;
  if not w.registration_open then return jsonb_build_object('ok', false, 'code', 'closed'); end if;

  if p_full_name is null or char_length(btrim(p_full_name)) not between 2 and 120 then return jsonb_build_object('ok', false, 'code', 'invalid_name'); end if;
  if p_phone is null or p_phone !~ '^\+[1-9][0-9]{7,14}$' then return jsonb_build_object('ok', false, 'code', 'invalid_phone'); end if;
  if clean_email is not null and (char_length(clean_email) > 254 or clean_email !~ '^[^@[:space:]]+@[^@[:space:]]+\.[^@[:space:]]+$') then return jsonb_build_object('ok', false, 'code', 'invalid_email'); end if;

  -- Flood protection: no more than 30 registrations per workshop in any 10 minutes.
  if (select count(*) from public.workshop_registrations r where r.workshop_id = w.id and r.created_at > now() - interval '10 minutes') >= 30 then
    return jsonb_build_object('ok', false, 'code', 'busy');
  end if;

  if w.total_seats is not null then
    select count(*) into taken from public.workshop_registrations r where r.workshop_id = w.id and r.status <> 'cancelled';
    if taken >= w.total_seats then return jsonb_build_object('ok', false, 'code', 'full'); end if;
  end if;

  insert into public.workshop_registrations (workshop_id, full_name, phone, email, message, utm_source, utm_medium, utm_campaign, utm_content, utm_term, referrer, landing_path)
  values (w.id, btrim(p_full_name), p_phone, clean_email, nullif(left(btrim(coalesce(p_message, '')), 1000), ''),
    nullif(left(btrim(coalesce(p_utm_source, '')), 100), ''), nullif(left(btrim(coalesce(p_utm_medium, '')), 100), ''),
    nullif(left(btrim(coalesce(p_utm_campaign, '')), 150), ''), nullif(left(btrim(coalesce(p_utm_content, '')), 150), ''),
    nullif(left(btrim(coalesce(p_utm_term, '')), 150), ''), nullif(left(btrim(coalesce(p_referrer, '')), 500), ''),
    nullif(left(btrim(coalesce(p_landing_path, '')), 300), ''))
  on conflict (workshop_id, phone) do nothing
  returning id into new_id;

  if new_id is null then return jsonb_build_object('ok', false, 'code', 'duplicate'); end if;
  return jsonb_build_object('ok', true, 'code', 'registered');
end;
$$;

revoke all on function public.register_for_workshop(text, text, text, text, text, text, text, text, text, text, text, text) from public;
grant execute on function public.register_for_workshop(text, text, text, text, text, text, text, text, text, text, text, text) to anon, authenticated;

-- Seats left for every published workshop with a seat limit (counts only; no personal data).
create or replace function public.workshop_availability()
returns table (slug text, seats_left integer)
language sql
stable
security definer
set search_path = ''
as $$
  select w.slug, greatest(w.total_seats - (select count(*) from public.workshop_registrations r where r.workshop_id = w.id and r.status <> 'cancelled'), 0)::integer
  from public.workshops w
  where w.status = 'published' and w.total_seats is not null;
$$;

revoke all on function public.workshop_availability() from public;
grant execute on function public.workshop_availability() to anon, authenticated;

commit;

notify pgrst, 'reload schema';
