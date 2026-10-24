import Link from 'next/link'
import { ArrowLeft, ArrowRight, Clock3, Mail, MapPin, Phone } from 'lucide-react'
import { ContactForm } from '../../components/contact-form'
import { getCourses } from '../../lib/courses'
import { SiteFooter } from '../../components/site-footer'
import { SiteHeader } from '../../components/site-header'

export const metadata = {
  title: 'Contact | Naturals Beauty Academy',
  description: 'Get in touch with Naturals Beauty Academy in Alappuzha, Kerala.',
  alternates: { canonical: '/contact' },
}

const academyAddress = 'Cheriya Kalavoor Temple, ASAP Community Skill Park (Additional Skill Acquisition Program), Behind Little Flower Nursery, Alappuzha, Kerala 688522, India'
const mapLink = 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(academyAddress)

// Pre-built and refreshed at most every 5 minutes (courses come from Supabase). The ?course=<slug> link from a
// course page is read in the browser by ContactForm, so the page does not have to render on every visit.
export const revalidate = 300

export default async function ContactPage() {
  const courses = await getCourses()
  return <><SiteHeader /><main className="contact-page">
    <section className="contact-hero"><div className="contact-hero-inner"><Link href="/" className="contact-back"><ArrowLeft /> Back home</Link><p className="section-label">Naturals Beauty Academy · Alappuzha</p><h1>We&rsquo;d love to <em>hear from you.</em></h1><p>We would love to hear from you—and even more to meet you in person. Below you can find all our contact details. See you soon!</p><a href="#contact-details" className="contact-hero-link">Find our details <ArrowRight /></a><span className="contact-hero-orb" /></div></section>

    <section className="contact-details section" id="contact-details"><div className="contact-details-heading"><div><p className="section-label">Get in touch</p><h2>We&rsquo;re here to <em>help.</em></h2></div><p>Send us a note anytime—we welcome feedback and requests.</p></div><div className="contact-info-grid">
      <article className="contact-info-card"><a href="tel:08929660506" className="contact-info-icon" aria-label="Call Naturals Beauty Academy"><Phone /></a><p className="contact-info-label">Give us a call</p><h3>Talk to our team</h3><p>Mon – Fri, 9 AM – 7 PM</p><a href="tel:08929660506" className="contact-info-link">08929660506 <ArrowRight /></a></article>
      <article className="contact-info-card"><span className="contact-info-icon"><Mail /></span><p className="contact-info-label">Write us an email</p><h3>Drop us a line</h3><p>We&rsquo;ll get back to you as soon as possible.</p><a href="mailto:om@naturalsbeautyacademypro.com" className="contact-info-link contact-email">om@naturalsbeautyacademypro.com <ArrowRight /></a></article>
      <article className="contact-info-card contact-address-card"><a href={mapLink} target="_blank" rel="noreferrer" className="contact-info-icon" aria-label="Open Naturals Beauty Academy in Google Maps"><MapPin /></a><p className="contact-info-label">Come and visit</p><h3>Find the academy</h3><p>We are located in Aleppy.</p><a href={mapLink} target="_blank" rel="noreferrer" className="contact-address-link">{academyAddress}<span>Get directions <ArrowRight /></span></a></article>
      <article className="contact-info-card"><span className="contact-info-icon"><Clock3 /></span><p className="contact-info-label">Opening hours</p><h3>Plan your visit</h3><p>Our team is available during the week.</p><p className="contact-hours"><strong>Monday – Friday</strong><span>9 AM – 7 PM</span></p></article>
    </div><div className="contact-map-panel"><div className="contact-map-copy"><p className="section-label">Visit Naturals</p><h3>Find us in <em>Alappuzha.</em></h3><p>Come meet us in person at ASAP Community Skill Park, Cheriya Kalavoor.</p><a href={mapLink} target="_blank" rel="noreferrer" className="button button-dark">Get directions <ArrowRight /></a></div><div className="contact-map-frame"><iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d8565.577568900657!2d76.32326076161468!3d9.582653181746686!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3b08870450426c6d%3A0xbc9697ac06039c54!2sASAP%20Community%20Skill%20Park%20Cheriya%20Kalavoor!5e0!3m2!1sen!2sin!4v1792135568680!5m2!1sen!2sin" title="Map to Naturals Beauty Academy at ASAP Community Skill Park, Cheriya Kalavoor" loading="lazy" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen /></div></div></section>

    <section className="contact-form-section" id="enquiry"><div className="contact-form-shell"><div className="contact-form-intro"><p className="section-label">Drop us a line</p><h2>Let&rsquo;s start a <em>conversation.</em></h2><p>We are here to help. Complete the short form below and we&rsquo;ll respond as soon as possible.</p><div className="contact-form-note"><span><Mail /></span><p>Your enquiry is emailed straight to our team, and we&rsquo;ll get back to you as soon as possible.</p></div></div><div className="contact-form-card"><ContactForm courses={courses.map((course) => course.title)} courseSlugs={Object.fromEntries(courses.map((course) => [course.slug, course.title]))} /></div></div></section>
  </main><SiteFooter /></>
}
