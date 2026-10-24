import Link from 'next/link'
import type { ReactNode } from 'react'
import { ArrowLeft, ArrowRight, Mail, MapPin, Phone, Scale } from 'lucide-react'
import { SiteFooter } from '../../components/site-footer'
import { SiteHeader } from '../../components/site-header'

export const metadata = {
  title: 'Terms & Conditions | Naturals Beauty Academy',
  description: 'Read the terms and conditions for using the Naturals Beauty Academy website.',
  alternates: { canonical: '/terms-and-conditions' },
}

const termsSections = [
  ['introduction', 'Introduction'],
  ['use', 'Use of the website'],
  ['intellectual-property', 'Intellectual property'],
  ['third-party-links', 'Links to other websites'],
  ['liability', 'Limitation of liability'],
  ['governing-law', 'Governing law'],
  ['changes', 'Changes to these terms'],
  ['contact', 'Contact us'],
]

function TermsSection({ id, number, title, children }: { id: string; number: string; title: string; children: ReactNode }) {
  return <section className="policy-section" id={id}><div className="policy-section-number">{number}</div><div className="policy-section-content"><h2>{title}</h2>{children}</div></section>
}

export default function TermsAndConditionsPage() {
  return <><SiteHeader /><main className="policy-page">
    <section className="policy-hero"><div className="policy-hero-inner"><Link href="/" className="policy-back"><ArrowLeft /> Back to home</Link><p className="section-label">Naturals Beauty Academy · Website terms</p><div className="policy-title-row"><span className="policy-shield"><Scale /></span><h1>Terms &amp; <em>Conditions.</em></h1></div><p className="policy-lead">Please read these terms carefully before using the Naturals Beauty Academy website.</p><p className="policy-domain">naturalsbeautyacademypro.com</p></div></section>
    <div className="policy-layout"><aside className="policy-toc"><p className="section-label">In these terms</p>{termsSections.map(([id, title]) => <a href={`#${id}`} key={id}>{title}</a>)}</aside><div className="policy-content">
      <TermsSection id="introduction" number="01" title="Introduction"><p>Welcome to the Naturals Beauty Academy website. These Terms &amp; Conditions govern your relationship with <a href="https://naturalsbeautyacademypro.com/" target="_blank" rel="noreferrer">https://naturalsbeautyacademypro.com/</a>, operated by Naturals Beauty Academy. By accessing or using the Website, you agree to be bound by these Terms.</p></TermsSection>
      <TermsSection id="use" number="02" title="Use of the website"><p>You agree to use the Website only for lawful purposes and in a way that does not infringe the rights of, restrict, or inhibit anyone else&rsquo;s use and enjoyment of the Website. Prohibited behavior includes harassing or causing distress or inconvenience to any other user, transmitting obscene or offensive content, or disrupting the normal flow of dialogue within our Website.</p></TermsSection>
      <TermsSection id="intellectual-property" number="03" title="Intellectual property"><p>The Website and its original content, features, and functionality are and will remain the exclusive property of Naturals Beauty Academy and its licensors. The Website is protected by copyright, trademark, and other laws of both the country and foreign countries. Our trademarks and trade dress may not be used in connection with any product or service without the prior written consent of Naturals Beauty Academy.</p></TermsSection>
      <TermsSection id="third-party-links" number="04" title="Links to other websites"><p>Our Website may contain links to third-party websites or services that are not owned or controlled by Naturals Beauty Academy. We have no control over, and assume no responsibility for, the content, privacy policies, or practices of any third-party websites or services. You further acknowledge and agree that Naturals Beauty Academy shall not be responsible or liable, directly or indirectly, for any damage or loss caused or alleged to be caused by or in connection with the use of or reliance on any such content, goods, or services available on or through any such websites or services.</p></TermsSection>
      <TermsSection id="liability" number="05" title="Limitation of liability"><p>In no event shall Naturals Beauty Academy, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from (i) your access to or use of or inability to access or use the Website; (ii) any conduct or content of any third party on the Website; (iii) any content obtained from the Website; and (iv) unauthorized access, use, or alteration of your transmissions or content, whether based on warranty, contract, tort (including negligence), or any other legal theory, whether or not we have been informed of the possibility of such damage.</p></TermsSection>
      <TermsSection id="governing-law" number="06" title="Governing law"><p>These Terms shall be governed and construed in accordance with the laws of India, without regard to its conflict of law provisions. Our failure to enforce any right or provision of these Terms will not be considered a waiver of those rights. If any provision of these Terms is held to be invalid or unenforceable by a court, the remaining provisions of these Terms will remain in effect. These Terms constitute the entire agreement between us regarding our Website, and supersede and replace any prior agreements we might have between us regarding the Website.</p></TermsSection>
      <TermsSection id="changes" number="07" title="Changes to these terms"><p>We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material, we will try to provide at least 30 days&rsquo; notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion. By continuing to access or use our Website after those revisions become effective, you agree to be bound by the revised terms. If you do not agree to the new terms, please stop using the Website.</p></TermsSection>
      <TermsSection id="contact" number="08" title="Contact us"><p>If you have any questions about these Terms, please contact us:</p><div className="policy-contact-card"><a href="mailto:om@naturalsbeautyacademypro.com"><Mail /><span><small>Email</small>om@naturalsbeautyacademypro.com</span><ArrowRight /></a><a href="tel:+918929660506"><Phone /><span><small>Phone</small>8929660506</span><ArrowRight /></a><div><MapPin /><span><small>Address</small>Cheriya Kalavoor Temple, ASAP Community Skill Park (Additional Skill Acquisition Program), Behind Little Flower Nursery, Alappuzha, Kerala 688522, India</span></div></div></TermsSection>
    </div></div>
    <div className="policy-cta"><div><p className="section-label">Need more information?</p><h2>We&rsquo;re here to <em>help.</em></h2></div><Link href="/contact" className="button button-dark">Contact the academy <ArrowRight /></Link></div>
  </main><SiteFooter /></>
}
