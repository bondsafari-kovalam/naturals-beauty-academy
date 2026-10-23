-- Website enquiries. Run this once in Supabase: Dashboard → SQL Editor → New query → paste → Run.

create table if not exists public.enquiries (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null check (char_length(name) between 1 and 120),
  email text not null check (char_length(email) <= 254),
  phone text check (char_length(phone) <= 40),
  message text not null check (char_length(message) between 1 and 5000),
  source text not null default 'contact-form' check (char_length(source) <= 60),
  status text not null default 'new' check (status in ('new', 'contacted', 'enrolled', 'closed')),
  notes text
);

create index if not exists enquiries_created_at_idx on public.enquiries (created_at desc);

-- Row Level Security: the website (publishable key) may only ADD new enquiries.
-- It can never read, change or delete them, so visitors' details stay private.
-- Staff view and manage enquiries in the Supabase dashboard (Table Editor → enquiries).
alter table public.enquiries enable row level security;

drop policy if exists "Website can submit new enquiries" on public.enquiries;
create policy "Website can submit new enquiries"
  on public.enquiries
  for insert
  to anon, authenticated
  with check (status = 'new' and notes is null);

grant insert on public.enquiries to anon, authenticated;
