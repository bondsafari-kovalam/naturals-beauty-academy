import { createBrowserClient } from '@supabase/ssr'
import { getSupabaseEnv } from './env'

// For Client Components.
export const createClient = () => {
  const { url, key } = getSupabaseEnv()
  return createBrowserClient(url, key)
}
