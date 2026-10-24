// Images can come from the admin panel as any https:// link, but next/image only optimises the hosts listed
// in next.config.mjs (images.remotePatterns); any other host is rejected by the optimiser and shows as a
// broken image. Pass `unoptimized={!canOptimize(src)}` so those links load straight from their own server.
// Keep this list in step with next.config.mjs.
const supabaseHost = (() => {
  try {
    return new URL(process.env.NEXT_PUBLIC_SUPABASE_URL ?? '').hostname
  } catch {
    return null
  }
})()

export function canOptimize(src: string) {
  // Website /public files; a query string would need images.localPatterns, so those load as-is.
  if (src.startsWith('/') && !src.startsWith('//')) return !src.includes('?')
  try {
    const url = new URL(src)
    if (url.protocol !== 'https:') return false
    if (url.hostname === 'images.unsplash.com' || url.hostname === 'i.ytimg.com') return true
    return url.hostname === supabaseHost && url.pathname.startsWith('/storage/v1/object/public/')
  } catch {
    return false
  }
}
