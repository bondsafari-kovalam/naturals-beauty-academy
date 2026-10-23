'use client'

import { useState } from 'react'
import { VideoCard } from './video-card'
import type { YouTubeVideo } from '../lib/youtube'

const PAGE_SIZE = 15

function formatDate(value: string) {
  return new Intl.DateTimeFormat('en-IN', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'Asia/Kolkata' }).format(new Date(value))
}

function displayTitle(title: string) {
  return title.replace(/#\S+/g, '').replace(/\s+/g, ' ').trim() || title
}

export function VideoLibrary({ videos }: { videos: YouTubeVideo[] }) {
  const [page, setPage] = useState(0)
  const totalPages = Math.ceil(videos.length / PAGE_SIZE)
  const visibleVideos = videos.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE)

  if (videos.length === 0) return null

  return <section className="videos-section videos-section--soft">
    <div className="faculty-shell">
      <div className="faculty-heading">
        <p className="section-label">Student stories</p>
        <h2>Watch and <em>learn.</em></h2>
        <p>Stories, tutorials and beauty moments from our students and academy.</p>
      </div>
      <div className="video-grid video-grid--wide">
        {visibleVideos.map((video) => <VideoCard key={video.id} id={video.id} title={displayTitle(video.title)} date={formatDate(video.published)} isShort={video.isShort} revealed />)}
      </div>
      {totalPages > 1 && <div className="video-pagination" aria-label="Student stories pagination">
        <button type="button" className="button button-light" onClick={() => setPage((current) => current - 1)} disabled={page === 0}>Previous</button>
        <span>Page {page + 1} of {totalPages}</span>
        <button type="button" className="button button-dark" onClick={() => setPage((current) => current + 1)} disabled={page === totalPages - 1}>Next</button>
      </div>}
    </div>
  </section>
}
