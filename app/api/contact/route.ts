import { NextResponse } from 'next/server'
import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import { clientIp, createRateLimiter, verifyTurnstile, websiteDbSecret } from '../../../lib/request-guard'
import { getSupabaseEnv, isSupabaseConfigured } from '../../../lib/supabase/env'

const recipient = 'om@naturalsbeautyacademypro.com'
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

  // Silently accept honeypot submissions without sending email.
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

  // 1. Save the enquiry so it is never lost, even if email is down. The database only accepts it with the
  //    server-only secret and limits each IP to 5 enquiries per 10 minutes (supabase/migrations/014).
  let saved = false
  const secret = websiteDbSecret()
  if (!isSupabaseConfigured || !secret) {
    console.error('Enquiry not saved: Supabase or WORKSHOP_REGISTRATION_SECRET is not configured.')
  } else {
    try {
      const { url, key } = getSupabaseEnv()
      const supabase = createSupabaseClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } })
      const { data, error } = await supabase.rpc('submit_enquiry', { p_secret: secret, p_client_ip: ip, p_name: name, p_email: email, p_phone: phone, p_message: message, p_source: source })
      const result = data as { ok: boolean; code: string } | null
      if (error) console.error(`Could not save enquiry to Supabase (${error.code}): ${error.message}`)
      else if (result?.code === 'rate_limited') return NextResponse.json({ error: 'Too many messages. Please wait a few minutes and try again.' }, { status: 429 })
      else if (result?.code === 'invalid') return NextResponse.json({ error: 'Please check your details and try again.' }, { status: 400 })
      else if (result?.code === 'unauthorized') console.error('Enquiry not saved: the database rejected WORKSHOP_REGISTRATION_SECRET. It must match the hash in private.app_secrets.')
      else if (result?.ok) saved = true
    } catch (error) {
      // e.g. supabase-js needs Node.js 22+ (native WebSocket); log it and still try email below.
      console.error('Supabase client failed:', error instanceof Error ? error.message : error)
    }
  }

  // 2. Email the team when Resend is configured; saving alone is enough to succeed.
  const apiKey = process.env.RESEND_API_KEY
  const from = process.env.RESEND_FROM_EMAIL
  if (!apiKey || !from) {
    if (saved) return NextResponse.json({ ok: true })
    return NextResponse.json({ error: 'The enquiry service is not configured yet. Please email us directly at om@naturalsbeautyacademypro.com.' }, { status: 503 })
  }

  const text = [`Name: ${name}`, `Email: ${email}`, `Phone: ${phone || 'Not provided'}`, '', 'Message:', message].join('\n')
  let response: Response
  try {
    response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from,
        to: [recipient],
        reply_to: email,
        subject: `Website enquiry from ${name}`,
        text,
      }),
    })
  } catch {
    if (saved) return NextResponse.json({ ok: true })
    return NextResponse.json({ error: 'We could not reach the email service. Please try again later.' }, { status: 502 })
  }

  // Saved but not emailed: the visitor is fine, but the team must hear about it.
  if (!response.ok) console.error(`Enquiry email failed: Resend answered HTTP ${response.status}.`)
  if (!response.ok && !saved) {
    return NextResponse.json({ error: 'We could not send your message right now. Please email us directly at om@naturalsbeautyacademypro.com.' }, { status: 502 })
  }

  return NextResponse.json({ ok: true })
}
