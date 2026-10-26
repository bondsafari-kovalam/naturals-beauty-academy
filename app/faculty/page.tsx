import Link from 'next/link'
import Image from 'next/image'
import { canOptimize } from '../../lib/images'
import { ArrowRight, Award, GraduationCap } from 'lucide-react'
import { ScrollRevealObserver } from '../../components/scroll-reveal-observer'
import { SiteFooter } from '../../components/site-footer'
import { SiteHeader } from '../../components/site-header'
import { getFaculty, type FacultyMember } from '../../lib/faculty'
import { absoluteUrl, jsonLd, organizationId, pageMetadata } from '../../lib/seo'

export const metadata = pageMetadata({
  title: 'Beauty Trainers & Faculty',
  description: 'Meet the beauty educators who guide practical training in makeup, hair dressing, beauty therapy and nail art at Naturals Beauty Academy, Alappuzha.',
  path: '/faculty',
})

// The admin panel is a separate app, so its revalidatePath cannot invalidate this page.
// Refresh faculty content periodically after an admin publishes or edits a profile.
export const revalidate = 60

/** "4" or "4+" → "4 years"; anything with words ("12+ years", "3 Year") is shown as entered. */
const experienceText = (value: string) => (/^\d+\+?$/.test(value.trim()) ? `${value.trim()} years` : value)

/** Wide card for the academy head and senior faculty: photo on the left, details on the right. */
function LeaderCard({ member, tag, role }: { member: FacultyMember; tag: string; role?: string }) {
  return <article className="fs-head" data-reveal>
    <div className="fs-head-image"><Image src={member.image} unoptimized={!canOptimize(member.image)} alt={`${member.name}, ${member.role}`} fill sizes="(max-width: 800px) 90vw, 420px" /></div>
    <div className="fs-head-body">
      <p className="card-tag">{tag}</p>
      <h3>{member.name}</h3>
      {role && <p className="fs-head-role">{role}</p>}
      {member.experience && <p className="fs-head-exp"><Award />{experienceText(member.experience)} of experience</p>}
      {member.bio && <p>{member.bio}</p>}
      {member.specialities.length > 0 && <ul className="faculty-specialities">{member.specialities.map((item) => <li key={item}>{item}</li>)}</ul>}
    </div>
  </article>
}

function FacultyCard({ member, compact }: { member: FacultyMember; compact?: boolean }) {
  return <article className={`faculty-card${compact ? ' faculty-card--member' : ''}`} data-reveal>
    <div className="faculty-image">
      <Image src={member.image} unoptimized={!canOptimize(member.image)} alt={`${member.name}, ${member.role}`} fill sizes="(max-width: 600px) 90vw, (max-width: 1000px) 45vw, 30vw" />
      {member.experience && <span className="faculty-experience"><Award />{experienceText(member.experience)}</span>}
    </div>
    <div className="faculty-body">
      <p className="card-tag">{member.department}</p>
      <h3>{member.name}</h3>
      <p className="faculty-role">{member.role}</p>
      {!compact && member.bio && <p>{member.bio}</p>}
      {!compact && member.specialities.length > 0 && <ul className="faculty-specialities">{member.specialities.map((item) => <li key={item}>{item}</li>)}</ul>}
    </div>
  </article>
}

export default async function FacultyPage() {
  const members = await getFaculty()
  // Sections follow the admin "Profile type": Academy head, Senior faculty, Trainer.
  const head = members.find((member) => member.section === 'director')
  const seniors = members.filter((member) => member.section === 'head')
  const trainers = members.filter((member) => member.section === 'trainer')

  // The profiles shown below, as schema.org people working for the academy.
  const people = members.map((member) => ({
    '@type': 'Person', name: member.name, jobTitle: member.role, image: absoluteUrl(member.image),
    worksFor: { '@id': organizationId }, ...(member.specialities.length > 0 && { knowsAbout: member.specialities }),
  }))

  return <><ScrollRevealObserver /><SiteHeader /><main className="faculty-page">
    {people.length > 0 && <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(...people)} />}
    <section className="academy-hero"><div className="academy-hero-inner"><p className="section-label">Our faculty · Alappuzha</p><div className="academy-hero-copy"><h1>Learn from people who <em>love the craft.</em></h1><p>Our trainers bring years of salon and teaching experience to every practical session, guiding you from the basics to professional finishes.</p></div></div></section>

    {(head || seniors.length > 0) && <section className="fs-leaders"><div className="faculty-shell">
      <div className="faculty-heading"><p className="section-label">Our leadership</p><h2>Leading every <em>discipline.</em></h2></div>

      {/* Academy head first, then senior faculty, all in the same wide card. */}
      {head && <LeaderCard member={head} tag={head.role} />}
      {seniors.map((member, i) => <LeaderCard key={member.id ?? `${member.name}-${i}`} member={member} tag={member.department} role={member.role} />)}
    </div></section>}

    {trainers.length > 0 && <section className="faculty-team-section"><div className="faculty-shell">
      <div className="faculty-heading"><p className="section-label">Our faculty</p><h2>Trainers by your <em>side.</em></h2><p>Our faculty work with you in every practical session, from your first lesson to your final assessment.</p></div>
      <div className="faculty-team-grid">{trainers.map((member, i) => <FacultyCard key={member.id ?? `${member.name}-${i}`} member={member} compact />)}</div>
    </div></section>}

    <section className="academy-careers"><div className="academy-careers-icon"><GraduationCap /></div><div><p className="section-label">Train with our experts</p><h2>Start your <em>course.</em></h2><p>Find the course that suits you and our team will help you with batches, fees and the next steps.</p></div><Link href="/contact" className="button button-dark">Enquire now <ArrowRight /></Link></section>
  </main><SiteFooter /></>
}
