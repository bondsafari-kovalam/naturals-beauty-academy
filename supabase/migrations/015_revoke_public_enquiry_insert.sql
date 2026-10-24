-- Final step of 014_enquiry_hardening.sql: visitors can no longer insert enquiries directly.
-- The website keeps working because submit_enquiry() (SECURITY DEFINER) inserts them.
-- Run ONLY after 014 is in place and a test enquiry on the redeployed website appears in the admin panel.
-- Run once in Supabase: Dashboard → SQL Editor → New query → paste → Run. Safe to re-run.

drop policy if exists "Website can submit new enquiries" on public.enquiries;
revoke insert on public.enquiries from anon, authenticated;

notify pgrst, 'reload schema';
