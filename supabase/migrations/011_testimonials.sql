-- Student testimonials shown on the homepage, managed from the admin panel (Testimonials section).
-- Requires 002_courses.sql (set_updated_at trigger function) and 004_admin_auth.sql (public.is_admin()).
-- Run once in Supabase: Dashboard → SQL Editor → New query → paste → Run.
-- Safe to re-run: creates objects only if missing; never drops tables or changes data.

create table if not exists public.testimonials (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(btrim(name)) between 1 and 120),
  course text check (course is null or char_length(course) <= 200),
  location text check (location is null or char_length(location) <= 120),
  quote text not null check (char_length(btrim(quote)) between 1 and 1000),
  rating integer not null default 5 check (rating between 1 and 5),
  sort_order integer not null default 0 check (sort_order >= 0),
  is_published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists testimonials_listing_idx on public.testimonials (is_published, sort_order, created_at);

drop trigger if exists testimonials_set_updated_at on public.testimonials;
create trigger testimonials_set_updated_at
  before update on public.testimonials
  for each row execute function public.set_updated_at();

-- Visitors (publishable key) see published testimonials only; only admins can add, edit or delete.
alter table public.testimonials enable row level security;

drop policy if exists "Public can view published testimonials" on public.testimonials;
create policy "Public can view published testimonials"
  on public.testimonials for select to anon, authenticated
  using (is_published = true);

drop policy if exists "Admins can manage testimonials" on public.testimonials;
create policy "Admins can manage testimonials"
  on public.testimonials for all to authenticated
  using ((select public.is_admin()))
  with check ((select public.is_admin()));

grant select on public.testimonials to anon, authenticated;
grant insert, update, delete on public.testimonials to authenticated;

notify pgrst, 'reload schema';
