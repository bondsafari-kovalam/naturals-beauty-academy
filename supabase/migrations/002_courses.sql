-- Courses shown on the homepage carousel, /courses and /courses/[slug].
-- Run once in Supabase: Dashboard → SQL Editor → New query → paste → Run.
-- Safe to re-run: creates objects only if missing; never drops tables or changes data.

create table if not exists public.courses (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique
    check (char_length(slug) <= 120 and slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  title text not null check (char_length(btrim(title)) between 1 and 200),
  category text not null check (char_length(btrim(category)) between 1 and 100),
  description text not null check (char_length(btrim(description)) between 1 and 2000),
  duration text check (duration is null or char_length(duration) <= 60),
  image_url text not null check (image_url ~ '^(/|https://)'),
  image_alt text check (image_alt is null or char_length(image_alt) <= 300),
  -- List of modules: [{ "heading": "...", "topics": ["...", "..."], "note": "optional" }]
  curriculum jsonb not null default '[]'::jsonb check (jsonb_typeof(curriculum) = 'array'),
  sort_order integer not null default 0,
  is_published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists courses_published_sort_idx on public.courses (is_published, sort_order);

-- Keep updated_at current on every edit.
create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists courses_set_updated_at on public.courses;
create trigger courses_set_updated_at
  before update on public.courses
  for each row execute function public.set_updated_at();

-- Row Level Security: visitors (publishable key) may only READ PUBLISHED courses.
-- There are no insert/update/delete policies, and those privileges are revoked from the public roles,
-- so the website can never change courses. Staff edit courses in the Supabase dashboard
-- (Table Editor / SQL Editor), which only signed-in project members can use.
alter table public.courses enable row level security;

drop policy if exists "Public can read published courses" on public.courses;
create policy "Public can read published courses"
  on public.courses
  for select
  to anon, authenticated
  using (is_published = true);

revoke insert, update, delete, truncate on public.courses from anon, authenticated;
grant select on public.courses to anon, authenticated;
