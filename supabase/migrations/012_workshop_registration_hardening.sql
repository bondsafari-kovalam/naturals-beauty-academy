-- Workshop registration hardening.
-- Before: anyone holding the publishable key could call register_for_workshop() directly through the
-- Supabase API, skipping the website's CAPTCHA and rate limit, and fill a workshop with fake registrations.
-- After: the website registers through submit_workshop_registration(), which only accepts calls that carry
-- the website server's shared secret, and limits attempts per visitor IP in the database (one limit shared
-- by every server instance, unlike the old in-memory one).
-- Requires 010_workshop_campaigns.sql. ADDITIVE: the old function keeps working until
-- 013_revoke_public_workshop_registration.sql, so the website can be redeployed without downtime.
-- Run once in Supabase: Dashboard → SQL Editor → New query → paste → Run. Safe to re-run.
--
-- Rollout:
--   1. Run this file.
--   2. Generate a long random secret (e.g. `openssl rand -hex 32`) and store only its hash, in the SQL Editor:
--        insert into private.app_secrets (name, secret_hash)
--        values ('workshop_registration', sha256(convert_to('PASTE-THE-SECRET', 'UTF8')))
--        on conflict (name) do update set secret_hash = excluded.secret_hash;
--   3. Set WORKSHOP_REGISTRATION_SECRET to the same secret in the website's Vercel project and redeploy.
--   4. Make a test registration, then run 013_revoke_public_workshop_registration.sql.

begin;

-- ---------------------------------------------------------------------------
-- 1. Private storage (the "private" schema is not exposed through the Supabase API)
-- ---------------------------------------------------------------------------
create schema if not exists private;
revoke all on schema private from public, anon, authenticated;

-- Hashes of server-to-database secrets. The plain secret only lives in the website's environment.
create table if not exists private.app_secrets (
  name text primary key,
  secret_hash bytea not null check (octet_length(secret_hash) = 32)
);

-- One row per registration attempt that reached the database. Only a hash of the IP address is kept,
-- and rows older than a day are deleted on the next attempt.
create table if not exists private.workshop_registration_attempts (
  ip_hash bytea not null,
  created_at timestamptz not null default now()
);

create index if not exists workshop_registration_attempts_ip_idx on private.workshop_registration_attempts (ip_hash, created_at);
create index if not exists workshop_registration_attempts_created_idx on private.workshop_registration_attempts (created_at);

revoke all on all tables in schema private from public, anon, authenticated;

-- ---------------------------------------------------------------------------
-- 2. The function the website calls
-- ---------------------------------------------------------------------------
-- Checks the secret, applies the per-IP limit (5 attempts per 10 minutes), then hands over to
-- register_for_workshop(), which keeps every eligibility rule, the seat lock and the per-workshop cap.
-- Returns { ok, code } and never personal data.
create or replace function public.submit_workshop_registration(
  p_secret text, p_client_ip text,
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
  ip_key bytea := case when nullif(btrim(coalesce(p_client_ip, '')), '') is null then null else sha256(convert_to(btrim(p_client_ip), 'UTF8')) end;
begin
  if p_secret is null or not exists (
    select 1 from private.app_secrets s where s.name = 'workshop_registration' and s.secret_hash = sha256(convert_to(p_secret, 'UTF8'))
  ) then
    return jsonb_build_object('ok', false, 'code', 'unauthorized');
  end if;

  if ip_key is not null then
    delete from private.workshop_registration_attempts a where a.created_at < now() - interval '1 day';
    if (select count(*) from private.workshop_registration_attempts a where a.ip_hash = ip_key and a.created_at > now() - interval '10 minutes') >= 5 then
      return jsonb_build_object('ok', false, 'code', 'rate_limited');
    end if;
    insert into private.workshop_registration_attempts (ip_hash) values (ip_key);
  end if;

  return public.register_for_workshop(p_slug, p_full_name, p_phone, p_email, p_message,
    p_utm_source, p_utm_medium, p_utm_campaign, p_utm_content, p_utm_term, p_referrer, p_landing_path);
end;
$$;

-- Callable with the publishable key, but useless without the secret.
revoke all on function public.submit_workshop_registration(text, text, text, text, text, text, text, text, text, text, text, text, text, text) from public;
grant execute on function public.submit_workshop_registration(text, text, text, text, text, text, text, text, text, text, text, text, text, text) to anon, authenticated;

commit;

notify pgrst, 'reload schema';
