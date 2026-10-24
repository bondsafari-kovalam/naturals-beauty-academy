import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { cache } from 'react'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { notFound } from 'next/navigation'
import { SiteFooter } from '../../../components/site-footer'
import { SiteHeader } from '../../../components/site-header'
import { formatBlogDate, getBlogPost, getBlogSlugs, getRelatedPosts, siteUrl } from '../../../lib/blog'
import { canOptimize } from '../../../lib/images'
import { sanitizeBlogHtml } from '../../../lib/blog-html'

// Re-check every 5 minutes, so scheduled posts appear (and edits show) even without an admin refresh.
export const revalidate = 300

const loadPost = cache(getBlogPost)

export async function generateStaticParams() {
  return (await getBlogSlugs()).map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const post = await loadPost((await params).slug)
  if (!post) return { title: 'Article not found | Naturals Beauty Academy', robots: { index: false } }
  const title = post.seoTitle ?? `${post.title} | Naturals Beauty Academy`
  const description = post.metaDescription ?? post.excerpt
  const image = post.socialImage ?? post.image
  const images = image ? [{ url: image, alt: post.imageAlt || post.title }] : undefined
  return {
    title,
    description,
    keywords: [post.focusKeyword, ...post.tags].filter((value): value is string => Boolean(value)),
    authors: post.author ? [{ name: post.author }] : undefined,
    alternates: { canonical: post.canonicalUrl ?? `/blog/${post.slug}` },
    openGraph: {
      type: 'article', siteName: 'Naturals Beauty Academy', locale: 'en_IN', url: `/blog/${post.slug}`, title, description, images,
      publishedTime: post.publishedAt, modifiedTime: post.updatedAt, section: post.category.name, tags: post.tags, authors: post.author ? [post.author] : undefined,
    },
    twitter: { card: image ? 'summary_large_image' : 'summary', title, description, images: image ? [image] : undefined },
  }
}

export default async function BlogArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = await loadPost(slug)
  if (!post) notFound()
  const related = await getRelatedPosts(post)
  const url = `${siteUrl}/blog/${post.slug}`
  const share = [
    ['WhatsApp', `https://wa.me/?text=${encodeURIComponent(`${post.title} ${url}`)}`],
    ['Facebook', `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`],
    ['X', `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(post.title)}`],
    ['LinkedIn', `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`],
    ['Email', `mailto:?subject=${encodeURIComponent(post.title)}&body=${encodeURIComponent(url)}`],
  ] as const
  const absolute = (src: string) => (src.startsWith('/') ? `${siteUrl}${src}` : src)
  const structuredData = {
    '@context': 'https://schema.org', '@type': 'BlogPosting', headline: post.title, description: post.metaDescription ?? post.excerpt,
    datePublished: post.publishedAt, dateModified: post.updatedAt, mainEntityOfPage: url, articleSection: post.category.name,
    ...(post.image && { image: absolute(post.socialImage ?? post.image) }),
    author: { '@type': post.author && post.author !== 'Naturals Beauty Academy' ? 'Person' : 'Organization', name: post.author ?? 'Naturals Beauty Academy' },
    publisher: { '@type': 'Organization', name: 'Naturals Beauty Academy', logo: { '@type': 'ImageObject', url: `${siteUrl}/naturals-beauty-academy-logo.png` } },
  }

  return <><SiteHeader /><main className="blog-article-page"><div className="blog-article-shell">
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, '\\u003c') }} />
    <nav className="blog-breadcrumb" aria-label="Breadcrumb"><ol><li><Link href="/">Home</Link></li><li><Link href="/blog">Blog</Link></li><li><Link href={`/blog?category=${post.category.slug}`}>{post.category.name}</Link></li><li aria-current="page">{post.title}</li></ol></nav>
    <header className="blog-article-heading">
      <p className="section-label"><Link href={`/blog?category=${post.category.slug}`}>{post.category.name}</Link></p>
      <h1>{post.title}</h1>
      <p className="blog-article-intro">{post.excerpt}</p>
      <p className="blog-article-meta">
        {post.author && <span>By <strong>{post.author}</strong></span>}
        <span>Published <time dateTime={post.publishedAt}>{formatBlogDate(post.publishedAt)}</time></span>
        {post.lastReviewedAt && <span>Last reviewed <time dateTime={post.lastReviewedAt}>{formatBlogDate(post.lastReviewedAt)}</time></span>}
      </p>
    </header>
    {post.image && <figure className="blog-article-figure">
      <div className="blog-article-image"><Image src={post.image} alt={post.imageAlt} fill priority sizes="(max-width: 900px) 100vw, 900px" unoptimized={!canOptimize(post.image)} /></div>
      {post.imageCaption && <figcaption>{post.imageCaption}</figcaption>}
    </figure>}
    <article className="blog-article-copy blog-prose" dangerouslySetInnerHTML={{ __html: sanitizeBlogHtml(post.content) }} />
    {post.tags.length > 0 && <ul className="blog-tags" aria-label="Tags">{post.tags.map((tag) => <li key={tag}>#{tag}</li>)}</ul>}
    <div className="blog-share"><p className="section-label">Share this article</p><ul>{share.map(([label, href]) => <li key={label}><a href={href} target="_blank" rel="noopener noreferrer">{label}</a></li>)}</ul></div>
    <Link href="/blog" className="inner-back blog-back"><ArrowLeft /> Back to blog</Link>
  </div>
  {related.length > 0 && <section className="blog-related" aria-labelledby="related-heading"><div className="faculty-shell">
    <div className="faculty-heading"><p className="section-label">Keep reading</p><h2 id="related-heading">Related <em>articles.</em></h2></div>
    <div className="blog-grid">{related.map((item) => <article className="blog-card" key={item.id}>
      <Link href={`/blog/${item.slug}`} className="blog-card-image" tabIndex={-1} aria-hidden>{item.image ? <Image src={item.image} alt={item.imageAlt} fill sizes="(max-width: 600px) 90vw, (max-width: 900px) 45vw, 30vw" unoptimized={!canOptimize(item.image)} /> : <span className="blog-image-fallback">{item.category.name}</span>}</Link>
      <div className="blog-card-body"><div className="blog-card-meta"><span>{item.category.name}</span><time dateTime={item.publishedAt}>{formatBlogDate(item.publishedAt)}</time></div><h3><Link href={`/blog/${item.slug}`}>{item.title}</Link></h3><p>{item.excerpt}</p><Link href={`/blog/${item.slug}`} className="text-link" aria-label={`Read more: ${item.title}`}>Read more <ArrowRight /></Link></div>
    </article>)}</div>
  </div></section>}
  </main><SiteFooter /></>
}
