import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { getSupabaseEnv } from './env'

export { isSupabaseConfigured } from './env'

// For Server Components, Route Handlers and Server Actions.
export const createClient = (cookieStore: Awaited<ReturnType<typeof cookies>>) => {
  const { url, key } = getSupabaseEnv()
  return createServerClient(url, key, {
    cookies: {
      getAll() {
        return cookieStore.getAll()
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options))
        } catch {
          // Called from a Server Component, where cookies are read-only. Safe to ignore while the
          // site has no logins; add a proxy (Next.js 16's renamed middleware) when staff auth is added.
        }
      },
    },
  })
}
