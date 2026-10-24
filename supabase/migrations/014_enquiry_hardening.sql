-- Contact-form enquiry hardening (same approach as 012 for workshop registrations).
-- Before: anyone holding the publishable key could insert rows into public.enquiries directly, skipping the
-- website's CAPTCHA, so the admin inbox could be flooded with spam.
-- After: the website saves enquiries through submit_enquiry(), which only accepts calls carrying the website
-- server's secret (the same one 012 stores as 'workshop_registration' and the website reads from
-- WORKSHOP_REGISTRATION_SECRET) and limits each visitor IP to 5 enquiries per 10 minutes.
-- Requires 001_enquiries.sql and 012_workshop_registration_hardening.sql (secret stored, step 2 there).
-- ADDITIVE: direct inserts keep working until 015_revoke_public_enquiry_insert.sql, so the website can be
-- redeployed without downtime. Run once in Supabase: SQL Editor → New query → paste → Run. Safe to re-run.

begin;

create table if not exists private.enquiry_attempts (
  ip_hash bytea not null,
  created_at timestamptz not null default now()
);

create index if not exists enquiry_attempts_ip_idx on private.enquiry_attempts (ip_hash, created_at);
create index if not exists enquiry_attempts_created_idx on private.enquiry_attempts (created_at);

revoke all on private.enquiry_attempts from public, anon, authenticated;

-- Returns { ok, code } and never personal data. Lengths are also enforced by the table's CHECK constraints.
create or replace function public.submit_enquiry(
  p_secret text, p_client_ip text,
  p_name text, p_email text, p_phone text default null, p_message text default null, p_source text default 'contact-form'
)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  ip_key bytea := case when nullif(btrim(coalesce(p_client_ip, '')), '') is null then null else sha256(convert_to(btrim(p_client_ip), 'UTF8')) end;
begin
  if p_secret is null or not exists (
    select 1 from private.app_secrets s where s.name = 'workshop_registration' and s.secret_hash = sha256(convert_to(p_secret, 'UTF8'))
  ) then
    return jsonb_build_object('ok', false, 'code', 'unauthorized');
  end if;

  if char_length(btrim(coalesce(p_name, ''))) not between 1 and 120
    or char_length(coalesce(p_email, '')) > 254 or coalesce(p_email, '') !~ '^[^@[:space:]]+@[^@[:space:]]+\.[^@[:space:]]+$'
    or char_length(coalesce(p_phone, '')) > 40
    or char_length(btrim(coalesce(p_message, ''))) not between 1 and 5000 then
    return jsonb_build_object('ok', false, 'code', 'invalid');
  end if;

  if ip_key is not null then
    delete from private.enquiry_attempts a where a.created_at < now() - interval '1 day';
    if (select count(*) from private.enquiry_attempts a where a.ip_hash = ip_key and a.created_at > now() - interval '10 minutes') >= 5 then
      return jsonb_build_object('ok', false, 'code', 'rate_limited');
    end if;
    insert into private.enquiry_attempts (ip_hash) values (ip_key);
  end if;

  insert into public.enquiries (name, email, phone, message, source)
  values (btrim(p_name), btrim(p_email), nullif(btrim(coalesce(p_phone, '')), ''), btrim(p_message), left(coalesce(nullif(btrim(p_source), ''), 'contact-form'), 60));

  return jsonb_build_object('ok', true, 'code', 'saved');
end;
$$;

-- Callable with the publishable key, but useless without the secret.
revoke all on function public.submit_enquiry(text, text, text, text, text, text, text) from public;
grant execute on function public.submit_enquiry(text, text, text, text, text, text, text) to anon, authenticated;

commit;

notify pgrst, 'reload schema';
