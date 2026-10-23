import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import { type Course, courses as fallbackCourses } from './site-config'
import { getSupabaseEnv, isSupabaseConfigured } from './supabase/env'

type CourseRow = {
  slug: string
  title: string
  category: string
  description: string
  duration: string | null
  image_url: string
  image_alt: string | null
  curriculum: unknown
}

// Keeps only well-formed modules so a bad JSON edit in the dashboard can't break a course page.
function toCurriculum(value: unknown): Course['curriculum'] {
  if (!Array.isArray(value)) return []
  return value.flatMap((module) => {
    if (!module || typeof module !== 'object' || typeof module.heading !== 'string') return []
    const topics = Array.isArray(module.topics) ? module.topics.filter((topic: unknown): topic is string => typeof topic === 'string') : []
    return [{ heading: module.heading, topics, ...(typeof module.note === 'string' ? { note: module.note } : {}) }]
  })
}

function toCourse(row: CourseRow): Course {
  return {
    slug: row.slug,
    title: row.title,
    category: row.category,
    description: row.description,
    image: row.image_url,
    imageAlt: row.image_alt ?? undefined,
    duration: row.duration ?? undefined,
    curriculum: toCurriculum(row.curriculum),
  }
}

/**
 * Published courses from Supabase, in sort_order. Falls back to the hardcoded catalog in
 * lib/site-config.ts if Supabase is not configured, unreachable, or returns no courses,
 * so the site never shows an empty course list. Remove the fallback once Supabase is the source.
 */
export async function getCourses(): Promise<Course[]> {
  if (!isSupabaseConfigured) return fallbackCourses
  try {
    const { url, key } = getSupabaseEnv()
    // Public, cookie-free client: course data is the same for every visitor, so pages can stay static.
    const supabase = createSupabaseClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } })
    const { data, error } = await supabase
      .from('courses')
      .select('slug, title, category, description, duration, image_url, image_alt, curriculum')
      .order('sort_order', { ascending: true })
      .order('title', { ascending: true })
    if (error) {
      console.warn(`Courses: using site-config fallback (Supabase ${error.code}: ${error.message})`)
      return fallbackCourses
    }
    if (!data || data.length === 0) {
      console.warn('Courses: using site-config fallback (no published courses in Supabase)')
      return fallbackCourses
    }
    return data.map(toCourse)
  } catch (error) {
    console.warn('Courses: using site-config fallback (Supabase client error:', error instanceof Error ? error.message : error, ')')
    return fallbackCourses
  }
}

export async function getCourseBySlug(slug: string) {
  return (await getCourses()).find((course) => course.slug === slug)
}
