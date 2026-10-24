import { NextResponse } from 'next/server'
import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import { clientIp, createRateLimiter, verifyTurnstile, websiteDbSecret } from '../../../../lib/request-guard'
import { getSupabaseEnv, isSupabaseConfigured } from '../../../../lib/supabase/env'
import { UTM_KEYS, isValidEmail, normalisePhone } from '../../../../lib/workshop-campaign'

// Workshop registration. All eligibility rules (published, upcoming, open, seats left, one registration
// per phone number) are enforced again inside the database function submit_workshop_registration(), which
// locks the workshop row so the last seat cannot be taken twice. Nothing the browser sends about the
// workshop (fee, seats, id) is trusted: only the slug identifies it.
// The database only accepts registrations that carry WORKSHOP_REGISTRATION_SECRET (server-only), so the
// CAPTCHA and rate limits below cannot be skipped by calling Supabase directly.

const rateLimited = createRateLimiter(5)

const text = (value: unknown, max: number) => (typeof value === 'string' ? value.trim().slice(0, max) : '')

const MESSAGES: Record<string, [number, string]> = {
  not_found: [404, 'This workshop is no longer available.'],
  ended: [409, 'This workshop has already taken place.'],
  closed: [409, 'Registrations for this workshop are closed. Please contact us on WhatsApp.'],
  full: [409, 'Sorry, all seats are taken. Please contact us on WhatsApp to join the waiting list.'],
  duplicate: [409, 'You have already registered for this workshop with this mobile number. Our team will contact you soon.'],
  busy: [429, 'We are receiving many registrations right now. Please try again in a few minutes.'],
  rate_limited: [429, 'Too many attempts. Please wait a few minutes and try again.'],
  invalid_name: [400, 'Please enter your full name.'],
  invalid_phone: [400, 'Please enter a valid mobile number.'],
  invalid_email: [400, 'Please enter a valid email address, or leave it empty.'],
}

export async function POST(request: Request) {
  let payload: Record<string, unknown>
  try {
    payload = await request.json()
  } catch {
    return NextResponse.json({ error: 'Please submit the form again.' }, { status: 400 })
  }

  // Bots: a filled hidden field, or a form submitted faster than a person can type, get a fake success.
  const startedAt = Number(payload.startedAt)
  if (text(payload.website, 200) || !Number.isFinite(startedAt) || Date.now() - startedAt < 2000) return NextResponse.json({ ok: true })

  const ip = clientIp(request)
  if (rateLimited(ip)) return NextResponse.json({ error: 'Too many attempts. Please wait a few minutes and try again.' }, { status: 429 })
  if (!(await verifyTurnstile(text(payload.turnstileToken, 2048), ip))) return NextResponse.json({ error: 'Please complete the security check and try again.' }, { status: 400 })

  const slug = text(payload.slug, 120)
  const fullName = text(payload.fullName, 120).replace(/\s+/g, ' ')
  const phone = normalisePhone(text(payload.phone, 30))
  const email = text(payload.email, 254).toLowerCase()
  const message = text(payload.message, 1000)
  if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(slug)) return NextResponse.json({ error: MESSAGES.not_found[1] }, { status: 404 })
  if (fullName.length < 2) return NextResponse.json({ error: MESSAGES.invalid_name[1], field: 'fullName' }, { status: 400 })
  if (!phone) return NextResponse.json({ error: MESSAGES.invalid_phone[1], field: 'phone' }, { status: 400 })
  if (email && !isValidEmail(email)) return NextResponse.json({ error: MESSAGES.invalid_email[1], field: 'email' }, { status: 400 })

  const attribution = payload.attribution && typeof payload.attribution === 'object' ? payload.attribution as Record<string, unknown> : {}
  const utm = Object.fromEntries(UTM_KEYS.map((key) => [`p_${key}`, text(attribution[key], 150) || null]))

  const unavailable = () => NextResponse.json({ error: 'Online registration is not available right now. Please register on WhatsApp.' }, { status: 503 })
  const registrationSecret = websiteDbSecret()
  if (!isSupabaseConfigured) return unavailable()
  if (!registrationSecret) {
    console.error('Workshop registration: WORKSHOP_REGISTRATION_SECRET is not set (see supabase/migrations/012_workshop_registration_hardening.sql).')
    return unavailable()
  }
  try {
    const { url, key } = getSupabaseEnv()
    const supabase = createSupabaseClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } })
    const { data, error } = await supabase.rpc('submit_workshop_registration', {
      p_secret: registrationSecret, p_client_ip: ip,
      p_slug: slug, p_full_name: fullName, p_phone: phone, p_email: email || null, p_message: message || null, ...utm,
      p_referrer: text(attribution.referrer, 500) || null, p_landing_path: text(attribution.landing_path, 300) || null,
    })
    if (error) {
      // Logged without the visitor's details.
      console.error(`Workshop registration failed (${error.code}): ${error.message}`)
      return NextResponse.json({ error: 'We could not save your registration. Please try again or register on WhatsApp.' }, { status: 502 })
    }
    const result = data as { ok: boolean; code: string }
    if (result.ok) return NextResponse.json({ ok: true })
    if (result.code === 'unauthorized') {
      console.error('Workshop registration: the database rejected WORKSHOP_REGISTRATION_SECRET. It must match the hash in private.app_secrets.')
      return unavailable()
    }
    const [status, text_] = MESSAGES[result.code] ?? [400, 'We could not save your registration. Please try again or register on WhatsApp.']
    return NextResponse.json({ error: text_, code: result.code }, { status })
  } catch (error) {
    console.error('Workshop registration failed:', error instanceof Error ? error.message : error)
    return NextResponse.json({ error: 'We could not save your registration. Please try again or register on WhatsApp.' }, { status: 502 })
  }
}
