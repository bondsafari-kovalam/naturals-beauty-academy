import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { SiteFooter } from '../../../components/site-footer'
import { SiteHeader } from '../../../components/site-header'

// Unknown, unpublished, cancelled or completed workshop links (e.g. an old ad) land here.
export default function WorkshopNotFound() {
  return <><SiteHeader /><main className="workshops-page">
    <section className="wl-hero wl-hero--empty"><div className="wl-empty">
      <p className="section-label">Workshops · Alappuzha</p>
      <h1>This workshop is <em>no longer available.</em></h1>
      <p className="wl-lead">It may have finished, been rescheduled or been cancelled. See what&rsquo;s coming up next.</p>
      <div className="wl-hero-actions"><Link href="/workshops" className="button button-dark">Upcoming workshops <ArrowRight /></Link><Link href="/contact" className="button button-light">Contact us</Link></div>
    </div></section>
  </main><SiteFooter /></>
}
