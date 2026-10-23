import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createClient, isSupabaseConfigured } from '../../../lib/supabase/server'

const recipient = 'om@naturalsbeautyacademypro.com'

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

  const name = clean(payload.name, 120)
  const email = clean(payload.email, 254)
  const phone = clean(payload.phone, 40)
  const course = clean(payload.course, 200)
  const typedMessage = clean(payload.message, 4500)

  if (!name || !email || (!typedMessage && !course) || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: 'Please enter your name, a valid email, and a course or a message.' }, { status: 400 })
  }

  // The course of interest is stored at the top of the message so admins see it first.
  const message = [course && `Course of interest: ${course}`, typedMessage || (course && 'Please contact me about this course.')].filter(Boolean).join('\n\n')

  const source = clean(payload.source, 60) || 'contact-form'

  // 1. Save the enquiry so it is never lost, even if email is down.
  let saved = false
  if (isSupabaseConfigured) {
    try {
      const supabase = createClient(await cookies())
      const { error } = await supabase.from('enquiries').insert({ name, email, phone: phone || null, message, source })
      if (error) console.error(`Could not save enquiry to Supabase (${error.code}): ${error.message}`)
      else saved = true
    } catch (error) {
      // e.g. supabase-js needs Node.js 22+ (native WebSocket); log it and still try email below.
      console.error('Supabase client failed:', error instanceof Error ? error.message : error)
    }
  } else {
    console.error('Enquiry not saved: NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY are not set.')
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

  if (!response.ok && !saved) {
    return NextResponse.json({ error: 'We could not send your message right now. Please email us directly at om@naturalsbeautyacademypro.com.' }, { status: 502 })
  }

  return NextResponse.json({ ok: true })
}
