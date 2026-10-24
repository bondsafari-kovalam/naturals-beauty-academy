import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

// These pages still hold placeholder text, so search engines are asked not to index them until the
// academy's real FAQ and testimonials content is added.
export const metadata: Metadata = { robots: { index: false, follow: true } }

const content: Record<string, { title: string; intro: string }> = {
  testimonials: { title: 'Testimonials', intro: 'Discover what learners value about a hands-on beauty education.' },
  faq: { title: 'Frequently Asked Questions', intro: 'Find helpful answers about the academy and learning experience.' },
}

export default async function InnerPage({ params }: { params: Promise<{ slug: string[] }> }) {
  const { slug } = await params
  if (slug.length !== 1) notFound()
  const page = content[slug[0]]
  if (!page) notFound()
  return <main className="inner-page"><Link href="/" className="inner-back">← Back home</Link><p className="eyebrow">NATURALS BEAUTY ACADEMY · ALAPPUZHA</p><h1>{page.title}</h1><p className="inner-intro">{page.intro}</p><div className="inner-card"><p>We are shaping thoughtful, practical beauty education for the next generation of professionals. This page is ready for the academy&apos;s approved course, workshop and contact content.</p><Link href="/contact" className="button button-dark">Enquire Now</Link></div></main>
}

export function generateStaticParams() { return Object.keys(content).map((slug) => ({ slug: [slug] })) }
