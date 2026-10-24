'use client' // Error boundaries must be Client Components

import Link from 'next/link'
import { useEffect } from 'react'
import { ArrowRight, MessageCircle, RotateCcw } from 'lucide-react'
import { SiteFooter } from '../components/site-footer'
import { SiteHeader } from '../components/site-header'
import { whatsappUrl } from '../lib/site-config'

// Shown when a page fails to load (for example the database is briefly unreachable). Server errors reach the
// browser with a generic message and a reference (digest) that matches the server log, never the details.
export default function ErrorPage({ error, retry }: { error: unknown; retry: () => void }) {
  useEffect(() => {
    console.error(error)
  }, [error])
  const reference = error instanceof Error && 'digest' in error && typeof error.digest === 'string' ? error.digest : null

  return <><SiteHeader /><main className="workshops-page">
    <section className="wl-hero wl-hero--empty"><div className="wl-empty" role="alert">
      <p className="section-label">Something went wrong</p>
      <h1>We couldn&rsquo;t load <em>this page.</em></h1>
      <p className="wl-lead">This is usually temporary. Please try again in a moment. If it keeps happening, message us and we&rsquo;ll help you straight away.</p>
      <div className="wl-hero-actions">
        <button type="button" onClick={() => retry()} className="button button-dark"><RotateCcw /> Try again</button>
        <Link href="/" className="button button-light">Back to home <ArrowRight /></Link>
        <a href={whatsappUrl()} target="_blank" rel="noreferrer" className="button button-light"><MessageCircle /> WhatsApp us</a>
      </div>
      {reference && <p className="wl-lead"><small>Reference: {reference}</small></p>}
    </div></section>
  </main><SiteFooter /></>
}
