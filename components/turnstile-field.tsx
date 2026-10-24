'use client'

import Script from 'next/script'

// Cloudflare Turnstile widget. Renders nothing until NEXT_PUBLIC_TURNSTILE_SITE_KEY is set; the token
// is posted as the form field "cf-turnstile-response".
const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY

export function TurnstileField() {
  if (!TURNSTILE_SITE_KEY) return null
  return <><Script src="https://challenges.cloudflare.com/turnstile/v0/api.js" strategy="afterInteractive" /><div className="cf-turnstile" data-sitekey={TURNSTILE_SITE_KEY} /></>
}

/** A Turnstile token works once, so a failed submission needs a fresh challenge before the next try. */
export function resetTurnstile() {
  try { (window as unknown as { turnstile?: { reset: () => void } }).turnstile?.reset() } catch { /* widget not loaded */ }
}
