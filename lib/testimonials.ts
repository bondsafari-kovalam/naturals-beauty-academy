import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import { getSupabaseEnv, isSupabaseConfigured } from './supabase/env'

export type Testimonial = { id: string; name: string; course?: string; location?: string; quote: string; rating: number }

function toTestimonial(row: Record<string, unknown>): Testimonial {
  const rating = Number(row.rating)
  return {
    id: String(row.id),
    name: String(row.name),
    course: typeof row.course === 'string' && row.course ? row.course : undefined,
    location: typeof row.location === 'string' && row.location ? row.location : undefined,
    quote: String(row.quote),
    rating: Number.isInteger(rating) && rating >= 1 && rating <= 5 ? rating : 5,
  }
}

/**
 * Published testimonials from the admin panel, in display order. There is deliberately no fallback:
 * when Supabase is not configured, unreachable, or has none published, the homepage hides the section
 * rather than showing invented testimonials.
 */
export async function getTestimonials(): Promise<Testimonial[]> {
  if (!isSupabaseConfigured) return []
  try {
    const { url, key } = getSupabaseEnv()
    // Public, cookie-free client: only published testimonials are readable (Row Level Security).
    const supabase = createSupabaseClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } })
    const { data, error } = await supabase.from('testimonials').select('id, name, course, location, quote, rating').order('sort_order').order('created_at')
    if (error) {
      console.warn(`Testimonials: could not load (Supabase ${error.code}: ${error.message})`)
      return []
    }
    return (data ?? []).map((row) => toTestimonial(row as Record<string, unknown>))
  } catch (error) {
    console.warn('Testimonials: could not load:', error instanceof Error ? error.message : error)
    return []
  }
}
