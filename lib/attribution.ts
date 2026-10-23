'use client'

import { UTM_KEYS, type Attribution } from './workshop-campaign'

// Campaign attribution for workshop registrations, kept in this browser only (localStorage, 30 days).
// First touch wins: a later visit does not overwrite the campaign that first brought the visitor,
// except that a campaign click replaces an earlier visit that had no campaign at all.
const STORAGE_KEY = 'nba_workshop_attribution'
const MAX_AGE = 30 * 24 * 60 * 60 * 1000

type Stored = Attribution & { saved_at: number }

function read(): Stored | null {
  try {
    const stored = JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? 'null') as Stored | null
    return stored && Date.now() - stored.saved_at < MAX_AGE ? stored : null
  } catch {
    return null
  }
}

/** UTM parameters in the current URL (only the five standard ones, trimmed). */
export function currentUtm(): Attribution {
  const params = new URLSearchParams(window.location.search)
  const utm: Attribution = {}
  for (const key of UTM_KEYS) {
    const value = params.get(key)?.trim().slice(0, 150)
    if (value) utm[key] = value
  }
  return utm
}

/** Call on every workshop page view. */
export function captureAttribution() {
  const utm = currentUtm()
  const existing = read()
  if (existing && (existing.utm_source || !utm.utm_source)) return
  // Only the referring site's address is kept, never its full URL (which may carry personal data).
  let referrer: string | undefined
  try { referrer = document.referrer ? new URL(document.referrer).origin : undefined } catch { referrer = undefined }
  if (referrer === window.location.origin) referrer = undefined
  const next: Stored = { ...utm, referrer, landing_path: window.location.pathname.slice(0, 300), saved_at: Date.now() }
  try { window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next)) } catch { /* storage blocked: attribution is optional */ }
}

/** Attribution to send with a registration: the stored first touch, else whatever the current URL carries. */
export function getAttribution(): Attribution {
  const stored = read()
  if (stored) {
    const { saved_at: _savedAt, ...rest } = stored
    void _savedAt
    return rest
  }
  return { ...currentUtm(), landing_path: window.location.pathname }
}
