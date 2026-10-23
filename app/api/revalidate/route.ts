import { timingSafeEqual } from 'node:crypto'
import { revalidatePath } from 'next/cache'

// Called by the admin panel (a separate app) after it saves courses, faculty or workshops,
// so edits show on the website right away instead of after the pages' revalidate window.
export async function POST(request: Request) {
  const secret = process.env.REVALIDATE_SECRET
  if (!secret) return Response.json({ error: 'Revalidation is not configured.' }, { status: 503 })

  const sent = Buffer.from(request.headers.get('authorization')?.replace(/^Bearer /, '') ?? '')
  const expected = Buffer.from(secret)
  if (sent.length !== expected.length || !timingSafeEqual(sent, expected)) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // The site is small and admin content appears on several pages (home, listings, detail pages,
  // contact form), so refresh everything under the root layout rather than tracking each path.
  revalidatePath('/', 'layout')
  return Response.json({ revalidated: true })
}
