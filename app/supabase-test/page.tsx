import { cookies } from 'next/headers'
import { notFound } from 'next/navigation'
import { isSupabaseConfigured } from '../../lib/supabase/env'
import { createClient } from '../../lib/supabase/server'
import { SupabaseBrowserCheck } from '../../components/supabase-browser-check'
import { SiteFooter } from '../../components/site-footer'
import { SiteHeader } from '../../components/site-header'

export const metadata = { title: 'Supabase status | Naturals Beauty Academy', robots: { index: false, follow: false } }

type Check = { label: string; state: 'ok' | 'warn' | 'fail'; detail: string }

// Read-only connection checks. Credentials are used on the server only and never shown on the page.
async function runChecks(): Promise<Check[]> {
  const checks: Check[] = []
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim()
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY?.trim()

  checks.push({ label: 'Environment variables', state: isSupabaseConfigured ? 'ok' : 'fail', detail: isSupabaseConfigured ? 'NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY are set.' : `Missing: ${[!url && 'NEXT_PUBLIC_SUPABASE_URL', !key && 'NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY'].filter(Boolean).join(', ')}. Add them to .env.local and restart the dev server.` })
  if (!url || !key) return checks

  const nodeMajor = Number(process.versions.node.split('.')[0])
  checks.push({ label: 'Node.js version', state: nodeMajor >= 22 ? 'ok' : 'warn', detail: nodeMajor >= 22 ? `Running Node ${process.version}.` : `Running Node ${process.version}. It works inside Next.js, but Node 20 is end-of-life and deprecated by supabase-js; upgrade to Node 22 or later.` })

  try {
    const response = await fetch(`${url}/auth/v1/health`, { headers: { apikey: key }, cache: 'no-store' })
    checks.push({ label: 'Project reachable', state: response.ok ? 'ok' : 'fail', detail: response.ok ? 'The Supabase project answered and accepted the publishable key.' : `Supabase answered with HTTP ${response.status}. Check the project URL and key in Project Settings → API Keys.` })
  } catch (error) {
    checks.push({ label: 'Project reachable', state: 'fail', detail: `Could not reach Supabase: ${error instanceof Error ? error.message : 'network error'}.` })
  }

  try {
    const supabase = createClient(await cookies())
    // GET with limit(0), not a HEAD request: HEAD has no body, so supabase-js can't see a missing-table error.
    const table = await supabase.from('enquiries').select('id').limit(0)
    checks.push({ label: 'Enquiries table (server)', state: table.error ? 'fail' : 'ok', detail: table.error ? `${table.error.code}: ${table.error.message}${table.error.code === 'PGRST205' ? ' — run supabase/migrations/001_enquiries.sql in the SQL Editor.' : ''}` : 'The server client reached the enquiries table.' })

    if (!table.error) {
      const visible = await supabase.from('enquiries').select('id').limit(1)
      const leaked = (visible.data?.length ?? 0) > 0
      checks.push(visible.error
        ? { label: 'Enquiries are private', state: 'warn', detail: `Could not check: ${visible.error.code}: ${visible.error.message}` }
        : { label: 'Enquiries are private', state: leaked ? 'fail' : 'ok', detail: leaked ? 'The public key can READ enquiries. Re-check Row Level Security on the enquiries table.' : 'No enquiries are readable with the public key (Row Level Security is working).' })
    }
  } catch (error) {
    checks.push({ label: 'Enquiries table (server)', state: 'fail', detail: `The server client could not start: ${error instanceof Error ? error.message.split('\n')[0] : 'unknown error'}` })
  }

  return checks
}

export default async function SupabaseTestPage() {
  if (process.env.NODE_ENV === 'production') notFound()
  const checks = await runChecks()
  const overall = checks.some((c) => c.state === 'fail') ? 'fail' : checks.some((c) => c.state === 'warn') ? 'warn' : 'ok'
  const summary = { ok: 'Supabase is connected.', warn: 'Supabase is connected, with a warning.', fail: 'Supabase is not fully connected.' }[overall]

  return <><SiteHeader /><main className="supabase-test-page">
    <section className="academy-hero"><div className="academy-hero-inner"><p className="section-label">Developer tools · Development only</p><div className="academy-hero-copy"><h1>Supabase <em>status.</em></h1><p>{summary} These checks are read-only and never show your keys. Refresh the page to run them again.</p></div></div></section>
    <section className="sb-test"><div className="faculty-shell">
      <p className="section-label">Server checks</p>
      <ul className="sb-test-list">{checks.map((check) => <li key={check.label} data-state={check.state}><span className="sb-test-badge">{check.state === 'ok' ? 'OK' : check.state === 'warn' ? 'Warning' : 'Failed'}</span><div><strong>{check.label}</strong><p>{check.detail}</p></div></li>)}</ul>
      <p className="section-label">Browser check</p>
      <SupabaseBrowserCheck />
    </div></section>
  </main><SiteFooter /></>
}
