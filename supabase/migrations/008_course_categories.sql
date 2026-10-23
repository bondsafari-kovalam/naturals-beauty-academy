-- Course categories managed from the admin panel (Categories page).
-- courses.category stays a plain text column holding the category name, so existing courses
-- and the website keep working unchanged; this table is the list the admin picks from.
-- Run once in Supabase: Dashboard → SQL Editor → New query → paste → Run.
-- Safe to re-run: creates objects only if missing; existing categories are never changed.

create table if not exists public.course_categories (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(btrim(name)) between 1 and 100 and name = btrim(name)),
  sort_order integer not null default 0 check (sort_order >= 0),
  created_at timestamptz not null default now()
);

-- One category per name, ignoring case ("Mehandi" and "mehandi" are the same category).
create unique index if not exists course_categories_name_key on public.course_categories (lower(name));

-- Import the categories the website already uses, plus any other category found on existing courses.
insert into public.course_categories (name, sort_order)
select name, sort_order from (values
  ('Beauty Therapy', 1),
  ('Hair Dressing', 2),
  ('Makeup Artistry', 3),
  ('Nail Art & Extensions', 4),
  ('Cosmetology', 5),
  ('Beauty Therapy & Hair Dressing', 6),
  ('Hair Styling', 7),
  ('Personal Grooming', 8),
  ('Mehandi', 9)
) as known(name, sort_order)
on conflict do nothing;

insert into public.course_categories (name, sort_order)
select distinct on (lower(btrim(category))) btrim(category), 100
from public.courses
order by lower(btrim(category))
on conflict do nothing;

alter table public.course_categories enable row level security;

-- Category names are not private: anyone may read them; only admins may change them.
drop policy if exists "Public can view course categories" on public.course_categories;
create policy "Public can view course categories"
  on public.course_categories for select to anon, authenticated
  using (true);

drop policy if exists "Admins can manage course categories" on public.course_categories;
create policy "Admins can manage course categories"
  on public.course_categories for all to authenticated
  using ((select public.is_admin()))
  with check ((select public.is_admin()));

grant select on public.course_categories to anon, authenticated;
grant insert, update, delete on public.course_categories to authenticated;

notify pgrst, 'reload schema';
