'use client'

import Image from 'next/image'
import { canOptimize } from '../lib/images'
import Link from 'next/link'
import { useCallback, useEffect, useRef, useState } from 'react'
import { ArrowLeft, ArrowRight, BadgeCheck, ChevronDown, GraduationCap, Mail, Phone, Quote, Sparkles, Star, UsersRound, Video } from 'lucide-react'
import { type Course, coursePath } from '../lib/site-config'
import type { Testimonial } from '../lib/testimonials'
import { ScrollRevealObserver } from '../components/scroll-reveal-observer'
import { SiteFooter } from '../components/site-footer'
import { SiteHeader } from '../components/site-header'
import { WorkshopHighlights } from '../components/workshop-highlights'

const images = {
  hero: '/kerala-makeup.jpg',
  heroInset: '/kerala-hair.jpg',
  class: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=1000&q=85',
}

const faqs = [
  ['Who are the courses for?', 'Our courses are for beginners, aspiring beauty professionals and anyone looking to develop practical skills for a career in the beauty industry.'],
  ['What courses can I study?', 'Explore courses in beauty therapy, hair dressing, makeup artistry, nail art, cosmetology, personal grooming and mehandi. Visit the Courses page to find a programme that suits your interests.'],
  ['Are the courses certified?', 'Yes. Our courses lead to certification approved by the Beauty & Wellness Sector Skill Council (BWSSC), along with ISO-accredited certification from Naturals Beauty Academy.'],
  ['Do you help with placements?', 'Yes. We offer 100% placement assistance and connect students with salons and beauty brands. Across the Naturals Beauty Academy network, 95% of students are placed in jobs locally and internationally, and many find a job even before completing their course.'],
  ['Where is Naturals Beauty Academy located?', 'Our academy is in Alappuzha, Kerala. Contact our team for directions or to arrange a visit.'],
  ['How can I enquire about a course?', 'Choose Enquire Now or use the contact form to tell us which course interests you. Our team will help with the next steps.'],
]

function BenefitsSection() {
  const benefits = [
    { title: 'Premium Study Labs', description: 'Learn in professional spaces designed for hands-on beauty education.', icon: GraduationCap },
    { title: 'Experienced Trainers', description: 'Build your skills with guidance from knowledgeable beauty educators.', icon: UsersRound },
    { title: 'High Quality Products', description: 'Practise with quality products used across beauty services.', icon: BadgeCheck },
    { title: '100% Live Classes', description: 'Take part in live, instructor-led sessions with practical learning.', icon: Video },
  ]

  return <section className="benefits-section"><div className="benefits-shell"><div className="benefits-heading"><p className="section-label">04 / The Naturals advantage</p><h2>Learn with <em>confidence.</em></h2><p>Everything you need to build practical skills and take your next step in beauty.</p></div><div className="benefits-grid">{benefits.map(({ title, description, icon: Icon }, index) => <article className="benefit-card" data-reveal key={title}><span className="benefit-icon"><Icon /></span><span className="benefit-number">{String(index + 1).padStart(2, '0')}</span><h3>{title}</h3><p>{description}</p></article>)}</div></div></section>
}

// Published testimonials from the admin panel (Testimonials section); loaded on the server in app/page.tsx.
// The cards scroll right to left in a continuous loop: each group repeats the list until it is wide
// enough to fill the row, and a second, hidden copy of the group makes the loop seamless.
function TestimonialsSection({ testimonials }: { testimonials: Testimonial[] }) {
  if (testimonials.length === 0) return null
  const repeats = Math.ceil(4 / testimonials.length)
  const loop = Array.from({ length: repeats }, () => testimonials).flat()
  const card = ({ id, quote, name, course, location, rating }: Testimonial, i: number) => <figure className="testimonial-card" key={`${id}-${i}`}><span className="testimonial-icon"><Quote /></span><div className="testimonial-stars" aria-label={`Rated ${rating} out of 5`}>{Array.from({ length: rating }, (_, s) => <Star key={s} aria-hidden="true" />)}</div><blockquote>&ldquo;{quote}&rdquo;</blockquote><figcaption><span className="testimonial-avatar" aria-hidden="true">{name.charAt(0)}</span><span><strong>{name}</strong>{(course || location) && <span>{[course, location].filter(Boolean).join(' · ')}</span>}</span></figcaption></figure>
  return <section id="testimonials" className="testimonials-section"><div className="testimonials-shell"><div className="testimonials-heading" data-reveal><p className="section-label">06 / Student stories</p><h2>Loved by our <em>learners.</em></h2><p>Hear from students who began their beauty journey with Naturals Beauty Academy.</p></div><div className="testimonials-marquee" data-reveal aria-label="Student testimonials"><div className="testimonials-track" style={{ animationDuration: `${loop.length * 8}s` }}><div className="testimonials-group">{testimonials.map(card)}{loop.slice(testimonials.length).map((t, i) => <div className="testimonials-repeat" aria-hidden="true" key={`r-${i}`}>{card(t, i)}</div>)}</div><div className="testimonials-group" aria-hidden="true">{loop.map(card)}</div></div></div></div></section>
}

function HelpSection() {
  return <section className="help-section"><div className="help-shell"><div className="help-heading"><p className="section-label">Here for you</p><h2>How can we <em>help?</em></h2><p>Have a question? We&rsquo;re happy to help you find the information you need.</p></div><div className="help-grid"><article className="help-card help-faq-card" data-reveal><span className="help-icon"><Sparkles /></span><p className="help-kicker">Need an answer?</p><h3>Frequently asked questions</h3><p>If you have questions about products, orders or account info, you may find the answer in our FAQ.</p><a href="#faqs" className="help-action">Browse FAQs <ArrowRight /></a></article><article className="help-card" data-reveal><span className="help-icon"><Phone /></span><p className="help-kicker">Give us a call</p><h3>Talk to our team</h3><p>You can always give us a call: Mon to Fri from 9 am till 7 pm EST.</p><a href="tel:08929660506" className="help-contact">08929660506</a></article><article className="help-card" data-reveal><span className="help-icon"><Mail /></span><p className="help-kicker">Drop us a line</p><h3>We&rsquo;re one email away</h3><p>Drop us a line and we will get back to you as soon as possible.</p><a href="mailto:om@naturalsbeautyacademypro.com" className="help-contact help-email">om@naturalsbeautyacademypro.com</a></article></div></div></section>
}

const courseGroups: Array<{ label: string; categories?: string[] }> = [
  { label: 'All courses' },
  { label: 'Beauty Therapy', categories: ['Beauty Therapy'] },
  { label: 'Hair Dressing', categories: ['Hair Dressing'] },
  { label: 'Makeup Artistry', categories: ['Makeup Artistry'] },
  { label: 'Nail Art', categories: ['Nail Art & Extensions'] },
  { label: 'Cosmetology', categories: ['Cosmetology'] },
  { label: 'Beauty & Hair', categories: ['Beauty Therapy & Hair Dressing'] },
  { label: 'Certificate Courses', categories: ['Hair Styling', 'Personal Grooming', 'Mehandi'] },
]

const coursesInGroup = (group: (typeof courseGroups)[number], courseCatalog: Course[]) => group.categories ? courseCatalog.filter((course) => group.categories!.includes(course.category)) : courseCatalog

// Categories added from the admin panel get their own filter button, after the built-in groups.
function courseGroupsFor(courseCatalog: Course[]) {
  const grouped = new Set(courseGroups.flatMap((group) => group.categories ?? []))
  const extra = [...new Set(courseCatalog.map((course) => course.category))].filter((category) => !grouped.has(category))
  return [...courseGroups, ...extra.map((category) => ({ label: category, categories: [category] }))]
}

function CourseCarousel({ courseCatalog }: { courseCatalog: Course[] }) {
  const trackRef = useRef<HTMLDivElement>(null)
  const [activeGroup, setActiveGroup] = useState(0)
  const groups = courseGroupsFor(courseCatalog)
  const visibleCourses = coursesInGroup(groups[activeGroup] ?? groups[0], courseCatalog)
  const [hovered, setHovered] = useState(false)
  const [focused, setFocused] = useState(false)
  const [reducedMotion, setReducedMotion] = useState(false)
  const isPaused = hovered || focused || reducedMotion

  useEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)')
    const updatePreference = () => setReducedMotion(preference.matches)
    updatePreference()
    preference.addEventListener('change', updatePreference)
    return () => preference.removeEventListener('change', updatePreference)
  }, [])

  const move = useCallback((direction: number) => {
    const track = trackRef.current
    const card = track?.querySelector<HTMLElement>('.course-card')
    if (!track || !card) return

    const gap = Number.parseFloat(window.getComputedStyle(track).columnGap) || 0
    const step = card.getBoundingClientRect().width + gap
    const atEnd = track.scrollLeft + track.clientWidth >= track.scrollWidth - 4
    const atStart = track.scrollLeft <= 4
    const behavior: ScrollBehavior = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'

    if (direction > 0 && atEnd) track.scrollTo({ left: 0, behavior })
    else if (direction < 0 && atStart) track.scrollTo({ left: track.scrollWidth, behavior })
    else track.scrollBy({ left: direction * step, behavior })
  }, [])

  // On a filter change, start from the first card and show newly mounted cards straight away,
  // since the one-time scroll-reveal observer never sees them.
  const filterChanged = useRef(false)
  useEffect(() => {
    if (!filterChanged.current) return
    const track = trackRef.current
    if (!track) return
    track.scrollTo({ left: 0 })
    track.querySelectorAll('[data-reveal]').forEach((card) => card.classList.add('is-visible'))
  }, [activeGroup])

  useEffect(() => {
    if (isPaused) return
    const timer = window.setInterval(() => move(1), 4000)
    return () => window.clearInterval(timer)
  }, [isPaused, move])

  return (
    <div className="course-carousel" role="region" aria-roledescription="carousel" aria-label="Featured courses" onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)} onFocus={() => setFocused(true)} onBlur={(event) => { if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setFocused(false) }}>
      <div className="course-filters" aria-label="Filter courses by category">{groups.map((group, i) => <button type="button" key={group.label} aria-pressed={activeGroup === i} onClick={() => { filterChanged.current = true; setActiveGroup(i) }}>{group.label}<span>{coursesInGroup(group, courseCatalog).length}</span></button>)}</div>
      <div className="course-grid" ref={trackRef} tabIndex={0} aria-label="Course cards. Use the previous and next controls to browse.">
        {visibleCourses.map((course, i) => <Link href={coursePath(course.slug)} className="course-card" data-reveal key={course.slug} aria-label={`View details for ${course.title}`}><div className="course-image"><Image src={course.image} unoptimized={!canOptimize(course.image)} alt={course.imageAlt ?? `${course.title} training`} fill sizes="(max-width: 600px) 86vw, (max-width: 900px) 45vw, 30vw" /><span>{String(i + 1).padStart(2, '0')}</span></div><p className="card-tag">{course.category}</p><h3>{course.title}</h3>{course.duration && <p className="course-duration">Duration: {course.duration}</p>}<p>{course.description}</p><span className="course-card-action">View course <ArrowRight /></span></Link>)}
      </div>
      <div className="course-carousel-controls">
        <button type="button" onClick={() => move(-1)} aria-label="Previous courses"><ArrowLeft /></button>
        <button type="button" onClick={() => move(1)} aria-label="Next courses"><ArrowRight /></button>
      </div>
    </div>
  )
}

// The homepage UI. Course data is loaded on the server in app/page.tsx and passed in.
export function HomePage({ courses, testimonials }: { courses: Course[]; testimonials: Testimonial[] }) {
  const [activeFaq, setActiveFaq] = useState(0)
  return <><ScrollRevealObserver /><SiteHeader /><main><section className="hero"><div className="hero-copy"><p className="eyebrow">NATURALS BEAUTY ACADEMY <span>·</span> ALAPPUZHA</p><h1>Learn the basics.<br /><em>Master the art.</em></h1><span className="hero-divider" aria-hidden="true" /><p className="hero-sub">Start your beautiful career.</p><p className="hero-text">Discover professional beauty education through practical learning in hair, skin, makeup and more.</p><div className="hero-actions"><Link href="/courses" className="button button-dark">Explore courses <ArrowRight /></Link><Link href="/contact" className="button button-light">Enquire now</Link></div><ul className="hero-trust"><li><BadgeCheck />BWSSC &amp; ISO certified courses</li><li><UsersRound />Hands-on, live training</li></ul></div><div className="hero-visual"><div className="hero-image"><Image src={images.hero} alt="Smiling Kerala bride in a kasavu saree with professional makeup, gold jewellery and jasmine, in a makeup studio" fill priority sizes="(max-width: 860px) min(440px, calc(100vw - 60px)), 500px" /></div><div className="hero-inset"><Image src={images.heroInset} alt="Beauty student styling a Kerala bridal bun with jasmine flowers" fill sizes="140px" /></div><div className="image-card"><strong>Kerala elegance,</strong><span>modern artistry.</span></div></div></section><section id="courses" className="course-section section"><div className="section-heading" data-reveal><div><div className="section-label">01 / Learn your craft</div><h2>Find your <em>direction.</em></h2></div><Link href="/courses" className="text-link">View all courses <ArrowRight /></Link></div><CourseCarousel courseCatalog={courses} /></section><WorkshopHighlights label="02 / Hands-on workshops" /><section className="intro section"><div className="section-label">03 / About Naturals</div><div className="intro-grid"><h2 data-reveal>India&rsquo;s largest salon chain. <em>Now educating.</em></h2><div><p>Naturals Beauty Academy — an educational vertical of India&rsquo;s largest chain of salons — is designed and developed with a focus on educating and upskilling beauty career aspirants. We aim to provide an International Standard of Beauty education with a strong emphasis on the hands-on aspect of training.</p><p>In addition to offering great modern facilities with the latest machinery, equipment and products, we create a learning environment that inspires confidence and creative growth.</p><p>As part of the Naturals Beauty Academy network of 30+ academies, which has helped transform the careers of more than 40,000 people, our Alappuzha academy brings BWSSC-approved, ISO-accredited certification and 100% placement assistance to students in Kerala.</p></div></div></section><BenefitsSection /><section className="brands-section"><p className="section-label brands-title">Our Brands</p><div className="brands-marquee-wrap"><div className="brands-marquee-track">{[{src:'/brand-mac.png',alt:'M·A·C Cosmetics'},{src:'/brand-lagirl.jpg',alt:'L.A. Girl'},{src:'/brand-loreal.jpg',alt:"L'Oréal Paris"},{src:'/brand-wow.jpg',alt:'WOW Skin Science'},{src:'/brand-sugar.png',alt:'Sugar Cosmetics'},{src:'/brand-asap.png',alt:'ASAP'},{src:'/brand-naturals.png',alt:'Naturals'},{src:'/brand-biotique.png',alt:'Biotique'},{src:'/brand-maybelline.png',alt:'Maybelline New York'},{src:'/brand-colorbar.png',alt:'Colorbar'},{src:'/brand-lakme.png',alt:'Lakmé'},{src:'/brand-mac.png',alt:'M·A·C Cosmetics'},{src:'/brand-lagirl.jpg',alt:'L.A. Girl'},{src:'/brand-loreal.jpg',alt:"L'Oréal Paris"},{src:'/brand-wow.jpg',alt:'WOW Skin Science'},{src:'/brand-sugar.png',alt:'Sugar Cosmetics'},{src:'/brand-asap.png',alt:'ASAP'},{src:'/brand-naturals.png',alt:'Naturals'},{src:'/brand-biotique.png',alt:'Biotique'},{src:'/brand-maybelline.png',alt:'Maybelline New York'},{src:'/brand-colorbar.png',alt:'Colorbar'},{src:'/brand-lakme.png',alt:'Lakmé'}].map((b,i)=><div key={i} className="brand-logo-item"><Image src={b.src} alt={b.alt} width={160} height={68} sizes="200px" /></div>)}</div></div></section><section className="feature section"><div className="feature-media" data-reveal><div className="feature-image"><Image src={images.class} alt="Beauty students learning together in a bright classroom" fill sizes="(max-width: 900px) 90vw, 44vw" /></div><div className="feature-badge"><span className="feature-badge-icon"><Sparkles /></span><span><strong>Hands-on</strong>from day one</span></div></div><div className="feature-copy" data-reveal><div className="section-label">05 / The experience</div><h2>Learn by doing. <em>Grow by creating.</em></h2><p>From first brush strokes to polished, professional finishes, every lesson is built around practical progress and personal expression.</p><div className="stats"><div><strong>01</strong><span>Learn the foundations</span></div><div><strong>02</strong><span>Practise with guidance</span></div><div><strong>03</strong><span>Build your confidence</span></div></div></div></section>{testimonials.length > 0 && <TestimonialsSection testimonials={testimonials} />}<section id="faqs" className="faq-section section"><div className="section-label">07 / Good to know</div><div className="faq-grid"><h2>Your next chapter<br /><em>starts here.</em></h2><div className="faq-list">{faqs.map(([q, a], i) => <article className="faq-item" key={q} data-reveal><button type="button" id={`faq-question-${i}`} aria-expanded={activeFaq === i} aria-controls={`faq-answer-${i}`} onClick={() => setActiveFaq(activeFaq === i ? -1 : i)}>{q}<ChevronDown /></button><div id={`faq-answer-${i}`} className="faq-answer" data-open={activeFaq === i} role="region" aria-labelledby={`faq-question-${i}`} aria-hidden={activeFaq !== i}><div className="faq-answer-inner"><p>{a}</p></div></div></article>)}</div></div></section><HelpSection /><section className="contact-banner" data-reveal><div><p className="eyebrow">READY WHEN YOU ARE</p><h2>Make beauty your <em>beautiful career.</em></h2></div><Link href="/contact" className="button button-light">Start a conversation <ArrowRight /></Link></section></main><SiteFooter /></>
}
