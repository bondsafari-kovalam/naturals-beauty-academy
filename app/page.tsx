import { HomePage } from '../components/home-page'
import { getCourses } from '../lib/courses'
import { getTestimonials } from '../lib/testimonials'

// Courses and testimonials come from Supabase; refresh the static homepage at most every 5 minutes.
export const revalidate = 300

export default async function Page() {
  const [courses, testimonials] = await Promise.all([getCourses(), getTestimonials()])
  return <HomePage courses={courses} testimonials={testimonials} />
}
