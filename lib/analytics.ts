'use client'

import { track } from '@vercel/analytics'

type Fbq = (command: 'track' | 'trackCustom', event: string, params?: Record<string, unknown>) => void
type Gtag = (command: 'event', event: string, params?: Record<string, unknown>) => void

// Sends a conversion-funnel event to the analytics tools that are configured (Vercel Analytics always;
// Meta Pixel and GA4 only when their IDs are set). Never pass personal data (names, phone numbers, emails).
export function trackWorkshopEvent(kind: 'view' | 'registration', workshop: { slug: string; title: string }) {
  const params = { content_name: workshop.title, content_ids: [workshop.slug], content_category: 'workshop' }
  const w = window as unknown as { fbq?: Fbq; gtag?: Gtag }
  try {
    if (kind === 'view') {
      w.fbq?.('track', 'ViewContent', params)
      w.gtag?.('event', 'view_item', { items: [{ item_id: workshop.slug, item_name: workshop.title, item_category: 'workshop' }] })
    } else {
      track('workshop_registration', { workshop: workshop.slug })
      w.fbq?.('track', 'CompleteRegistration', params)
      w.gtag?.('event', 'generate_lead', { workshop: workshop.slug })
    }
  } catch {
    // Analytics must never break the page.
  }
}
