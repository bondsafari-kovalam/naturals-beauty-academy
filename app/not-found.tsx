import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, MessageCircle } from 'lucide-react'
import { SiteFooter } from '../components/site-footer'
import { SiteHeader } from '../components/site-header'
import { whatsappUrl } from '../lib/site-config'

export const metadata: Metadata = { title: 'Page not found | Naturals Beauty Academy' }

// Any URL that does not exist, and any notFound() without a closer not-found page, lands here.
export default function NotFound() {
  return <><SiteHeader /><main className="workshops-page">
    <section className="wl-hero wl-hero--empty"><div className="wl-empty">
      <p className="section-label">Error 404 · Page not found</p>
      <h1>This page has <em>moved or no longer exists.</em></h1>
      <p className="wl-lead">The link may be old or mistyped. Explore our courses, or contact us and we&rsquo;ll help you find what you need.</p>
      <div className="wl-hero-actions">
        <Link href="/" className="button button-dark">Back to home <ArrowRight /></Link>
        <Link href="/courses" className="button button-light">Explore courses</Link>
        <a href={whatsappUrl()} target="_blank" rel="noreferrer" className="button button-light"><MessageCircle /> WhatsApp us</a>
      </div>
    </div></section>
  </main><SiteFooter /></>
}
