import Link from 'next/link'
import type { ReactNode } from 'react'
import { ArrowLeft, ArrowRight, Mail, MapPin, Phone, ShieldCheck } from 'lucide-react'
import { SiteFooter } from '../../components/site-footer'
import { SiteHeader } from '../../components/site-header'
import { pageMetadata } from '../../lib/seo'

export const metadata = pageMetadata({
  title: 'Privacy Policy',
  description: 'Learn how Naturals Beauty Academy collects, uses and safeguards your information.',
  path: '/privacy-policy',
})

const collectionTypes = [
  ['Personal Information', 'Name, email address, phone number, postal address, and other identifiable information.'],
  ['Usage Data', 'Information about how you interact with our website, such as your IP address, browser type, access times, pages viewed, and the referring website.'],
  ['Cookies and Tracking Technologies', 'We use cookies and similar tracking technologies to collect and use information about you.'],
]

const useCases = [
  'To provide, operate, and maintain our website.',
  'To improve, personalize, and expand our website.',
  'To understand and analyze how you use our website.',
  'To develop new products, services, features, and functionality.',
  'To communicate with you, either directly or through one of our partners, including for customer service, to provide you with updates and other information relating to the website, and for marketing and promotional purposes.',
  'To process your transactions and manage your orders.',
  'To send you emails and other communications.',
  'To find and prevent fraud.',
]

const dataRights = [
  ['Access', 'You have the right to request copies of your personal information.'],
  ['Rectification', 'You have the right to request that we correct any information you believe is inaccurate.'],
  ['Erasure', 'You have the right to request that we erase your personal information, under certain conditions.'],
  ['Restrict processing', 'You have the right to request that we restrict the processing of your personal information, under certain conditions.'],
  ['Object to processing', 'You have the right to object to our processing of your personal information, under certain conditions.'],
  ['Data portability', 'You have the right to request that we transfer the data that we have collected to another organization, or directly to you, under certain conditions.'],
]

function PolicySection({ id, number, title, children }: { id: string; number: string; title: string; children: ReactNode }) {
  return <section className="policy-section" id={id}><div className="policy-section-number">{number}</div><div className="policy-section-content"><h2>{title}</h2>{children}</div></section>
}

export default function PrivacyPolicyPage() {
  return <><SiteHeader /><main className="policy-page">
    <section className="policy-hero"><div className="policy-hero-inner"><Link href="/" className="policy-back"><ArrowLeft /> Back to home</Link><p className="section-label">Naturals Beauty Academy · Your information matters</p><div className="policy-title-row"><span className="policy-shield"><ShieldCheck /></span><h1>Privacy <em>Policy.</em></h1></div><p className="policy-lead">This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website.</p><p className="policy-domain">naturalsbeautyacademypro.com</p></div></section>
    <div className="policy-layout"><aside className="policy-toc"><p className="section-label">In this policy</p><a href="#introduction">Introduction</a><a href="#information">Information we collect</a><a href="#use">How we use information</a><a href="#sharing">Sharing information</a><a href="#security">Security</a><a href="#rights">Your rights</a><a href="#changes">Policy changes</a><a href="#contact">Contact us</a></aside><div className="policy-content">
      <PolicySection id="introduction" number="01" title="Introduction"><p>Naturals Beauty Academy values your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website <a href="https://naturalsbeautyacademypro.com" target="_blank" rel="noreferrer">naturalsbeautyacademypro.com</a>, as well as your choices regarding the use of your information.</p></PolicySection>
      <PolicySection id="information" number="02" title="Information we collect"><p>We may collect the following types of information:</p><div className="policy-info-grid">{collectionTypes.map(([title, text]) => <article className="policy-info-card" key={title}><h3>{title}</h3><p>{text}</p></article>)}</div></PolicySection>
      <PolicySection id="use" number="03" title="How we use your information"><p>We use the information we collect for various purposes, including:</p><ul className="policy-list">{useCases.map((item) => <li key={item}>{item}</li>)}</ul></PolicySection>
      <PolicySection id="sharing" number="04" title="Sharing your information"><p>We do not sell, trade, or otherwise transfer to outside parties your Personally Identifiable Information unless we provide users with advance notice. This does not include website hosting partners and other parties who assist us in operating our website, conducting our business, or serving our users, so long as those parties agree to keep this information confidential.</p></PolicySection>
      <PolicySection id="security" number="05" title="Security of your information"><p>We use administrative, technical, and physical security measures to help protect your personal information. While we have taken reasonable steps to secure the personal information you provide to us, please be aware that despite our efforts, no security measures are perfect or impenetrable, and no method of data transmission can be guaranteed against any interception or other type of misuse.</p></PolicySection>
      <PolicySection id="rights" number="06" title="Your data protection rights"><p>Depending on your location, you may have the following rights regarding your personal information:</p><div className="policy-rights">{dataRights.map(([title, text]) => <div className="policy-right" key={title}><span>{title}</span><p>{text}</p></div>)}</div></PolicySection>
      <PolicySection id="changes" number="07" title="Changes to this Privacy Policy"><p>We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page. You are advised to review this Privacy Policy periodically for any changes. Changes to this Privacy Policy are effective when they are posted on this page.</p></PolicySection>
      <PolicySection id="contact" number="08" title="Contact us"><p>If you have any questions about this Privacy Policy, please contact us:</p><div className="policy-contact-card"><a href="mailto:om@naturalsbeautyacademypro.com"><Mail /><span><small>Email</small>om@naturalsbeautyacademypro.com</span><ArrowRight /></a><a href="tel:+918929660506"><Phone /><span><small>Phone</small>8929660506</span><ArrowRight /></a><div><MapPin /><span><small>Address</small>Cheriya Kalavoor Temple, ASAP Community Skill Park (Additional Skill Acquisition Program), Behind Little Flower Nursery, Alappuzha, Kerala 688522, India</span></div></div></PolicySection>
      <div className="policy-endnote"><ShieldCheck /><span>Your privacy matters to us. Thank you for trusting Naturals Beauty Academy.</span></div>
    </div></div>
    <div className="policy-cta"><div><p className="section-label">Still have a question?</p><h2>We&rsquo;re happy to <em>help.</em></h2></div><Link href="/contact" className="button button-dark">Contact the academy <ArrowRight /></Link></div>
  </main><SiteFooter /></>
}
