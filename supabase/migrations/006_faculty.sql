-- Faculty profiles managed from the admin panel.
create table if not exists public.faculty (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 1 and 200),
  role text not null check (char_length(role) between 1 and 200),
  department text not null check (char_length(department) between 1 and 120),
  section text not null default 'trainer' check (section in ('director', 'head', 'trainer')),
  experience text,
  bio text,
  specialities jsonb not null default '[]'::jsonb check (jsonb_typeof(specialities) = 'array'),
  image_url text not null default '/placeholder-user.jpg' check (image_url ~ '^(/|https://)'),
  image_alt text,
  sort_order integer not null default 0 check (sort_order >= 0),
  is_published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists faculty_listing_idx on public.faculty (section, sort_order, name);
alter table public.faculty enable row level security;

drop policy if exists "Public can view published faculty" on public.faculty;
create policy "Public can view published faculty"
  on public.faculty for select to anon, authenticated
  using (is_published = true);

drop policy if exists "Admins can manage faculty" on public.faculty;
create policy "Admins can manage faculty"
  on public.faculty for all to authenticated
  using ((select public.is_admin()))
  with check ((select public.is_admin()));

grant select on public.faculty to anon, authenticated;
grant insert, update, delete on public.faculty to authenticated;

notify pgrst, 'reload schema';
