import { siteConfig } from './site-config'

export type YouTubeVideo = {
  id: string
  title: string
  published: string
  isShort: boolean
}

const entities: Record<string, string> = { '&amp;': '&', '&lt;': '<', '&gt;': '>', '&quot;': '"', '&#39;': "'", '&apos;': "'" }

function decode(value: string) {
  return value.replace(/&(amp|lt|gt|quot|#39|apos);/g, (match) => entities[match] ?? match)
}

function pick(entry: string, pattern: RegExp) {
  return entry.match(pattern)?.[1]?.trim() ?? ''
}

const YOUTUBE_API = 'https://www.googleapis.com/youtube/v3'

// The key goes in a header, not the URL, so it never appears in logs or error messages.
async function youtubeApi<T>(path: string, apiKey: string): Promise<T | null> {
  const response = await fetch(`${YOUTUBE_API}/${path}`, { headers: { 'X-Goog-Api-Key': apiKey }, next: { revalidate: 300 } })
  if (!response.ok) {
    console.warn(`YouTube API ${path.split('?')[0]}: HTTP ${response.status}`)
    return null
  }
  return response.json() as Promise<T>
}

// ISO 8601 duration (e.g. PT1M5S) → seconds.
function durationSeconds(value: string | undefined) {
  const match = value?.match(/^P(?:(\d+)D)?T?(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?$/)
  if (!match) return Number.POSITIVE_INFINITY
  const [, d = '0', h = '0', m = '0', sec = '0'] = match
  return ((Number(d) * 24 + Number(h)) * 60 + Number(m)) * 60 + Number(sec)
}

// youtube.com/shorts/<id> answers 200 for a Short and redirects (303) for a regular video.
// Results never change, so they are remembered for the life of the server.
// No `cache: 'no-store'` here: it would make /videos render on every visit (about 7 s) instead of being
// pre-built and refreshed every 5 minutes.
const shortsCache = new Map<string, boolean>()
async function isShortsVideo(id: string) {
  const known = shortsCache.get(id)
  if (known !== undefined) return known
  try {
    const response = await fetch(`https://www.youtube.com/shorts/${id}`, { method: 'HEAD', redirect: 'manual' })
    const isShort = response.status === 200
    if (response.status === 200 || (response.status >= 300 && response.status < 400)) shortsCache.set(id, isShort)
    return isShort
  } catch {
    return false
  }
}

async function getAllChannelVideos(apiKey: string): Promise<YouTubeVideo[]> {
  type Channel = { items?: Array<{ contentDetails?: { relatedPlaylists?: { uploads?: string } } }> }
  type Playlist = { nextPageToken?: string; items?: Array<{ snippet?: { resourceId?: { videoId?: string }; title?: string; publishedAt?: string } }> }
  type Details = { items?: Array<{ id?: string; contentDetails?: { duration?: string } }> }

  const channel = await youtubeApi<Channel>(`channels?part=contentDetails&id=${siteConfig.youtubeChannelId}`, apiKey)
  const playlistId = channel?.items?.[0]?.contentDetails?.relatedPlaylists?.uploads
  if (!playlistId) return []

  const uploads: Omit<YouTubeVideo, 'isShort'>[] = []
  let pageToken = ''
  do {
    const page = await youtubeApi<Playlist>(`playlistItems?part=snippet&maxResults=50&playlistId=${playlistId}${pageToken ? `&pageToken=${encodeURIComponent(pageToken)}` : ''}`, apiKey)
    if (!page) return []
    for (const item of page.items ?? []) {
      const id = item.snippet?.resourceId?.videoId
      // Private or deleted uploads have no usable title; skip them.
      if (id && item.snippet?.title && !/^(Private|Deleted) video$/.test(item.snippet.title)) uploads.push({ id, title: item.snippet.title, published: item.snippet.publishedAt ?? '' })
    }
    pageToken = page.nextPageToken ?? ''
  } while (pageToken)

  // Durations, 50 videos per request. Shorts are at most 3 minutes long; longer videos are regular.
  const durations = new Map<string, number>()
  for (let i = 0; i < uploads.length; i += 50) {
    const ids = uploads.slice(i, i + 50).map((video) => video.id).join(',')
    const details = await youtubeApi<Details>(`videos?part=contentDetails&id=${ids}`, apiKey)
    for (const item of details?.items ?? []) if (item.id) durations.set(item.id, durationSeconds(item.contentDetails?.duration))
  }

  const videos: YouTubeVideo[] = []
  for (let i = 0; i < uploads.length; i += 10) {
    const batch = uploads.slice(i, i + 10)
    const flags = await Promise.all(batch.map((video) => ((durations.get(video.id) ?? Number.POSITIVE_INFINITY) <= 180 ? isShortsVideo(video.id) : false)))
    batch.forEach((video, index) => videos.push({ ...video, isShort: flags[index] }))
  }
  return videos
}

async function getRecentChannelVideos(): Promise<YouTubeVideo[]> {
  try {
    const response = await fetch(`https://www.youtube.com/feeds/videos.xml?channel_id=${siteConfig.youtubeChannelId}`, { next: { revalidate: 300 } })
    if (!response.ok) return []
    const xml = await response.text()
    return Array.from(xml.matchAll(/<entry>([\s\S]*?)<\/entry>/g), ([, entry]) => ({
      id: pick(entry, /<yt:videoId>([^<]+)<\/yt:videoId>/),
      title: decode(pick(entry, /<title>([^<]*)<\/title>/)),
      published: pick(entry, /<published>([^<]+)<\/published>/),
      isShort: /href="https:\/\/www\.youtube\.com\/shorts\//.test(entry),
    })).filter((video) => video.id)
  } catch {
    return []
  }
}

// Uses the Data API for the complete uploads playlist when configured; RSS keeps the page
// functional with the latest uploads when a project has not added an API key yet.
export async function getChannelVideos(): Promise<YouTubeVideo[]> {
  try {
    const apiKey = process.env.YOUTUBE_API_KEY?.trim()
    if (apiKey) {
      const videos = await getAllChannelVideos(apiKey)
      if (videos.length > 0) return videos
    }
    return await getRecentChannelVideos()
  } catch {
    return getRecentChannelVideos()
  }
}

// Hashtags are useful on YouTube but noisy on the site; fall back to the full title if nothing is left.
export function displayTitle(title: string) {
  return title.replace(/#\S+/g, '').replace(/\s+/g, ' ').trim() || title
}

export function formatVideoDate(published: string) {
  return new Intl.DateTimeFormat('en-IN', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'Asia/Kolkata' }).format(new Date(published))
}
