import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, CalendarDays, Clock, IndianRupee, MapPin, MessageCircle, Ticket } from 'lucide-react'
import { ScrollRevealObserver } from '../../components/scroll-reveal-observer'
import { SiteFooter } from '../../components/site-footer'
import { SiteHeader } from '../../components/site-header'
import { UtmLink, WorkshopCampaignTracker } from '../../components/workshop-campaign-tracker'
import { workshopDateParts, type Workshop } from '../../lib/site-config'
import { getUpcomingWorkshops, registrationBlock } from '../../lib/workshops'
import { whatsappNumber } from '../../lib/workshop-campaign'

export const metadata: Metadata = {
  title: 'Workshops | Naturals Beauty Academy',
  description: 'Hands-on beauty workshops at Naturals Beauty Academy, Alappuzha. See upcoming dates and register online.',
  alternates: { canonical: '/workshops' },
}

// Re-check every minute so finished workshops drop off and seat counts stay fresh.
export const revalidate = 60

function availability(workshop: Workshop) {
  const block = registrationBlock(workshop)
  if (block === 'full') return { text: 'Fully booked', tone: 'full' }
  if (block === 'closed') return { text: 'Registration closed', tone: 'full' }
  if (workshop.seatsLeft !== undefined) return { text: `${workshop.seatsLeft} seat${workshop.seatsLeft === 1 ? '' : 's'} left`, tone: workshop.seatsLeft <= 5 ? 'low' : 'open' }
  return workshop.seats ? { text: workshop.seats, tone: 'open' } : null
}

export default async function WorkshopsPage() {
  const { workshops, error } = await getUpcomingWorkshops()
  const number = whatsappNumber()
  const notifyUrl = number ? `https://wa.me/${number}?text=${encodeURIComponent('Hello, please let me know when the next workshop at Naturals Beauty Academy is announced.')}` : null

  return <><ScrollRevealObserver /><SiteHeader /><WorkshopCampaignTracker /><main className="workshops-page">
    <section className="academy-hero"><div className="academy-hero-inner"><p className="section-label">Workshops · Alappuzha</p><div className="academy-hero-copy"><h1>Learn a new skill in <em>a single day.</em></h1><p>Hands-on workshops led by our trainers, twice a month. Pick a date, register online and we&rsquo;ll confirm your seat.</p></div></div></section>

    <section className="ws-list" aria-labelledby="ws-list-title"><div className="faculty-shell">
      <div className="ws-list-head"><div><p className="section-label">Upcoming</p><h2 id="ws-list-title">Upcoming <em>workshops.</em></h2></div>{workshops.length > 0 && <p>{workshops.length} workshop{workshops.length === 1 ? '' : 's'} scheduled</p>}</div>

      {error ? <div className="ws-empty" role="alert"><h3>We couldn&rsquo;t load the workshops.</h3><p>Please refresh the page in a moment, or contact us for the latest dates.</p><Link href="/contact" className="button button-light">Contact us</Link></div>
        : workshops.length === 0 ? <div className="ws-empty"><h3>New workshop dates are coming soon.</h3><p>We run around two workshops every month. Message us and we&rsquo;ll let you know as soon as registrations open.</p><div className="ws-empty-actions">{notifyUrl && <a href={notifyUrl} target="_blank" rel="noreferrer" className="button button-dark"><MessageCircle /> Notify me on WhatsApp</a>}<Link href="/courses" className="button button-light">Explore courses</Link></div></div>
          : <ul className="ws-grid">{workshops.map((workshop) => {
            const date = workshopDateParts(workshop.date)
            const seats = availability(workshop)
            const href = `/workshops/${workshop.slug}`
            return <li key={workshop.slug} className="ws-card" data-reveal>
              <UtmLink href={href} className="ws-card-image" tabIndex={-1} aria-hidden>
                <Image src={workshop.image} alt="" fill sizes="(max-width: 640px) 92vw, (max-width: 1000px) 46vw, 370px" />
                <span className="ws-date"><strong>{date.day}</strong>{date.month}</span>
                {seats && <span className={`ws-seats ws-seats--${seats.tone}`}>{seats.text}</span>}
              </UtmLink>
              <div className="ws-card-body">
                <p className="card-tag">{workshop.category}</p>
                <h3><UtmLink href={href}>{workshop.title}</UtmLink></h3>
                <p className="ws-summary">{workshop.shortDescription ?? workshop.description}</p>
                <ul className="ws-meta">
                  <li><CalendarDays aria-hidden />{date.label}</li>
                  <li><Clock aria-hidden />{workshop.time}</li>
                  <li><MapPin aria-hidden />{workshop.location ?? 'At the academy, Alappuzha'}</li>
                  {workshop.fee && <li><IndianRupee aria-hidden />{workshop.fee}</li>}
                  {!seats && workshop.duration && <li><Ticket aria-hidden />{workshop.duration}</li>}
                </ul>
                <UtmLink href={href} className="button button-dark ws-cta" aria-label={`View details and register: ${workshop.title}`}>View details &amp; register <ArrowRight /></UtmLink>
              </div>
            </li>
          })}</ul>}
    </div></section>
  </main><SiteFooter /></>
}
