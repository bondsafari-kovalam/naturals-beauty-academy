import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { Suspense } from 'react'
import { ArrowLeft, ArrowRight, Search } from 'lucide-react'
import { ScrollRevealObserver } from '../../components/scroll-reveal-observer'
import { SiteFooter } from '../../components/site-footer'
import { SiteHeader } from '../../components/site-header'
import { BLOG_PAGE_SIZE, cleanSearch, formatBlogDate, getBlogListing, type BlogPost } from '../../lib/blog'
import { canOptimize } from '../../lib/images'
import { pageMetadata } from '../../lib/seo'
import { BlogGridSkeleton } from './blog-skeleton'

type Filters = { category: string; q: string; page: number }

const readFilters = (params: Record<string, string | string[] | undefined>): Filters => ({
  category: typeof params.category === 'string' ? params.category.slice(0, 120) : '',
  q: typeof params.q === 'string' ? cleanSearch(params.q) : '',
  page: Math.max(1, Number.parseInt(String(params.page ?? '1'), 10) || 1),
})

// Category and page views are their own canonical URLs; search results are crawlable but kept out of the index.
export async function generateMetadata({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }): Promise<Metadata> {
  const { category, q, page } = readFilters(await searchParams)
  const topic = category ? `${category.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())} Articles` : 'Beauty Tips & Career Advice Blog'
  return pageMetadata({
    title: page > 1 ? `${topic} – Page ${page}` : topic,
    description: 'Skincare routines, beauty tips, career guidance and academy stories from Naturals Beauty Academy, Alappuzha.',
    path: blogHref({ category, page }),
    robots: q ? { index: false, follow: true } : undefined,
  })
}

const blogHref = ({ category, q, page }: Partial<Filters>) => {
  const params = new URLSearchParams({ ...(category && { category }), ...(q && { q }), ...(page && page > 1 && { page: String(page) }) })
  return params.size ? `/blog?${params}` : '/blog'
}

export default async function BlogPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const filters = readFilters(await searchParams)

  return <><ScrollRevealObserver /><SiteHeader /><main className="blog-page">
    <section className="academy-hero blog-hero"><div className="academy-hero-inner"><p className="section-label">Beauty insights · Academy life</p><div className="academy-hero-copy"><h1>Learn, create and <em>grow.</em></h1><p>Skincare routines, beauty tips, career inspiration and stories from our classrooms in Alappuzha.</p></div></div></section>
    <section className="blog-section"><div className="faculty-shell">
      <Suspense key={`${filters.category}|${filters.q}|${filters.page}`} fallback={<BlogGridSkeleton />}>
        <BlogResults filters={filters} />
      </Suspense>
    </div></section>
  </main><SiteFooter /></>
}

async function BlogResults({ filters }: { filters: Filters }) {
  const { posts, total, featured, categories, activeCategory, error } = await getBlogListing(filters)
  const pages = Math.max(1, Math.ceil(total / BLOG_PAGE_SIZE))
  const filtered = Boolean(filters.category || filters.q)

  return <>
    {featured && <FeaturedPost post={featured} />}

    <div className="blog-tools">
      <div className="faculty-heading"><p className="section-label">From the academy</p><h2>{activeCategory ? <>{activeCategory.name} <em>articles.</em></> : <>Ideas for your <em>next step.</em></>}</h2></div>
      <form className="blog-search" role="search" action="/blog">
        {filters.category && <input type="hidden" name="category" value={filters.category} />}
        <label className="sr-only" htmlFor="blog-search">Search articles</label>
        <Search aria-hidden />
        <input id="blog-search" name="q" type="search" defaultValue={filters.q} placeholder="Search articles" maxLength={80} />
        <button type="submit">Search</button>
      </form>
    </div>

    {categories.length > 0 && <nav className="blog-chips" aria-label="Blog categories">
      <Link href={blogHref({ q: filters.q })} aria-current={!filters.category ? 'page' : undefined}>All articles</Link>
      {categories.map((c) => <Link key={c.slug} href={blogHref({ category: c.slug, q: filters.q })} aria-current={filters.category === c.slug ? 'page' : undefined}>{c.name}</Link>)}
    </nav>}

    {filtered && !error && <p className="blog-result-count" role="status">{total} article{total === 1 ? '' : 's'}{filters.q && <> for “{filters.q}”</>}{activeCategory && <> in {activeCategory.name}</>} · <Link href="/blog">Clear filters</Link></p>}

    {error
      ? <div className="blog-empty" role="alert"><h3>We couldn&rsquo;t load the articles.</h3><p>Please refresh the page or try again in a few minutes.</p></div>
      : posts.length === 0
        ? <div className="blog-empty"><h3>{filtered ? 'No articles match your search.' : featured ? 'More articles are on the way.' : 'No articles yet.'}</h3><p>{filtered ? 'Try another word or browse all categories.' : 'New beauty tips and academy stories are published regularly.'}</p>{filtered && <Link href="/blog" className="button button-light">View all articles</Link>}</div>
        : <div className="blog-grid">{posts.map((post) => <BlogCard key={post.id} post={post} />)}</div>}

    {pages > 1 && <nav className="blog-pagination" aria-label="Blog pages">
      {filters.page > 1 ? <Link href={blogHref({ ...filters, page: filters.page - 1 })} rel="prev"><ArrowLeft /> Newer</Link> : <span aria-hidden />}
      <span>Page {Math.min(filters.page, pages)} of {pages}</span>
      {filters.page < pages ? <Link href={blogHref({ ...filters, page: filters.page + 1 })} rel="next">Older <ArrowRight /></Link> : <span aria-hidden />}
    </nav>}
  </>
}

function PostImage({ post, sizes, priority }: { post: BlogPost; sizes: string; priority?: boolean }) {
  return post.image
    ? <Image src={post.image} alt={post.imageAlt} fill sizes={sizes} loading={priority ? 'eager' : undefined} fetchPriority={priority ? 'high' : undefined} unoptimized={!canOptimize(post.image)} />
    : <span className="blog-image-fallback" aria-hidden>{post.category.name}</span>
}

function FeaturedPost({ post }: { post: BlogPost }) {
  return <article className="blog-featured" data-reveal>
    <Link href={`/blog/${post.slug}`} className="blog-featured-image" tabIndex={-1} aria-hidden><PostImage post={post} sizes="(max-width: 900px) 92vw, 640px" priority /></Link>
    <div className="blog-featured-body">
      <p className="section-label">{post.isFeatured ? 'Featured article' : 'Latest article'} · {post.category.name}</p>
      <h2><Link href={`/blog/${post.slug}`}>{post.title}</Link></h2>
      <p>{post.excerpt}</p>
      <div className="blog-featured-meta"><time dateTime={post.publishedAt}>{formatBlogDate(post.publishedAt)}</time><Link href={`/blog/${post.slug}`} className="button button-dark">Read article <ArrowRight /></Link></div>
    </div>
  </article>
}

function BlogCard({ post }: { post: BlogPost }) {
  return <article className="blog-card" data-reveal>
    <Link href={`/blog/${post.slug}`} className="blog-card-image" tabIndex={-1} aria-hidden><PostImage post={post} sizes="(max-width: 600px) 90vw, (max-width: 900px) 45vw, 30vw" /></Link>
    <div className="blog-card-body">
      <div className="blog-card-meta"><span>{post.category.name}</span><time dateTime={post.publishedAt}>{formatBlogDate(post.publishedAt)}</time></div>
      <h3><Link href={`/blog/${post.slug}`}>{post.title}</Link></h3>
      <p>{post.excerpt}</p>
      <Link href={`/blog/${post.slug}`} className="text-link">Read more<span className="sr-only">: {post.title}</span> <ArrowRight /></Link>
    </div>
  </article>
}
