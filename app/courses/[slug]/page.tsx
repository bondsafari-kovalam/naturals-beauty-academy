import Link from 'next/link'
import Image from 'next/image'
import { canOptimize } from '../../../lib/images'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { SiteFooter } from '../../../components/site-footer'
import { SiteHeader } from '../../../components/site-header'
import { siteConfig, type Course } from '../../../lib/site-config'
import { getCourseBySlug, getCourses } from '../../../lib/courses'
import { absoluteUrl, academy, breadcrumbSchema, isoHours, jsonLd, organizationId, pageMetadata, siteUrl } from '../../../lib/seo'

// Courses come from Supabase; refresh at most every 5 minutes. New slugs render on first visit (dynamicParams).
export const revalidate = 300

export async function generateStaticParams() {
  return (await getCourses()).map(({ slug }) => ({ slug }))
}

/** "360 Hrs" → "A 360-hour course"; other or missing durations → "A course". */
const hourCourse = (duration?: string) => {
  const hours = duration?.match(/^\s*(\d+)\s*h/i)?.[1]
  return hours ? `A ${hours}-hour course` : 'A course'
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const course = await getCourseBySlug(slug)

  if (!course) {
    return {
      title: `Course not found | ${siteConfig.name}`,
      description: 'Explore professional beauty courses at Naturals Beauty Academy, Alappuzha.',
      robots: { index: false },
    }
  }

  return pageMetadata({
    title: `${course.title} in Alappuzha`,
    description: `${course.description} ${hourCourse(course.duration)} at Naturals Beauty Academy, Alappuzha, Kerala.`,
    path: `/courses/${course.slug}`,
    image: course.image,
    imageAlt: course.imageAlt ?? `${course.title} course`,
  })
}

// Course details as shown on the page. Fees and batch dates are not published, so no offers or schedule are claimed.
function courseSchema(course: Course) {
  const url = `${siteUrl}/courses/${course.slug}`
  const workload = isoHours(course.duration)
  return {
    '@type': 'Course',
    '@id': `${url}#course`,
    name: course.title,
    description: course.description,
    url,
    image: absoluteUrl(course.image),
    inLanguage: 'en-IN',
    provider: { '@type': 'EducationalOrganization', '@id': organizationId, name: academy.name, url: siteUrl },
    ...(workload && { hasCourseInstance: { '@type': 'CourseInstance', courseMode: 'Onsite', courseWorkload: workload, location: { '@type': 'Place', name: academy.name, address: academy.address } } }),
    ...(course.curriculum.length > 0 && { syllabusSections: course.curriculum.map((section) => ({ '@type': 'Syllabus', name: section.heading, ...(section.topics.length > 0 && { description: section.topics.join(', ') }) })) }),
  }
}

export default async function CourseDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const courses = await getCourses()
  const course = courses.find((item) => item.slug === slug)

  if (!course) notFound()

  const otherCourses = courses.filter(({ slug: otherSlug }) => otherSlug !== course.slug).slice(0, 3)

  return (
    <>
    <SiteHeader />
    <main className="course-detail-page">
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(courseSchema(course), breadcrumbSchema([['Home', '/'], ['Courses', '/courses'], [course.title, `/courses/${course.slug}`]]))} />
      <Link href="/courses" className="inner-back"><ArrowLeft /> Back to courses</Link>
      <section className="course-detail-hero">
        <div className="course-detail-copy">
          <p className="eyebrow">{course.category} course <span>·</span> {siteConfig.location}</p>
          <h1>{course.title}</h1>
          <p className="section-label">Website introduction</p>
          <p className="course-detail-intro">{course.description}</p>
          {course.duration && <p className="course-duration course-detail-duration">Duration: {course.duration}</p>}
          <Link href={`/contact?course=${course.slug}#enquiry`} className="button button-dark">Enquire about this course <ArrowRight /></Link>
        </div>
        <div className="course-detail-image"><Image src={course.image} unoptimized={!canOptimize(course.image)} alt={course.imageAlt ?? `${course.title} course`} fill loading="eager" fetchPriority="high" sizes="(max-width: 900px) 90vw, 44vw" /></div>
      </section>

      <section className="course-detail-overview">
        <div>
          <p className="section-label">Course overview</p>
          <h2>Build your skills with <em>guided practice.</em></h2>
        </div>
        <div className="course-overview-card">
          <p>{course.description}</p>
          <Link href={`/contact?course=${course.slug}#enquiry`} className="text-link">Ask about admissions <ArrowRight /></Link>
        </div>
      </section>

      <section className="course-curriculum">
        {course.curriculum.length > 0 ? <>
        <p className="section-label">Full curriculum</p>
        <h2>What you will <em>study.</em></h2>
        <div className="curriculum-grid">
          {course.curriculum.map((section) => (
            <section className="curriculum-module" key={section.heading}>
              <h3>{section.heading}</h3>
              {section.topics.length > 0 ? (
                <ul>{section.topics.map((topic) => <li key={topic}>{topic}</li>)}</ul>
              ) : <p className="curriculum-note">{section.note}</p>}
            </section>
          ))}
        </div>
        </> : <p className="curriculum-note">Please contact the academy for the detailed curriculum of this course.</p>}
      </section>

      <section className="related-courses">
        <div className="section-heading">
          <div><p className="section-label">Keep exploring</p><h2>Other <em>courses.</em></h2></div>
          <Link href="/courses" className="text-link">All courses <ArrowRight /></Link>
        </div>
        <div className="course-grid">
          {otherCourses.map((otherCourse) => (
            <Link href={`/courses/${otherCourse.slug}`} className="course-card" key={otherCourse.slug}>
              <div className="course-image"><Image src={otherCourse.image} unoptimized={!canOptimize(otherCourse.image)} alt={otherCourse.imageAlt ?? `${otherCourse.title} course`} fill sizes="(max-width: 600px) 86vw, (max-width: 900px) 45vw, 30vw" /></div>
              <p className="card-tag">{otherCourse.category}</p>
              <h3>{otherCourse.title}</h3>
              {otherCourse.duration && <p className="course-duration">Duration: {otherCourse.duration}</p>}
              <span className="course-card-action">View course <ArrowRight /></span>
            </Link>
          ))}
        </div>
      </section>
    </main>
    <SiteFooter />
    </>
  )
}
