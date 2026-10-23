-- Blog posts and blog categories, managed from the admin panel (Blog section).
-- Requires 002_courses.sql (set_updated_at trigger function) and 004_admin_auth.sql (public.is_admin()).
-- Images are stored in the existing course-images bucket (005_course_images_storage.sql), under blog/.
-- Run once in Supabase: Dashboard → SQL Editor → New query → paste → Run.
-- Safe to re-run: creates objects only if missing; existing categories and posts are never changed.

-- ---------------------------------------------------------------------------
-- Categories
-- ---------------------------------------------------------------------------
create table if not exists public.blog_categories (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 1 and 100 and name = btrim(name)),
  slug text not null unique check (char_length(slug) <= 120 and slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  sort_order integer not null default 0 check (sort_order >= 0),
  created_at timestamptz not null default now()
);

create unique index if not exists blog_categories_name_key on public.blog_categories (lower(name));

-- ---------------------------------------------------------------------------
-- Posts
-- status: draft      → never public
--         published  → public from published_at
--         scheduled  → public automatically once published_at has passed (no job needed:
--                      the visibility rule below compares published_at with now())
-- ---------------------------------------------------------------------------
create table if not exists public.blog_posts (
  id uuid primary key default gen_random_uuid(),
  title text not null check (char_length(btrim(title)) between 1 and 200),
  slug text not null unique check (char_length(slug) <= 120 and slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  excerpt text not null check (char_length(btrim(excerpt)) between 1 and 500),
  -- Sanitised HTML from the admin editor. The website sanitises it again before rendering.
  content text not null default '' check (char_length(content) <= 200000),
  featured_image text check (featured_image is null or featured_image ~ '^(/|https://)'),
  image_alt text check (image_alt is null or char_length(image_alt) <= 300),
  image_caption text check (image_caption is null or char_length(image_caption) <= 300),
  category_id uuid not null references public.blog_categories (id) on delete restrict,
  tags text[] not null default '{}' check (cardinality(tags) <= 20),
  author_name text check (author_name is null or char_length(author_name) <= 120),
  author_id uuid default auth.uid() references auth.users (id) on delete set null,
  seo_title text check (seo_title is null or char_length(seo_title) <= 120),
  meta_description text check (meta_description is null or char_length(meta_description) <= 320),
  focus_keyword text check (focus_keyword is null or char_length(focus_keyword) <= 100),
  canonical_url text check (canonical_url is null or canonical_url ~ '^https://'),
  social_image text check (social_image is null or social_image ~ '^(/|https://)'),
  status text not null default 'draft' check (status in ('draft', 'published', 'scheduled')),
  is_featured boolean not null default false,
  published_at timestamptz,
  last_reviewed_at date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint blog_posts_publish_date check (status = 'draft' or published_at is not null)
);

create index if not exists blog_posts_public_idx on public.blog_posts (status, published_at desc);
create index if not exists blog_posts_category_idx on public.blog_posts (category_id);

drop trigger if exists blog_posts_set_updated_at on public.blog_posts;
create trigger blog_posts_set_updated_at
  before update on public.blog_posts
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- Row Level Security
-- Visitors (publishable key) can read categories and only the posts that are live right now.
-- Drafts and not-yet-due scheduled posts are invisible to them at the database level.
-- Only admins (public.is_admin()) can create, edit, publish or delete.
-- ---------------------------------------------------------------------------
alter table public.blog_categories enable row level security;
alter table public.blog_posts enable row level security;

drop policy if exists "Public can view blog categories" on public.blog_categories;
create policy "Public can view blog categories"
  on public.blog_categories for select to anon, authenticated
  using (true);

drop policy if exists "Admins can manage blog categories" on public.blog_categories;
create policy "Admins can manage blog categories"
  on public.blog_categories for all to authenticated
  using ((select public.is_admin()))
  with check ((select public.is_admin()));

drop policy if exists "Public can view live blog posts" on public.blog_posts;
create policy "Public can view live blog posts"
  on public.blog_posts for select to anon, authenticated
  using (status in ('published', 'scheduled') and published_at <= now());

drop policy if exists "Admins can manage blog posts" on public.blog_posts;
create policy "Admins can manage blog posts"
  on public.blog_posts for all to authenticated
  using ((select public.is_admin()))
  with check ((select public.is_admin()));

grant select on public.blog_categories, public.blog_posts to anon, authenticated;
grant insert, update, delete on public.blog_categories, public.blog_posts to authenticated;

-- ---------------------------------------------------------------------------
-- Starting data: suggested categories, plus the four articles that were hardcoded in
-- lib/blog.ts (imported as published so the live blog does not lose them).
-- ---------------------------------------------------------------------------
insert into public.blog_categories (name, slug, sort_order) values
  ('Skincare Routines', 'skincare-routines', 1),
  ('Skin Science', 'skin-science', 2),
  ('Ingredient Spotlight', 'ingredient-spotlight', 3),
  ('Beauty Tips', 'beauty-tips', 4),
  ('Product Education', 'product-education', 5),
  ('Hair Care', 'hair-care', 6),
  ('Beauty Trends', 'beauty-trends', 7),
  ('Naturals Beauty News', 'naturals-beauty-news', 8),
  ('Career Guide', 'career-guide', 9),
  ('Makeup', 'makeup', 10),
  ('Bridal Beauty', 'bridal-beauty', 11),
  ('Academy Life', 'academy-life', 12)
on conflict do nothing;

insert into public.blog_posts (title, slug, excerpt, content, featured_image, image_alt, category_id, author_name, status, published_at, author_id)
select p.title, p.slug, p.excerpt, p.content, p.image, p.image_alt, c.id, 'Naturals Beauty Academy', 'published', p.published_at, null
from (values
  ('How to start your career in the beauty industry', 'starting-a-beauty-career',
   'A practical guide to choosing your first beauty course, building confidence and taking your first professional step.',
   '<p>A successful beauty career starts with strong foundations. Whether you are interested in makeup, hair, skin or nails, practical training helps you build confidence faster.</p><p>Look for a course that combines demonstrations, guided practice and professional guidance. Your portfolio, communication skills and consistency are just as important as technique.</p><p>At Naturals Beauty Academy, our trainers help students turn their interest in beauty into a clear, practical career path.</p>',
   '/hero-beauty-makeup.jpg', 'Makeup artist at work', 'career-guide', timestamptz '2026-10-12 09:00+05:30'),
  ('The essential makeup kit for beginners', 'essential-makeup-kit',
   'Start smart with the core products and tools every new makeup artist should understand before buying more.',
   '<p>A beginner makeup kit does not need to be large. Start with products that help you understand skin preparation, complexion, eyes, lips and setting.</p><p>Invest in versatile brushes, clean tools and products that suit different skin tones. Learning how to use a small kit well is more valuable than collecting products.</p><p>As your skills grow, build your kit around the services you want to offer and the clients you want to serve.</p>',
   '/certificate-course-personal-grooming.webp', 'Makeup products and tools', 'makeup', timestamptz '2026-10-05 09:00+05:30'),
  ('The timeless details of Kerala bridal beauty', 'kerala-bridal-beauty',
   'Explore the balance of tradition, skin preparation and modern artistry behind a beautiful Kerala bridal look.',
   '<p>Kerala bridal beauty is rooted in elegance and detail. The final look comes together through healthy skin preparation, a balanced base and thoughtful colour choices.</p><p>A professional artist also studies the saree, jewellery, lighting and the bride’s personal style before choosing the finish.</p><p>The best bridal makeup feels comfortable, photographs beautifully and lets the bride feel like herself on an important day.</p>',
   '/kerala-makeup.jpg', 'Kerala bridal makeup look', 'bridal-beauty', timestamptz '2026-09-28 09:00+05:30'),
  ('Why practical training matters in beauty education', 'why-practical-training-matters',
   'Beauty is a hands-on craft. Here is why guided practice makes such a difference to student confidence.',
   '<p>Beauty techniques become reliable through repetition. Practical training gives students the time and feedback they need to improve each step.</p><p>Working with real models also develops important professional skills: consultation, hygiene, time management and adapting to different needs.</p><p>A supportive classroom makes it easier to ask questions, correct mistakes and grow into a confident beauty professional.</p>',
   '/advanced-certificate-hair-dressing-enhanced.png', 'Student practising hair dressing', 'academy-life', timestamptz '2026-09-18 09:00+05:30')
) as p(title, slug, excerpt, content, image, image_alt, category_slug, published_at)
join public.blog_categories c on c.slug = p.category_slug
on conflict (slug) do nothing;

notify pgrst, 'reload schema';
