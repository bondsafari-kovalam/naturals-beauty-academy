'use client'

import Link from 'next/link'
import { useEffect, useState, type ComponentProps } from 'react'
import { captureAttribution, currentUtm } from '../lib/attribution'
import { trackWorkshopEvent } from '../lib/analytics'

/** Records campaign attribution on workshop pages and, on a campaign page, a "viewed workshop" event. */
export function WorkshopCampaignTracker({ workshop }: { workshop?: { slug: string; title: string } }) {
  useEffect(() => {
    captureAttribution()
    if (workshop) trackWorkshopEvent('view', workshop)
  }, [workshop])
  return null
}

/** A link that carries the current page's UTM parameters along (listing → campaign page). */
export function UtmLink({ href, ...props }: ComponentProps<typeof Link> & { href: string }) {
  const [target, setTarget] = useState(href)
  useEffect(() => {
    const utm = currentUtm()
    if (!Object.keys(utm).length) return
    const [path, query = ''] = href.split('?')
    const params = new URLSearchParams(query)
    for (const [key, value] of Object.entries(utm)) if (value && !params.has(key)) params.set(key, value)
    setTarget(`${path}?${params}`)
  }, [href])
  return <Link href={target} {...props} />
}
