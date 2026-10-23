-- Storage for course images uploaded from the admin panel.
-- Requires 004_admin_auth.sql (uses public.is_admin()).
-- Run in Supabase: Dashboard → SQL Editor → New query → paste → Run.
-- Safe to re-run: creates or updates the bucket settings and policies only; never deletes files.

-- Public bucket: images are served to website visitors by URL (…/storage/v1/object/public/course-images/…).
-- Supabase also enforces the size and type limits here, not only the admin form.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('course-images', 'course-images', true, 5242880, array['image/jpeg', 'image/png', 'image/webp', 'image/avif'])
on conflict (id) do update
  set public = true,
      file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

-- A public bucket serves files by URL without any policy, so visitors need no SELECT policy.
-- Removing the old one stops anonymous visitors LISTING every file in the bucket.
drop policy if exists "Public can view course images" on storage.objects;

-- Admins can list/read objects (also needed to replace and delete files).
drop policy if exists "Admins can view course images" on storage.objects;
create policy "Admins can view course images"
  on storage.objects for select to authenticated
  using (bucket_id = 'course-images' and (select public.is_admin()));

drop policy if exists "Admins can upload course images" on storage.objects;
create policy "Admins can upload course images"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'course-images' and (select public.is_admin()));

drop policy if exists "Admins can update course images" on storage.objects;
create policy "Admins can update course images"
  on storage.objects for update to authenticated
  using (bucket_id = 'course-images' and (select public.is_admin()))
  with check (bucket_id = 'course-images' and (select public.is_admin()));

drop policy if exists "Admins can delete course images" on storage.objects;
create policy "Admins can delete course images"
  on storage.objects for delete to authenticated
  using (bucket_id = 'course-images' and (select public.is_admin()));
