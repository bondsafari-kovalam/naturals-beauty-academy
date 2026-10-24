-- Final step of 012_workshop_registration_hardening.sql: visitors can no longer call
-- register_for_workshop() directly. The website keeps working because submit_workshop_registration()
-- (SECURITY DEFINER) still calls it internally.
-- Run ONLY after 012 is set up and a test registration on the redeployed website has succeeded.
-- Run once in Supabase: Dashboard → SQL Editor → New query → paste → Run. Safe to re-run.

revoke execute on function public.register_for_workshop(text, text, text, text, text, text, text, text, text, text, text, text) from public, anon, authenticated;

notify pgrst, 'reload schema';
