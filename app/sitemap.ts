import type { MetadataRoute } from 'next'
import { getBlogSitemapEntries } from '../lib/blog'
import { siteUrl } from '../lib/seo'
import { getCourses } from '../lib/courses'
import { getUpcomingWorkshops } from '../lib/workshops'

// Rebuilt at most hourly; admin saves also refresh it through /api/revalidate.
export const revalidate = 3600

// Public pages only. Past workshops are noindex, so only upcoming ones are listed.
const pages: Array<[path: string, changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency'], priority: number]> = [
  ['/', 'weekly', 1],
  ['/courses', 'weekly', 0.9],
  ['/workshops', 'daily', 0.9],
  ['/the-academy', 'monthly', 0.7],
  ['/faculty', 'monthly', 0.7],
  ['/blog', 'weekly', 0.7],
  ['/videos', 'weekly', 0.6],
  ['/contact', 'yearly', 0.6],
  ['/privacy-policy', 'yearly', 0.2],
  ['/terms-and-conditions', 'yearly', 0.2],
]

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [courses, { workshops }, posts] = await Promise.all([getCourses(), getUpcomingWorkshops(), getBlogSitemapEntries()])
  return [
    ...pages.map(([path, changeFrequency, priority]) => ({ url: `${siteUrl}${path === '/' ? '' : path}`, changeFrequency, priority })),
    ...courses.map((course) => ({ url: `${siteUrl}/courses/${course.slug}`, changeFrequency: 'monthly' as const, priority: 0.8 })),
    ...workshops.filter((workshop) => workshop.slug).map((workshop) => ({ url: `${siteUrl}/workshops/${workshop.slug}`, changeFrequency: 'daily' as const, priority: 0.8 })),
    ...posts.map(({ slug, updatedAt }) => ({ url: `${siteUrl}/blog/${slug}`, lastModified: updatedAt, changeFrequency: 'monthly' as const, priority: 0.6 })),
  ]
}
