import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, BriefcaseBusiness, GraduationCap, Sparkles } from 'lucide-react'
import { SiteFooter } from '../../components/site-footer'
import { SiteHeader } from '../../components/site-header'

export const metadata = {
  title: 'The Academy | Naturals Beauty Academy',
  description: 'Discover the story, mission and professional beauty education at Naturals Beauty Academy, Alappuzha.',
  alternates: { canonical: '/the-academy' },
}

const learningAreas = ['Hair', 'Makeup', 'Skin', 'Nails', 'Bridal', 'Cosmetology']

export default function AcademyPage() {
  return <><SiteHeader /><main className="academy-page">
    <section className="academy-hero"><div className="academy-hero-inner"><p className="section-label">Get to know us better · Alappuzha</p><div className="academy-hero-grid"><div className="academy-hero-copy"><h1>Our story and mission <em>are worth sharing.</em></h1><p>Naturals Beauty Academy is the educational vertical of India&rsquo;s largest chain of salons.</p><Link href="#our-story" className="button button-dark">Discover our story <ArrowRight /></Link></div><div className="academy-logo-panel"><span className="academy-logo-glow" /><Image src="/alappuzha-naturals-beauty-academy-logo.png" alt="Alappuzha Naturals Beauty Academy — Hair, Skin, Makeup and Nails" width={1534} height={1025} priority /></div></div></div></section>

    <section className="academy-story section" id="our-story"><div className="academy-story-label"><p className="section-label">01 / Get to know us better</p><span>Beauty education with purpose</span></div><div className="academy-story-content"><h2>Learn your craft.<br /><em>Shape your future.</em></h2><p>Naturals Beauty Academy offers courses in hair, makeup, skin, nails, bridal and much more. Our popular Diploma in Cosmetology brings hair, makeup and skin together in one professional course.</p><p>Our training module and curriculum follow Beauty &amp; Wellness Sector Skill Council of India (BW&amp;SSC) standards and are enhanced with trending formats in training.</p><p>Naturals Beauty Academy is a network of 30+ academies that has helped transform the careers of more than 40,000 people. Our students receive BWSSC-approved, ISO-accredited certification and 100% placement assistance, and the network reports a 95% placement rate locally and internationally.</p><p>Students in Cosmetology are provided with a Beauty Tool Kit to support their learning with international quality, tried-and-tested tools that can benefit their professional journey.</p><div className="academy-learning-areas">{learningAreas.map((area) => <span key={area}>{area}</span>)}</div></div></section>

    <section className="academy-founder"><div className="academy-founder-inner"><div className="academy-founder-mark"><Sparkles /></div><div className="academy-founder-copy"><p className="section-label">02 / A note from our founders</p><h2>From the <em>founders.</em></h2><blockquote>“At Naturals Beauty Academy, we strive to provide unparalleled training and mentorship to our students, ensuring they are equipped with the skills and knowledge necessary to excel in the dynamic field of beauty. Our state-of-the-art facilities and experienced faculty members enable students to gain hands-on experience and practical insights into various aspects of cosmetology, skincare, hairdressing, and makeup artistry.”</blockquote><p className="academy-founder-names">Asha Jackson <span>&amp;</span> Reeba Jose</p></div></div></section>

    <section className="academy-mission section"><div><p className="section-label">03 / Our mission</p><h2>Education that <em>inspires.</em></h2></div><div className="academy-mission-card"><span className="academy-mission-icon"><GraduationCap /></span><p>Our goal is not only to educate but also to inspire a new generation of beauty professionals who are passionate, skilled, and socially responsible.</p></div></section>

    <section className="academy-partnership"><div className="academy-partnership-inner"><div className="academy-partnership-copy"><p className="section-label">04 / In partnership</p><h2>Naturals × <em>ASAP.</em></h2><p>ASAP Kerala is a Government of Kerala undertaking focused on upskilling and enhancing employability through demand-based, industry-led training.</p></div><div className="academy-partner-logos"><div><Image src="/naturals-beauty-academy-logo.png" alt="Naturals Beauty Academy" width={300} height={120} /></div><span className="academy-partner-cross">×</span><div><Image src="/asap-additional-skill-acquisition-programme-logo.png" alt="ASAP — Additional Skill Acquisition Programme" width={1686} height={854} /></div></div></div></section>

    <section className="academy-careers"><div className="academy-careers-icon"><BriefcaseBusiness /></div><div><p className="section-label">Grow with us</p><h2>Join our <em>team.</em></h2><p>We are always looking for great professionals and would be happy to grow our team with your talent. Ask us about opportunities or simply send us an email.</p></div><a href="mailto:om@naturalsbeautyacademypro.com" className="button button-dark">Get in touch <ArrowRight /></a></section>
  </main><SiteFooter /></>
}
