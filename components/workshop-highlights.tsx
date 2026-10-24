'use client'

import Image from 'next/image'
import { canOptimize } from '../lib/images'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { ArrowRight, CalendarDays, Clock, MapPin } from 'lucide-react'
import { type Workshop, academyToday, nextWorkshop, workshopDateParts, workshopRegisterUrl } from '../lib/site-config'

export function WorkshopHighlights({ label }: { label: string }) {
  // Pick the workshop in the browser after mount so a static homepage never shows a finished workshop.
  const [workshop, setWorkshop] = useState<Workshop | null | undefined>(undefined)
  useEffect(() => {
    fetch('/api/workshops')
      .then((response) => response.ok ? response.json() as Promise<Workshop[]> : [])
      .then((catalog) => setWorkshop(nextWorkshop(academyToday(), catalog) ?? null))
      .catch(() => setWorkshop(nextWorkshop(academyToday()) ?? null))
  }, [])
  if (!workshop) return null

  const date = workshopDateParts(workshop.date)
  return <section id="workshops" className="workshop-section section"><div className="section-heading"><div><div className="section-label">{label}</div><h2>Upcoming <em>workshop.</em></h2></div><Link href={workshop.slug ? `/workshops/${workshop.slug}` : '/workshops'} className="text-link">Workshop details <ArrowRight /></Link></div>
    <article className="workshop-spotlight"><div className="workshop-spotlight-image"><Image src={workshop.image} unoptimized={!canOptimize(workshop.image)} alt={`${workshop.title} workshop`} fill sizes="(max-width: 900px) 90vw, 50vw" /><span className="workshop-date"><strong>{date.day}</strong>{date.month}</span></div><div className="workshop-spotlight-body"><p className="card-tag">{workshop.category} workshop</p><h3>{workshop.title}</h3><ul className="workshop-meta"><li><CalendarDays />{date.label} &middot; {workshop.duration}</li><li><Clock />{workshop.time}</li><li><MapPin />{workshop.location ?? 'At the academy, Alappuzha'}</li></ul><p>{workshop.description}</p>{workshop.seats && <span className="workshop-seats">{workshop.seats}</span>}<div className="workshop-spotlight-actions"><a href={workshopRegisterUrl(workshop)} target="_blank" rel="noreferrer" className="button button-dark">Register on WhatsApp <ArrowRight /></a><Link href={workshop.slug ? `/workshops/${workshop.slug}` : '/workshops'} className="button button-light">View details</Link></div></div></article>
  </section>
}
