-- Workshops managed from the admin panel.
create table if not exists public.workshops (
  id uuid primary key default gen_random_uuid(),
  title text not null check (char_length(title) between 1 and 200),
  date date not null,
  start_time time not null default '10:00',
  time_label text not null check (char_length(time_label) between 1 and 120),
  duration text not null check (char_length(duration) between 1 and 100),
  category text not null check (char_length(category) between 1 and 100),
  description text not null check (char_length(description) between 1 and 3000),
  image_url text not null check (image_url ~ '^(/|https://)'),
  location text,
  seats text,
  fee text,
  highlights jsonb not null default '[]'::jsonb,
  audience jsonb not null default '[]'::jsonb,
  includes jsonb not null default '[]'::jsonb,
  agenda jsonb not null default '[]'::jsonb,
  trainer jsonb,
  faqs jsonb not null default '[]'::jsonb,
  sort_order integer not null default 0 check (sort_order >= 0),
  is_published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists workshops_listing_idx on public.workshops (date, sort_order);
alter table public.workshops enable row level security;

drop policy if exists "Public can view published workshops" on public.workshops;
create policy "Public can view published workshops"
  on public.workshops for select to anon, authenticated
  using (is_published = true);

drop policy if exists "Admins can manage workshops" on public.workshops;
create policy "Admins can manage workshops"
  on public.workshops for all to authenticated
  using ((select public.is_admin()))
  with check ((select public.is_admin()));

grant select on public.workshops to anon, authenticated;
grant insert, update, delete on public.workshops to authenticated;

notify pgrst, 'reload schema';
