'use client'

import { useEffect, useState } from 'react'
import { createClient } from '../lib/supabase/client'

// Confirms the public settings reached the browser and the browser can talk to Supabase (read-only).
export function SupabaseBrowserCheck() {
  const [result, setResult] = useState<{ state: 'ok' | 'fail'; detail: string } | null>(null)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const { error } = await createClient().from('enquiries').select('id').limit(0)
        if (!cancelled) setResult(error ? { state: 'fail', detail: `${error.code}: ${error.message}` } : { state: 'ok', detail: 'This browser reached the enquiries table using the publishable key.' })
      } catch (error) {
        if (!cancelled) setResult({ state: 'fail', detail: error instanceof Error ? error.message : 'Unknown error' })
      }
    })()
    return () => { cancelled = true }
  }, [])

  const state = result?.state ?? 'warn'
  return <ul className="sb-test-list"><li data-state={state}><span className="sb-test-badge">{result ? (result.state === 'ok' ? 'OK' : 'Failed') : 'Checking'}</span><div><strong>Enquiries table (browser)</strong><p>{result?.detail ?? 'Running check…'}</p></div></li></ul>
}
