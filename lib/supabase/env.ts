// Reads the public Supabase settings. Both are safe in the browser: the publishable key is
// limited by Row Level Security. Never put a secret / service-role key in a NEXT_PUBLIC_ variable.
// (Each variable is referenced literally so Next.js can inline it into browser code.)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim()
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY?.trim()

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseKey)

export function getSupabaseEnv() {
  const missing = [!supabaseUrl && 'NEXT_PUBLIC_SUPABASE_URL', !supabaseKey && 'NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY'].filter(Boolean)
  if (missing.length > 0) {
    throw new Error(`Supabase is not configured. Add ${missing.join(' and ')} to .env.local (Supabase dashboard → Project Settings → API Keys), then restart the dev server.`)
  }
  return { url: supabaseUrl!, key: supabaseKey! }
}
