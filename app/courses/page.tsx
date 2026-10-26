import { SiteFooter } from '../../components/site-footer'
import { SiteHeader } from '../../components/site-header'
import { CourseList } from '../../components/course-list'
import { getCourses } from '../../lib/courses'
import { pageMetadata } from '../../lib/seo'

export const metadata = pageMetadata({
  title: 'Beauty Courses in Alappuzha',
  description: 'Beauty therapy, hair dressing, makeup artistry, nail art, cosmetology, hair styling, grooming and mehandi courses in Alappuzha, Kerala. Compare durations and enquire.',
  path: '/courses',
})

// Courses come from Supabase; refresh the static page at most every 5 minutes.
export const revalidate = 300

export default async function CoursesPage() {
  const courses = await getCourses()
  return (
    <>
      <SiteHeader />
      <main className="all-courses-page section">
        <p className="section-label">Naturals Beauty Academy · Alappuzha</p>
        <h1>Explore our <em>courses.</em></h1>
        <p className="all-courses-intro">Choose a course to view its introduction and full curriculum.</p>
        <CourseList courses={courses} />
      </main>
      <SiteFooter />
    </>
  )
}
