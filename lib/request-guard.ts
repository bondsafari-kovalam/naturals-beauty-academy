// Abuse protection shared by the public form endpoints (/api/contact, /api/workshops/register).
// Server-only: never import this from a Client Component.

/** The visitor's IP address (Vercel sets these headers itself), or null when unknown. */
export function clientIp(request: Request) {
  return request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || request.headers.get('x-real-ip') || null
}

/**
 * Best-effort per-IP limit kept in memory, so it only counts requests reaching this server instance.
 * It is a cheap first check; the limit every instance shares is enforced in the database.
 */
export function createRateLimiter(maxPerWindow: number, windowMs = 10 * 60 * 1000) {
  const recent = new Map<string, number[]>()
  return (ip: string | null) => {
    const key = ip ?? 'unknown'
    const now = Date.now()
    const hits = (recent.get(key) ?? []).filter((time) => now - time < windowMs)
    hits.push(now)
    recent.set(key, hits)
    if (recent.size > 5000) for (const [k, times] of recent) if (times.every((time) => now - time >= windowMs)) recent.delete(k)
    return hits.length > maxPerWindow
  }
}

/** Cloudflare Turnstile check. Passes when TURNSTILE_SECRET_KEY is not set (CAPTCHA turned off). */
export async function verifyTurnstile(token: string, ip: string | null) {
  const secret = process.env.TURNSTILE_SECRET_KEY
  if (!secret) {
    if (process.env.NODE_ENV === 'production') console.warn('TURNSTILE_SECRET_KEY is not set, so the form CAPTCHA is off.')
    return true
  }
  if (!token) return false
  try {
    const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      body: new URLSearchParams({ secret, response: token, ...(ip && { remoteip: ip }) }),
      signal: AbortSignal.timeout(5000),
    })
    return Boolean(((await response.json()) as { success?: boolean }).success)
  } catch {
    return false
  }
}

/** The server-only secret the database functions require (see supabase/migrations/012 and 014), or null. */
export const websiteDbSecret = () => process.env.WORKSHOP_REGISTRATION_SECRET?.trim() || null
