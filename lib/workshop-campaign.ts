import { siteConfig, workshopDateParts, type Workshop } from './site-config'

// Shared by the registration form (browser) and /api/workshops/register (server).

/**
 * Normalises a mobile number to international format (+919876543210).
 * Accepts Indian numbers with or without +91 / 0, spaces and dashes, and other numbers that start with +.
 * Returns null when it cannot be a valid number.
 */
export function normalisePhone(input: string) {
  const raw = input.trim()
  const digits = raw.replace(/\D/g, '')
  if (raw.startsWith('+')) return /^[1-9]\d{7,14}$/.test(digits) ? `+${digits}` : null
  if (/^[6-9]\d{9}$/.test(digits)) return `+91${digits}`
  if (/^0[6-9]\d{9}$/.test(digits)) return `+91${digits.slice(1)}`
  if (/^91[6-9]\d{9}$/.test(digits)) return `+${digits}`
  return null
}

export const isValidEmail = (value: string) => value.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)

/** The academy's business WhatsApp number (NEXT_PUBLIC_WHATSAPP_NUMBER overrides site-config), digits only, or null. */
export function whatsappNumber() {
  const digits = (process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || siteConfig.whatsapp || '').replace(/\D/g, '')
  return digits.length >= 8 ? digits : null
}

/** wa.me link with a pre-filled enquiry about this workshop, or null when no number is configured. */
export function workshopWhatsappUrl(workshop: Pick<Workshop, 'title' | 'date'>) {
  const number = whatsappNumber()
  if (!number) return null
  const text = `Hello, I would like to know more about the "${workshop.title}" workshop on ${workshopDateParts(workshop.date).label} at Naturals Beauty Academy.`
  return `https://wa.me/${number}?text=${encodeURIComponent(text)}`
}

export const UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'] as const
export type Attribution = Partial<Record<(typeof UTM_KEYS)[number], string>> & { referrer?: string; landing_path?: string }
