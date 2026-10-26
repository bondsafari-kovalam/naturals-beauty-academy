import { HomePage } from '../components/home-page'
import { getCourses } from '../lib/courses'
import { jsonLd, organizationSchema, pageMetadata, websiteSchema } from '../lib/seo'
import { getTestimonials } from '../lib/testimonials'

// Courses and testimonials come from Supabase; refresh the static homepage at most every 5 minutes.
export const revalidate = 300

export const metadata = pageMetadata({
  title: 'Beauty Courses in Alappuzha, Kerala | Naturals Beauty Academy',
  description: 'Beauty therapy, hair dressing, makeup, nail art and cosmetology courses in Alappuzha, Kerala, with hands-on training and BWSSC-approved certification.',
  path: '/',
})

export default async function Page() {
  const [courses, testimonials] = await Promise.all([getCourses(), getTestimonials()])
  return <>
    {/* Lets search engines show the academy's name, logo, address and contact details. */}
    <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(organizationSchema, websiteSchema)} />
    <HomePage courses={courses} testimonials={testimonials} />
  </>
}
