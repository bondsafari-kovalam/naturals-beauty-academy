import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import { academyToday, workshops as fallback, type Workshop } from './site-config'
import { getSupabaseEnv, isSupabaseConfigured } from './supabase/env'

function list(value: unknown) { return Array.isArray(value) ? value.filter((item): item is string => typeof item === 'string') : [] }

/** URL-safe slug, used for the placeholder workshops (database workshops store their own slug). */
export const workshopSlug = (title: string) => title.toLowerCase().normalize('NFKD').replace(/[^\w\s-]/g, '').trim().replace(/[\s_]+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '')

function toWorkshop(row: Record<string, unknown>, seatsLeft: Map<string, number>): Workshop {
  const trainer = row.trainer && typeof row.trainer === 'object' ? row.trainer as Record<string, unknown> : null
  const slug = typeof row.slug === 'string' && row.slug ? row.slug : workshopSlug(String(row.title))
  return { title: String(row.title), slug, shortDescription: typeof row.short_description === 'string' && row.short_description ? row.short_description : undefined, totalSeats: typeof row.total_seats === 'number' ? row.total_seats : undefined, seatsLeft: seatsLeft.get(slug), registrationOpen: row.registration_open !== false, date: String(row.date), start: String(row.start_time ?? '10:00').slice(0, 5), time: String(row.time_label), duration: String(row.duration), category: String(row.category), description: String(row.description), image: String(row.image_url), location: typeof row.location === 'string' ? row.location : undefined, seats: typeof row.seats === 'string' ? row.seats : undefined, fee: typeof row.fee === 'string' ? row.fee : undefined, highlights: list(row.highlights), audience: list(row.audience), includes: list(row.includes), agenda: Array.isArray(row.agenda) ? row.agenda.filter((item): item is { time: string; title: string } => Boolean(item && typeof item === 'object' && typeof item.time === 'string' && typeof item.title === 'string')) : [], trainer: trainer && typeof trainer.name === 'string' && typeof trainer.role === 'string' && typeof trainer.image === 'string' ? { name: trainer.name, role: trainer.role, image: trainer.image } : undefined, faqs: Array.isArray(row.faqs) ? row.faqs.filter((item): item is [string, string] => Array.isArray(item) && item.length >= 2 && typeof item[0] === 'string' && typeof item[1] === 'string').map((item) => [item[0], item[1]]) : [] }
}

function client() {
  const { url, key } = getSupabaseEnv()
  // Public, cookie-free client: only published workshops are readable (Row Level Security).
  return createSupabaseClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } })
}

const placeholders = () => fallback.map((workshop) => ({ ...workshop, slug: workshop.slug ?? workshopSlug(workshop.title), registrationOpen: false }))

export type WorkshopResult = { workshops: Workshop[]; error: boolean }

/**
 * Published workshops (past and upcoming), soonest first, with live seats-left counts.
 * The placeholder schedule in site-config is only used when Supabase is not configured (local development),
 * so visitors never see invented workshops; a database error is reported as `error` instead.
 */
export async function loadWorkshops(): Promise<WorkshopResult> {
  if (!isSupabaseConfigured) return { workshops: placeholders(), error: false }
  try {
    const supabase = client()
    const [{ data, error }, availability] = await Promise.all([
      supabase.from('workshops').select('*').order('date').order('sort_order'),
      supabase.rpc('workshop_availability'),
    ])
    if (error) { console.warn(`Workshops: could not load (Supabase ${error.code}: ${error.message})`); return { workshops: [], error: true } }
    // Before 010_workshop_campaigns.sql runs there is no availability function; seat counts are then simply not shown.
    const seatsLeft = new Map(((availability.data ?? []) as { slug: string; seats_left: number }[]).map((row) => [row.slug, row.seats_left]))
    return { workshops: (data ?? []).map((row) => toWorkshop(row as Record<string, unknown>, seatsLeft)), error: false }
  } catch (error) {
    console.warn('Workshops: could not load:', error instanceof Error ? error.message : error)
    return { workshops: [], error: true }
  }
}

/** Kept for the homepage spotlight (/api/workshops). */
export async function getWorkshops(): Promise<Workshop[]> {
  return (await loadWorkshops()).workshops
}

/** Upcoming published workshops (today onwards, India time), soonest first. */
export async function getUpcomingWorkshops(): Promise<WorkshopResult> {
  const result = await loadWorkshops()
  const today = academyToday()
  return { ...result, workshops: result.workshops.filter((workshop) => workshop.date >= today) }
}

export async function getWorkshopBySlug(slug: string) {
  const result = await loadWorkshops()
  return { workshop: result.workshops.find((workshop) => workshop.slug === slug) ?? null, error: result.error }
}

/** Why a workshop cannot take website registrations right now, or null when it can. */
export function registrationBlock(workshop: Workshop, today = academyToday()): 'ended' | 'closed' | 'full' | null {
  if (workshop.date < today) return 'ended'
  if (workshop.registrationOpen === false) return 'closed'
  if (workshop.totalSeats !== undefined && workshop.seatsLeft !== undefined && workshop.seatsLeft <= 0) return 'full'
  return null
}
