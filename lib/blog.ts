import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import { getSupabaseEnv, isSupabaseConfigured } from './supabase/env'

// Same address as metadataBase in app/layout.tsx; used for share links and structured data.
export const siteUrl = 'https://naturalsbeautyacademypro.com'

export type BlogCategory = { name: string; slug: string }
export type BlogPost = {
  id: string
  slug: string
  title: string
  excerpt: string
  category: BlogCategory
  /** HTML from the admin editor. Always pass through sanitizeBlogHtml() before rendering. */
  content: string
  image: string | null
  imageAlt: string
  imageCaption: string | null
  publishedAt: string
  updatedAt: string
  lastReviewedAt: string | null
  author: string | null
  tags: string[]
  isFeatured: boolean
  seoTitle: string | null
  metaDescription: string | null
  focusKeyword: string | null
  canonicalUrl: string | null
  socialImage: string | null
}

export const BLOG_PAGE_SIZE = 9

type Row = Record<string, unknown> & { category?: { name: string; slug: string } | null }

const text = (value: unknown) => (typeof value === 'string' && value ? value : null)

function toPost(row: Row): BlogPost {
  return {
    id: String(row.id),
    slug: String(row.slug),
    title: String(row.title),
    excerpt: String(row.excerpt),
    category: row.category ?? { name: 'Blog', slug: '' },
    content: text(row.content) ?? '',
    image: text(row.featured_image),
    imageAlt: text(row.image_alt) ?? '',
    imageCaption: text(row.image_caption),
    publishedAt: String(row.published_at),
    updatedAt: text(row.updated_at) ?? String(row.published_at),
    lastReviewedAt: text(row.last_reviewed_at),
    author: text(row.author_name),
    tags: Array.isArray(row.tags) ? row.tags.filter((tag): tag is string => typeof tag === 'string') : [],
    isFeatured: row.is_featured === true,
    seoTitle: text(row.seo_title),
    metaDescription: text(row.meta_description),
    focusKeyword: text(row.focus_keyword),
    canonicalUrl: text(row.canonical_url),
    socialImage: text(row.social_image),
  }
}

// ---------------------------------------------------------------------------
// Fallback: the original hardcoded articles, used only when Supabase is not configured or the
// blog tables don't exist yet (009_blog.sql imports these same four articles into the database).
// ---------------------------------------------------------------------------
const paragraphs = (...items: string[]) => items.map((item) => `<p>${item}</p>`).join('')
const fallbackPost = (post: Pick<BlogPost, 'slug' | 'title' | 'excerpt' | 'category' | 'content' | 'image' | 'imageAlt' | 'publishedAt'>): BlogPost => ({
  ...post, id: post.slug, imageCaption: null, updatedAt: post.publishedAt, lastReviewedAt: null, author: 'Naturals Beauty Academy', tags: [], isFeatured: false,
  seoTitle: null, metaDescription: null, focusKeyword: null, canonicalUrl: null, socialImage: null,
})

const fallbackPosts: BlogPost[] = [
  fallbackPost({
    slug: 'starting-a-beauty-career', title: 'How to start your career in the beauty industry', category: { name: 'Career Guide', slug: 'career-guide' },
    excerpt: 'A practical guide to choosing your first beauty course, building confidence and taking your first professional step.',
    image: '/hero-beauty-makeup.jpg', imageAlt: 'Makeup artist at work', publishedAt: '2026-10-12T03:30:00.000Z',
    content: paragraphs('A successful beauty career starts with strong foundations. Whether you are interested in makeup, hair, skin or nails, practical training helps you build confidence faster.', 'Look for a course that combines demonstrations, guided practice and professional guidance. Your portfolio, communication skills and consistency are just as important as technique.', 'At Naturals Beauty Academy, our trainers help students turn their interest in beauty into a clear, practical career path.'),
  }),
  fallbackPost({
    slug: 'essential-makeup-kit', title: 'The essential makeup kit for beginners', category: { name: 'Makeup', slug: 'makeup' },
    excerpt: 'Start smart with the core products and tools every new makeup artist should understand before buying more.',
    image: '/certificate-course-personal-grooming.webp', imageAlt: 'Makeup products and tools', publishedAt: '2026-10-05T03:30:00.000Z',
    content: paragraphs('A beginner makeup kit does not need to be large. Start with products that help you understand skin preparation, complexion, eyes, lips and setting.', 'Invest in versatile brushes, clean tools and products that suit different skin tones. Learning how to use a small kit well is more valuable than collecting products.', 'As your skills grow, build your kit around the services you want to offer and the clients you want to serve.'),
  }),
  fallbackPost({
    slug: 'kerala-bridal-beauty', title: 'The timeless details of Kerala bridal beauty', category: { name: 'Bridal Beauty', slug: 'bridal-beauty' },
    excerpt: 'Explore the balance of tradition, skin preparation and modern artistry behind a beautiful Kerala bridal look.',
    image: '/kerala-makeup.jpg', imageAlt: 'Kerala bridal makeup look', publishedAt: '2026-09-28T03:30:00.000Z',
    content: paragraphs('Kerala bridal beauty is rooted in elegance and detail. The final look comes together through healthy skin preparation, a balanced base and thoughtful colour choices.', 'A professional artist also studies the saree, jewellery, lighting and the bride’s personal style before choosing the finish.', 'The best bridal makeup feels comfortable, photographs beautifully and lets the bride feel like herself on an important day.'),
  }),
  fallbackPost({
    slug: 'why-practical-training-matters', title: 'Why practical training matters in beauty education', category: { name: 'Academy Life', slug: 'academy-life' },
    excerpt: 'Beauty is a hands-on craft. Here is why guided practice makes such a difference to student confidence.',
    image: '/advanced-certificate-hair-dressing-enhanced.png', imageAlt: 'Student practising hair dressing', publishedAt: '2026-09-18T03:30:00.000Z',
    content: paragraphs('Beauty techniques become reliable through repetition. Practical training gives students the time and feedback they need to improve each step.', 'Working with real models also develops important professional skills: consultation, hygiene, time management and adapting to different needs.', 'A supportive classroom makes it easier to ask questions, correct mistakes and grow into a confident beauty professional.'),
  }),
]

// ---------------------------------------------------------------------------
// Supabase access (publishable key + Row Level Security: only live posts are readable).
// ---------------------------------------------------------------------------

function client() {
  if (!isSupabaseConfigured) return null
  const { url, key } = getSupabaseEnv()
  // Public, cookie-free client: blog content is the same for every visitor.
  return createSupabaseClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } })
}

type Supabase = NonNullable<ReturnType<typeof client>>
const LIST_COLUMNS = 'id, slug, title, excerpt, featured_image, image_alt, published_at, is_featured, category:blog_categories(name, slug)'

/** Live posts only. RLS enforces this too; the explicit filter keeps intent obvious and queries indexed. */
function livePosts(supabase: Supabase, columns: string, options?: { count: 'exact' }) {
  return supabase.from('blog_posts').select(columns, options).in('status', ['published', 'scheduled']).lte('published_at', new Date().toISOString())
}

// Missing tables (migration not run yet) → use the fallback articles; other errors are reported.
const isMissingTable = (error: { code?: string } | null) => error?.code === 'PGRST205' || error?.code === '42P01'

// PostgREST's or()/ilike filters treat , ( ) as syntax and % * as wildcards; strip them from visitor input.
export const cleanSearch = (value: string) => value.replace(/[,()%*\\:"]/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 80)

export type BlogListing = {
  posts: BlogPost[]
  total: number
  featured: BlogPost | null
  categories: BlogCategory[]
  activeCategory: BlogCategory | null
  error: boolean
}

function matches(post: BlogPost, q: string) {
  const needle = q.toLowerCase()
  return [post.title, post.excerpt, post.content.replace(/<[^>]+>/g, ' ')].some((value) => value.toLowerCase().includes(needle))
}

function fallbackListing(categorySlug: string, q: string, page: number): BlogListing {
  const categories = [...new Map(fallbackPosts.map((post) => [post.category.slug, post.category])).values()]
  const activeCategory = categories.find((c) => c.slug === categorySlug) ?? null
  const showFeatured = !categorySlug && !q && page === 1
  const featured = showFeatured ? fallbackPosts[0] : null
  const filtered = fallbackPosts.filter((post) => post !== featured && (!activeCategory || post.category.slug === activeCategory.slug) && (!q || matches(post, q)))
  return { posts: filtered.slice((page - 1) * BLOG_PAGE_SIZE, page * BLOG_PAGE_SIZE), total: filtered.length, featured, categories, activeCategory, error: false }
}

/** Blog listing: live posts, newest first, with optional category (slug) and search filters. */
export async function getBlogListing({ category = '', q = '', page = 1 }: { category?: string; q?: string; page?: number }): Promise<BlogListing> {
  const search = cleanSearch(q)
  let supabase: Supabase | null
  try { supabase = client() } catch { supabase = null }
  if (!supabase) return fallbackListing(category, search, page)

  try {
    const [categoryRows, usedRows] = await Promise.all([
      supabase.from('blog_categories').select('id, name, slug').order('sort_order').order('name'),
      livePosts(supabase, 'category_id'),
    ])
    if (isMissingTable(categoryRows.error) || isMissingTable(usedRows.error)) return fallbackListing(category, search, page)
    if (categoryRows.error || usedRows.error) throw categoryRows.error ?? usedRows.error

    // Only offer categories that have at least one live post.
    const used = new Set((usedRows.data as unknown as { category_id: string }[]).map((row) => row.category_id))
    const allCategories = categoryRows.data ?? []
    const categories = allCategories.filter((c) => used.has(c.id)).map(({ name, slug }) => ({ name, slug }))
    const active = allCategories.find((c) => c.slug === category) ?? null

    // Featured article: only on the unfiltered first page; the newest featured post, else the newest post.
    let featured: BlogPost | null = null
    if (!category && !search && page === 1) {
      const { data } = await livePosts(supabase, LIST_COLUMNS).order('is_featured', { ascending: false }).order('published_at', { ascending: false }).limit(1)
      featured = data?.[0] ? toPost(data[0] as unknown as Row) : null
    }

    let query = livePosts(supabase, LIST_COLUMNS, { count: 'exact' })
    if (category) query = query.eq('category_id', active?.id ?? '00000000-0000-0000-0000-000000000000')
    if (search) query = query.or(`title.ilike.%${search}%,excerpt.ilike.%${search}%,content.ilike.%${search}%`)
    if (featured) query = query.neq('id', featured.id)
    const { data, count, error } = await query.order('published_at', { ascending: false }).range((page - 1) * BLOG_PAGE_SIZE, page * BLOG_PAGE_SIZE - 1)
    // A page past the end is a range error (PGRST103), not an empty list.
    if (error && error.code !== 'PGRST103') throw error

    return {
      posts: ((data ?? []) as unknown as Row[]).map(toPost),
      total: count ?? 0,
      featured,
      categories,
      activeCategory: active ? { name: active.name, slug: active.slug } : null,
      error: false,
    }
  } catch (error) {
    console.warn('Blog: could not load posts:', error instanceof Error ? error.message : error)
    return { posts: [], total: 0, featured: null, categories: [], activeCategory: null, error: true }
  }
}

/** One live post by slug, or null (drafts and not-yet-due scheduled posts are never returned). */
export async function getBlogPost(slug: string): Promise<BlogPost | null> {
  let supabase: Supabase | null
  try { supabase = client() } catch { supabase = null }
  if (!supabase) return fallbackPosts.find((post) => post.slug === slug) ?? null
  const { data, error } = await livePosts(supabase, '*, category:blog_categories(name, slug)').eq('slug', slug).maybeSingle()
  if (isMissingTable(error)) return fallbackPosts.find((post) => post.slug === slug) ?? null
  if (error) throw new Error(`Blog post could not be loaded: ${error.message}`)
  return data ? toPost(data as unknown as Row) : null
}

/** Up to `limit` other live posts, same category first, then the newest of the rest. */
export async function getRelatedPosts(post: BlogPost, limit = 3): Promise<BlogPost[]> {
  let supabase: Supabase | null
  try { supabase = client() } catch { supabase = null }
  const fromFallback = () => [...fallbackPosts.filter((p) => p.slug !== post.slug && p.category.slug === post.category.slug), ...fallbackPosts.filter((p) => p.slug !== post.slug && p.category.slug !== post.category.slug)].slice(0, limit)
  if (!supabase) return fromFallback()
  try {
    const { data: category, error } = await supabase.from('blog_categories').select('id').eq('slug', post.category.slug).maybeSingle()
    if (isMissingTable(error)) return fromFallback()
    const same = category
      ? await livePosts(supabase, LIST_COLUMNS).eq('category_id', category.id).neq('id', post.id).order('published_at', { ascending: false }).limit(limit)
      : { data: [], error: null }
    if (isMissingTable(same.error)) return fromFallback()
    const related = ((same.data ?? []) as unknown as Row[]).map(toPost)
    if (related.length < limit) {
      const exclude = [post.id, ...related.map((p) => p.id)]
      const { data } = await livePosts(supabase, LIST_COLUMNS).not('id', 'in', `(${exclude.join(',')})`).order('published_at', { ascending: false }).limit(limit - related.length)
      related.push(...((data ?? []) as unknown as Row[]).map(toPost))
    }
    return related
  } catch {
    return []
  }
}

/** Slugs of live posts, for pre-rendering article pages at build time. */
export async function getBlogSlugs(): Promise<string[]> {
  let supabase: Supabase | null
  try { supabase = client() } catch { supabase = null }
  if (!supabase) return fallbackPosts.map((post) => post.slug)
  const { data, error } = await livePosts(supabase, 'slug')
  if (error) return isMissingTable(error) ? fallbackPosts.map((post) => post.slug) : []
  return (data as unknown as { slug: string }[]).map((row) => row.slug)
}

const IST = 'Asia/Kolkata'
export const formatBlogDate = (value: string) => new Intl.DateTimeFormat('en-IN', { day: 'numeric', month: 'long', year: 'numeric', timeZone: IST }).format(new Date(value))
