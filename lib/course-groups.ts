import type { Course } from './site-config'

// Category filter buttons for course lists (homepage carousel and /courses).
export type CourseGroup = { label: string; categories?: string[] }

const courseGroups: CourseGroup[] = [
  { label: 'All courses' },
  { label: 'Beauty Therapy', categories: ['Beauty Therapy'] },
  { label: 'Hair Dressing', categories: ['Hair Dressing'] },
  { label: 'Makeup Artistry', categories: ['Makeup Artistry'] },
  { label: 'Nail Art', categories: ['Nail Art & Extensions'] },
  { label: 'Cosmetology', categories: ['Cosmetology'] },
  { label: 'Beauty & Hair', categories: ['Beauty Therapy & Hair Dressing'] },
  { label: 'Certificate Courses', categories: ['Hair Styling', 'Personal Grooming', 'Mehandi'] },
]

export const coursesInGroup = (group: CourseGroup, courseCatalog: Course[]) => group.categories ? courseCatalog.filter((course) => group.categories!.includes(course.category)) : courseCatalog

// Categories added from the admin panel get their own filter button, after the built-in groups.
export function courseGroupsFor(courseCatalog: Course[]) {
  const grouped = new Set(courseGroups.flatMap((group) => group.categories ?? []))
  const extra = [...new Set(courseCatalog.map((course) => course.category))].filter((category) => !grouped.has(category))
  return [...courseGroups, ...extra.map((category) => ({ label: category, categories: [category] }))]
}
