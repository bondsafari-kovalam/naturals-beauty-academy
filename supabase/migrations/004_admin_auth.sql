-- Admin authorization for the separate admin panel (naturals-beauty-admin).
-- Requires 001_enquiries.sql and 002_courses.sql to have been run first.
-- Run once in Supabase: Dashboard → SQL Editor → New query → paste → Run.
-- Safe to re-run: creates objects only if missing; never drops tables or changes existing rows.

-- 1. Who is an administrator. A user is an admin ONLY if listed here.
--    Rows are added/removed in the SQL Editor (see the bottom of this file); nobody can add themselves.
create table if not exists public.admin_users (
  user_id uuid primary key references auth.users (id) on delete cascade,
  role text not null default 'editor' check (role in ('owner', 'editor')),
  created_at timestamptz not null default now()
);

alter table public.admin_users enable row level security;

drop policy if exists "Admins can see their own admin row" on public.admin_users;
create policy "Admins can see their own admin row"
  on public.admin_users
  for select
  to authenticated
  using (user_id = (select auth.uid()));

revoke all on public.admin_users from anon;
revoke insert, update, delete, truncate on public.admin_users from authenticated;
grant select on public.admin_users to authenticated;

-- 2. is_admin(): true when the signed-in user is listed in admin_users.
--    SECURITY DEFINER so policies can call it without exposing the admin list; empty search_path for safety.
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (select 1 from public.admin_users where user_id = (select auth.uid()));
$$;

revoke execute on function public.is_admin() from public, anon;
grant execute on function public.is_admin() to authenticated;

-- 3. Courses: admins can read drafts and create / edit / delete.
--    The existing "Public can read published courses" policy is unchanged.
drop policy if exists "Admins can read all courses" on public.courses;
create policy "Admins can read all courses"
  on public.courses for select to authenticated
  using ((select public.is_admin()));

drop policy if exists "Admins can add courses" on public.courses;
create policy "Admins can add courses"
  on public.courses for insert to authenticated
  with check ((select public.is_admin()));

drop policy if exists "Admins can edit courses" on public.courses;
create policy "Admins can edit courses"
  on public.courses for update to authenticated
  using ((select public.is_admin()))
  with check ((select public.is_admin()));

drop policy if exists "Admins can delete courses" on public.courses;
create policy "Admins can delete courses"
  on public.courses for delete to authenticated
  using ((select public.is_admin()));

-- Signed-in users need the table privileges; the policies above limit them to admins.
-- Anonymous visitors stay read-only (002 revoked their write privileges).
grant insert, update, delete on public.courses to authenticated;

-- 4. Enquiries: admins can read, update status/notes, and delete. The website keeps insert-only access.
drop policy if exists "Admins can read enquiries" on public.enquiries;
create policy "Admins can read enquiries"
  on public.enquiries for select to authenticated
  using ((select public.is_admin()));

drop policy if exists "Admins can update enquiries" on public.enquiries;
create policy "Admins can update enquiries"
  on public.enquiries for update to authenticated
  using ((select public.is_admin()))
  with check ((select public.is_admin()));

drop policy if exists "Admins can delete enquiries" on public.enquiries;
create policy "Admins can delete enquiries"
  on public.enquiries for delete to authenticated
  using ((select public.is_admin()));

grant select, delete on public.enquiries to authenticated;
-- Admins may only change the follow-up fields, never what the visitor submitted.
revoke update on public.enquiries from authenticated;
grant update (status, notes) on public.enquiries to authenticated;
revoke select, update, delete on public.enquiries from anon;

-- 5. Create the FIRST administrator (do this after running everything above):
--    a) Dashboard → Authentication → Users → "Add user" → "Create new user":
--       enter the admin's email and a strong password, tick "Auto Confirm User".
--    b) Run the statement below with that email (edit the address first):
--
--    insert into public.admin_users (user_id, role)
--    select id, 'owner' from auth.users where email = 'ADMIN-EMAIL@example.com'
--    on conflict (user_id) do nothing;
--
--    c) Dashboard → Authentication → Sign In / Providers → turn OFF "Allow new users to sign up",
--       so nobody can create an account from the outside.
