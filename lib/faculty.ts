import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import { getSupabaseEnv, isSupabaseConfigured } from './supabase/env'

export type FacultyMember = { id?: string; name: string; role: string; department: string; section: 'director' | 'head' | 'trainer'; image: string; experience?: string; bio?: string; specialities: string[] }

const placeholderBio = 'Add a short introduction about this person, their background and the courses they guide.'
const fallback: FacultyMember[] = [
  { name: 'Director Name', role: 'Academy Director', department: 'Academy', section: 'director', experience: '15+ years', bio: 'Add a short message from the director about the academy, its approach to training and what students can expect when they join.', specialities: ['Academy leadership', 'Curriculum', 'Student mentoring'], image: '/placeholder-user.jpg' },
  { name: 'Head Name', role: 'Head of Makeup & Bridal', department: 'Makeup & Bridal', section: 'head', experience: '12+ years', bio: placeholderBio, specialities: ['Bridal makeup', 'HD makeup', 'Mehandi'], image: '/placeholder-user.jpg' },
  { name: 'Head Name', role: 'Head of Hair Dressing', department: 'Hair Dressing', section: 'head', experience: '10+ years', bio: placeholderBio, specialities: ['Hair cutting', 'Colouring', 'Styling'], image: '/placeholder-user.jpg' },
  { name: 'Head Name', role: 'Head of Beauty Therapy', department: 'Skin & Beauty Therapy', section: 'head', experience: '11+ years', bio: placeholderBio, specialities: ['Skin care', 'Cosmetology', 'Nails'], image: '/placeholder-user.jpg' },
  { name: 'Faculty Name', role: 'Makeup Artistry Trainer', department: 'Makeup & Bridal', section: 'trainer', specialities: [], image: '/placeholder-user.jpg' },
  { name: 'Faculty Name', role: 'Mehandi Trainer', department: 'Makeup & Bridal', section: 'trainer', specialities: [], image: '/placeholder-user.jpg' },
  { name: 'Faculty Name', role: 'Hair Dressing Trainer', department: 'Hair Dressing', section: 'trainer', specialities: [], image: '/placeholder-user.jpg' },
  { name: 'Faculty Name', role: 'Hair Styling Trainer', department: 'Hair Dressing', section: 'trainer', specialities: [], image: '/placeholder-user.jpg' },
  { name: 'Faculty Name', role: 'Beauty Therapy Trainer', department: 'Skin & Beauty Therapy', section: 'trainer', specialities: [], image: '/placeholder-user.jpg' },
  { name: 'Faculty Name', role: 'Nail Art Trainer', department: 'Skin & Beauty Therapy', section: 'trainer', specialities: [], image: '/placeholder-user.jpg' },
]

function toMember(row: Record<string, unknown>): FacultyMember {
  return { id: typeof row.id === 'string' ? row.id : undefined, name: String(row.name), role: String(row.role), department: String(row.department), section: row.section as FacultyMember['section'], image: String(row.image_url), experience: typeof row.experience === 'string' ? row.experience : undefined, bio: typeof row.bio === 'string' ? row.bio : undefined, specialities: Array.isArray(row.specialities) ? row.specialities.filter((item): item is string => typeof item === 'string') : [] }
}

export async function getFaculty(): Promise<FacultyMember[]> {
  if (!isSupabaseConfigured) return fallback
  try {
    const { url, key } = getSupabaseEnv()
    const supabase = createSupabaseClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } })
    const { data, error } = await supabase.from('faculty').select('id, name, role, department, section, experience, bio, specialities, image_url').order('section').order('sort_order').order('name')
    if (error) {
      console.warn(`Faculty: using fallback profiles (Supabase ${error.code}: ${error.message})`)
      return fallback
    }
    if (!data) return fallback
    return data.map((row) => toMember(row as Record<string, unknown>))
  } catch {
    return fallback
  }
}
