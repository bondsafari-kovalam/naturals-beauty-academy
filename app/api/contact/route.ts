import { NextResponse } from 'next/server'
import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import { clientIp, createRateLimiter, verifyTurnstile, websiteDbSecret } from '../../../lib/request-guard'
import { getSupabaseEnv, isSupabaseConfigured } from '../../../lib/supabase/env'

const unavailable = 'We could not send your enquiry right now. Please call us on 08929660506 or email om@naturalsbeautyacademypro.com.'
const rateLimited = createRateLimiter(5)

function clean(value: unknown, maxLength: number) {
  return typeof value === 'string' ? value.trim().slice(0, maxLength) : ''
}

export async function POST(request: Request) {
  let payload: Record<string, unknown>
  try {
    payload = await request.json()
  } catch {
    return NextResponse.json({ error: 'Please submit the form again.' }, { status: 400 })
  }

  // Silently accept honeypot submissions without saving them.
  if (clean(payload.website, 200)) return NextResponse.json({ ok: true })

  const ip = clientIp(request)
  if (rateLimited(ip)) return NextResponse.json({ error: 'Too many messages. Please wait a few minutes and try again.' }, { status: 429 })
  if (!(await verifyTurnstile(clean(payload['cf-turnstile-response'], 2048), ip))) return NextResponse.json({ error: 'Please complete the security check and try again.' }, { status: 400 })

  const name = clean(payload.name, 120)
  const email = clean(payload.email, 254)
  const phone = clean(payload.phone, 40)
  const course = clean(payload.course, 200)
  const typedMessage = clean(payload.message, 4500)

  if (!name || !email || (!typedMessage && !course) || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: 'Please enter your name, a valid email, and a course or a message.' }, { status: 400 })
  }
  // Same rule as the form's phone field.
  if (!/^[0-9+()\-\s]{7,40}$/.test(phone)) return NextResponse.json({ error: 'Please enter a valid phone number.' }, { status: 400 })

  // The course of interest is stored at the top of the message so admins see it first.
  const message = [course && `Course of interest: ${course}`, typedMessage || (course && 'Please contact me about this course.')].filter(Boolean).join('\n\n')

  const source = clean(payload.source, 60) || 'contact-form'

  // Enquiries are only saved for the admin panel (Enquiries page); no email is sent.
  if (!isSupabaseConfigured) {
    console.error('Enquiry not saved: Supabase is not configured.')
    return NextResponse.json({ error: unavailable }, { status: 503 })
  }
  try {
    const { url, key } = getSupabaseEnv()
    const supabase = createSupabaseClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } })
    const enquiry = { name, email, phone, message, source }

    // Preferred: submit_enquiry (supabase/migrations/014) only accepts the server-only secret and limits each IP
    // to 5 enquiries per 10 minutes.
    const secret = websiteDbSecret()
    if (secret) {
      const { data, error } = await supabase.rpc('submit_enquiry', { p_secret: secret, p_client_ip: ip, p_name: name, p_email: email, p_phone: phone, p_message: message, p_source: source })
      const result = data as { ok: boolean; code: string } | null
      if (result?.ok) return NextResponse.json({ ok: true })
      if (result?.code === 'rate_limited') return NextResponse.json({ error: 'Too many messages. Please wait a few minutes and try again.' }, { status: 429 })
      if (result?.code === 'invalid') return NextResponse.json({ error: 'Please check your details and try again.' }, { status: 400 })
      if (result?.code === 'unauthorized') console.error('Enquiry not saved: the database rejected WORKSHOP_REGISTRATION_SECRET. It must match the hash in private.app_secrets.')
      // PGRST202: 014 has not been run yet, so fall through to the direct insert below.
      else if (error && error.code !== 'PGRST202') console.error(`Could not save enquiry to Supabase (${error.code}): ${error.message}`)
      if (!error || error.code !== 'PGRST202') return NextResponse.json({ error: unavailable }, { status: 503 })
    }

    // Until 014 is set up: insert directly, as allowed by the "Website can submit new enquiries" policy (001).
    // Running 015 removes that policy, after which only submit_enquiry works.
    const { error } = await supabase.from('enquiries').insert(enquiry)
    if (!error) return NextResponse.json({ ok: true })
    console.error(`Could not save enquiry to Supabase (${error.code}): ${error.message}`)
  } catch (error) {
    // e.g. supabase-js needs Node.js 22+ (native WebSocket).
    console.error('Supabase client failed:', error instanceof Error ? error.message : error)
  }
  return NextResponse.json({ error: unavailable }, { status: 503 })
}
