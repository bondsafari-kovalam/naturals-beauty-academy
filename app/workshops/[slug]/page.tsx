import type { Metadata } from 'next'
import Image from 'next/image'
import { canOptimize } from '../../../lib/images'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowRight, CalendarDays, Check, ChevronDown, Clock, Gift, Hourglass, IndianRupee, MapPin, MessageCircle, Ticket, UsersRound } from 'lucide-react'
import { ScrollRevealObserver } from '../../../components/scroll-reveal-observer'
import { SiteFooter } from '../../../components/site-footer'
import { SiteHeader } from '../../../components/site-header'
import { WorkshopCountdown } from '../../../components/workshop-countdown'
import { WorkshopCampaignTracker } from '../../../components/workshop-campaign-tracker'
import { WorkshopRegistrationForm } from '../../../components/workshop-registration-form'
import { academyToday, workshopDateParts, workshopStartsAt, type Workshop } from '../../../lib/site-config'
import { getWorkshopBySlug, loadWorkshops, registrationBlock } from '../../../lib/workshops'
import { workshopWhatsappUrl } from '../../../lib/workshop-campaign'

// Seats-left and "registration closed" refresh at least every minute; the database re-checks on submit.
export const revalidate = 60

export async function generateStaticParams() {
  return (await loadWorkshops()).workshops.filter((w) => w.date >= academyToday()).map((w) => ({ slug: w.slug! }))
}

const summary = (workshop: Workshop) => workshop.shortDescription ?? (workshop.description.length > 160 ? `${workshop.description.slice(0, 157).trimEnd()}…` : workshop.description)

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { workshop } = await getWorkshopBySlug((await params).slug)
  if (!workshop) return { title: 'Workshop not found | Naturals Beauty Academy', robots: { index: false } }
  const title = `${workshop.title} – ${workshopDateParts(workshop.date).label} | Naturals Beauty Academy`
  const description = summary(workshop)
  const images = [{ url: workshop.image, alt: `${workshop.title} workshop` }]
  return {
    title, description,
    alternates: { canonical: `/workshops/${workshop.slug}` },
    // A finished workshop stays reachable for old links but is kept out of search results.
    robots: workshop.date < academyToday() ? { index: false, follow: true } : undefined,
    openGraph: { type: 'website', siteName: 'Naturals Beauty Academy', locale: 'en_IN', url: `/workshops/${workshop.slug}`, title, description, images },
    twitter: { card: 'summary_large_image', title, description, images: [workshop.image] },
  }
}

function splitTitle(title: string) {
  const words = title.split(' ')
  return { lead: words.slice(0, -1).join(' '), last: words[words.length - 1] }
}

const BLOCKED: Record<'ended' | 'closed' | 'full', { title: string; text: string }> = {
  ended: { title: 'This workshop has ended.', text: 'Thank you for your interest. Have a look at our upcoming workshops, or message us to hear about the next one.' },
  closed: { title: 'Registrations are closed.', text: 'Online registration for this workshop has closed. Message us on WhatsApp and our team will help you.' },
  full: { title: 'All seats are taken.', text: 'This workshop is full. Message us on WhatsApp to join the waiting list or hear about the next date.' },
}

export default async function WorkshopCampaignPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const { workshop, error } = await getWorkshopBySlug(slug)
  if (error) throw new Error('Workshops could not be loaded.')
  if (!workshop) notFound()

  const date = workshopDateParts(workshop.date)
  const title = splitTitle(workshop.title)
  const block = registrationBlock(workshop)
  const whatsappUrl = workshopWhatsappUrl(workshop)
  const location = workshop.location ?? 'Naturals Beauty Academy, Alappuzha'
  const seatsText = workshop.seatsLeft !== undefined && workshop.totalSeats !== undefined
    ? (workshop.seatsLeft > 0 ? `${workshop.seatsLeft} of ${workshop.totalSeats} seats left` : 'Fully booked')
    : workshop.seats ?? 'Limited seats'
  const facts = [
    { label: 'Date', value: date.label, icon: CalendarDays },
    { label: 'Time', value: workshop.time, icon: Clock },
    { label: 'Duration', value: workshop.duration, icon: Hourglass },
    { label: 'Venue', value: workshop.location ?? 'At the academy', icon: MapPin },
    { label: 'Fee', value: workshop.fee ?? 'Contact us', icon: IndianRupee },
    { label: 'Seats', value: seatsText, icon: Ticket },
  ]
  const event = {
    '@context': 'https://schema.org', '@type': 'Event', name: workshop.title, description: summary(workshop),
    startDate: workshopStartsAt(workshop), eventStatus: 'https://schema.org/EventScheduled', eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    image: [workshop.image.startsWith('/') ? `https://naturalsbeautyacademypro.com${workshop.image}` : workshop.image],
    location: { '@type': 'Place', name: location, address: 'Alappuzha, Kerala, India' },
    organizer: { '@type': 'Organization', name: 'Naturals Beauty Academy', url: 'https://naturalsbeautyacademypro.com' },
  }
  let step = 0
  const next = () => String(++step).padStart(2, '0')

  return <><ScrollRevealObserver /><SiteHeader /><WorkshopCampaignTracker workshop={{ slug: workshop.slug!, title: workshop.title }} /><main className="workshops-page">
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(event).replace(/</g, '\\u003c') }} />
    <section className="wl-hero"><div className="wl-hero-inner">
      <div className="wl-hero-copy">
        <p className="section-label">{block === 'ended' ? 'Past workshop' : 'Upcoming workshop'} · {workshop.category}</p>
        <h1>{title.lead} <em>{title.last}.</em></h1>
        <p className="wl-lead">{workshop.shortDescription ?? workshop.description}</p>
        <ul className="wl-hero-meta"><li><CalendarDays />{date.label}</li><li><Clock />{workshop.time}</li><li><MapPin />{location}</li></ul>
        <div className="wl-hero-actions">
          {!block && <a href="#register" className="button button-dark">Register now <ArrowRight /></a>}
          {whatsappUrl && <a href={whatsappUrl} target="_blank" rel="noreferrer" className={`button ${block ? 'button-dark' : 'button-light'}`}><MessageCircle /> Ask on WhatsApp</a>}
          {block === 'ended' && <Link href="/workshops" className="button button-light">Upcoming workshops</Link>}
        </div>
        {block !== 'ended' && <><p className="section-label wl-countdown-title">Workshop starts in</p><WorkshopCountdown startsAt={workshopStartsAt(workshop)} /></>}
      </div>
      <div className="feature-media" data-reveal><div className="feature-image"><Image src={workshop.image} unoptimized={!canOptimize(workshop.image)} alt={`${workshop.title} workshop`} fill priority sizes="(max-width: 900px) 90vw, 46vw" /></div><div className="feature-badge"><span className="feature-badge-icon"><CalendarDays /></span><span><strong>{date.day} {date.month}</strong>{seatsText}</span></div></div>
    </div></section>

    <section className="wl-facts wl-facts--six" aria-label="Workshop details">{facts.map(({ label, value, icon: Icon }) => <div className="wl-fact" key={label}><span className="wl-fact-icon"><Icon /></span><span><small>{label}</small><strong>{value}</strong></span></div>)}</section>

    {workshop.shortDescription && workshop.description && <section className="wl-section wr-about"><div data-reveal><p className="section-label">About the workshop</p><p className="wr-about-text">{workshop.description}</p></div></section>}

    {!!workshop.highlights?.length && <section className="wl-section wl-split" id="learn"><div data-reveal><p className="section-label">{next()} / What you&rsquo;ll learn</p><h2>Skills you can use <em>straight away.</em></h2><p>Every technique is demonstrated by your trainer and then practised by you, with personal guidance throughout the session.</p></div><ul className="wl-learn-list">{workshop.highlights.map((item) => <li key={item} data-reveal><span><Check /></span>{item}</li>)}</ul></section>}

    {(!!workshop.audience?.length || !!workshop.includes?.length) && <section className="wl-band"><div className="wl-band-inner">
      {!!workshop.audience?.length && <article className="wl-panel" data-reveal><span className="benefit-icon"><UsersRound /></span><p className="section-label">Who it&rsquo;s for</p><h3>Perfect if you are&hellip;</h3><ul>{workshop.audience.map((item) => <li key={item}>{item}</li>)}</ul></article>}
      {!!workshop.includes?.length && <article className="wl-panel" data-reveal><span className="benefit-icon"><Gift /></span><p className="section-label">What&rsquo;s included</p><h3>Everything you need</h3><ul>{workshop.includes.map((item) => <li key={item}>{item}</li>)}</ul></article>}
    </div></section>}

    {(!!workshop.agenda?.length || workshop.trainer) && <section className="wl-section wl-split wl-split--agenda">
      {!!workshop.agenda?.length && <div data-reveal><p className="section-label">{next()} / The day</p><h2>How the day <em>flows.</em></h2><ol className="wl-agenda">{workshop.agenda.map((item) => <li key={item.time + item.title}><span>{item.time}</span><strong>{item.title}</strong></li>)}</ol></div>}
      {workshop.trainer && <article className="wl-trainer" data-reveal><div className="wl-trainer-image"><Image src={workshop.trainer.image} unoptimized={!canOptimize(workshop.trainer.image)} alt={`${workshop.trainer.name}, ${workshop.trainer.role}`} fill sizes="(max-width: 900px) 90vw, 380px" /></div><div className="wl-trainer-body"><p className="card-tag">Your trainer</p><h3>{workshop.trainer.name}</h3><p>{workshop.trainer.role}</p><Link href="/faculty" className="text-link">Meet our faculty <ArrowRight /></Link></div></article>}
    </section>}

    <section className="wr-section" id="register"><div className="wr-inner">
      <div className="wr-copy" data-reveal>
        <p className="section-label">{next()} / Register</p>
        <h2>Save your seat for <em>{workshop.title}.</em></h2>
        <ul className="wr-facts"><li><CalendarDays />{date.label} · {workshop.time}</li><li><MapPin />{location}</li>{workshop.fee && <li><IndianRupee />{workshop.fee}</li>}<li><Ticket />{seatsText}</li></ul>
        {whatsappUrl
          ? <div className="wr-whatsapp"><p>Prefer to talk to us first?</p><a href={whatsappUrl} target="_blank" rel="noreferrer" className="button button-light"><MessageCircle /> Enquire on WhatsApp</a></div>
          : <div className="wr-whatsapp"><p>Questions? <Link href="/contact" className="text-link">Contact the academy <ArrowRight /></Link></p></div>}
      </div>
      <div className="wr-card" data-reveal>
        {block
          ? <div className="wr-closed"><h3>{BLOCKED[block].title}</h3><p>{BLOCKED[block].text}</p><div className="wr-closed-actions">{whatsappUrl && <a href={whatsappUrl} target="_blank" rel="noreferrer" className="button button-dark"><MessageCircle /> WhatsApp us</a>}<Link href="/workshops" className="button button-light">Upcoming workshops</Link></div></div>
          : <><h3>Register online</h3><p className="wr-card-lead">Fill in your details and our team will contact you to confirm your seat.</p><WorkshopRegistrationForm slug={workshop.slug!} title={workshop.title} whatsappUrl={whatsappUrl} /></>}
      </div>
    </div></section>

    {!!workshop.faqs?.length && <section className="faq-section section"><div className="section-label">{next()} / Good to know</div><div className="faq-grid"><h2>Questions about <br /><em>the workshop?</em></h2><div className="wl-faq-list">{workshop.faqs.map(([q, a]) => <details key={q}><summary>{q}<ChevronDown /></summary><p>{a}</p></details>)}</div></div></section>}
  </main><SiteFooter /></>
}
