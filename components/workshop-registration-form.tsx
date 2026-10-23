'use client'

import Script from 'next/script'
import { useRef, useState, type FormEvent } from 'react'
import { ArrowRight, CheckCircle2 } from 'lucide-react'
import { getAttribution } from '../lib/attribution'
import { trackWorkshopEvent } from '../lib/analytics'
import { isValidEmail, normalisePhone } from '../lib/workshop-campaign'

type Props = { slug: string; title: string; whatsappUrl: string | null }
type Errors = Partial<Record<'fullName' | 'phone' | 'email', string>>

const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY

export function WorkshopRegistrationForm({ slug, title, whatsappUrl }: Props) {
  const [state, setState] = useState<'idle' | 'sending' | 'done'>('idle')
  const [error, setError] = useState('')
  const [errors, setErrors] = useState<Errors>({})
  const startedAt = useRef(Date.now())
  const sending = useRef(false)

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (sending.current) return
    const form = new FormData(event.currentTarget)
    const fullName = String(form.get('fullName') ?? '').trim()
    const phone = String(form.get('phone') ?? '').trim()
    const email = String(form.get('email') ?? '').trim()
    const next: Errors = {}
    if (fullName.length < 2) next.fullName = 'Please enter your full name.'
    if (!normalisePhone(phone)) next.phone = 'Please enter a valid mobile number, e.g. 98765 43210.'
    if (email && !isValidEmail(email)) next.email = 'Please enter a valid email address, or leave it empty.'
    setErrors(next)
    setError('')
    if (Object.keys(next).length) return

    sending.current = true
    setState('sending')
    try {
      const response = await fetch('/api/workshops/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          slug, fullName, phone, email, message: String(form.get('message') ?? ''), website: String(form.get('website') ?? ''),
          startedAt: startedAt.current, attribution: getAttribution(), turnstileToken: String(form.get('cf-turnstile-response') ?? ''),
        }),
      })
      const result = (await response.json().catch(() => ({}))) as { ok?: boolean; error?: string; field?: keyof Errors }
      if (!response.ok || !result.ok) {
        if (result.field) setErrors({ [result.field]: result.error })
        setError(result.error ?? 'We could not save your registration. Please try again.')
        setState('idle')
        return
      }
      setState('done')
      trackWorkshopEvent('registration', { slug, title })
    } catch {
      setError('We could not reach the server. Please check your connection and try again.')
      setState('idle')
    } finally {
      sending.current = false
    }
  }

  if (state === 'done') return <div className="wr-success" role="status">
    <CheckCircle2 aria-hidden />
    <h3>Thank you! Your registration is received.</h3>
    <p>Our team will call or WhatsApp you shortly to confirm your seat for <strong>{title}</strong>.</p>
    {whatsappUrl && <a href={whatsappUrl} target="_blank" rel="noreferrer" className="button button-light">Message us on WhatsApp <ArrowRight /></a>}
  </div>

  const invalid = (name: keyof Errors) => errors[name] ? { 'aria-invalid': true as const, 'aria-describedby': `wr-${name}-error` } : {}

  return <form className="wr-form" onSubmit={submit} noValidate>
    {error && <p className="wr-alert" role="alert">{error}</p>}
    <div className="wr-field">
      <label htmlFor="wr-fullName">Full name <span aria-hidden>*</span></label>
      <input id="wr-fullName" name="fullName" autoComplete="name" required maxLength={120} {...invalid('fullName')} />
      {errors.fullName && <p id="wr-fullName-error" className="wr-error">{errors.fullName}</p>}
    </div>
    <div className="wr-field">
      <label htmlFor="wr-phone">Mobile number <span aria-hidden>*</span></label>
      <input id="wr-phone" name="phone" type="tel" inputMode="tel" autoComplete="tel" required maxLength={20} placeholder="98765 43210" {...invalid('phone')} />
      {errors.phone && <p id="wr-phone-error" className="wr-error">{errors.phone}</p>}
    </div>
    <div className="wr-field">
      <label htmlFor="wr-email">Email <small>(optional)</small></label>
      <input id="wr-email" name="email" type="email" autoComplete="email" maxLength={254} {...invalid('email')} />
      {errors.email && <p id="wr-email-error" className="wr-error">{errors.email}</p>}
    </div>
    <div className="wr-field">
      <label htmlFor="wr-message">Message <small>(optional)</small></label>
      <textarea id="wr-message" name="message" rows={3} maxLength={1000} placeholder="Anything we should know?" />
    </div>
    {/* Honeypot: hidden from people, often filled in by bots. */}
    <div className="wr-hp" aria-hidden><label htmlFor="wr-website">Website</label><input id="wr-website" name="website" tabIndex={-1} autoComplete="off" /></div>
    {TURNSTILE_SITE_KEY && <><Script src="https://challenges.cloudflare.com/turnstile/v0/api.js" strategy="afterInteractive" /><div className="cf-turnstile" data-sitekey={TURNSTILE_SITE_KEY} /></>}
    <button type="submit" className="button button-dark wr-submit" disabled={state === 'sending'}>{state === 'sending' ? 'Submitting…' : <>Submit registration <ArrowRight /></>}</button>
    <p className="wr-note">We use your details only to contact you about this workshop. Registration is confirmed once our team calls or messages you.</p>
  </form>
}
