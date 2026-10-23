'use client'

import Image from 'next/image'
import { useState } from 'react'
import { Play } from 'lucide-react'

// Shows a thumbnail first and only loads the YouTube player when the visitor presses play.
export function VideoCard({ id, title, date, isShort, revealed = false }: { id: string; title: string; date: string; isShort: boolean; revealed?: boolean }) {
  const [playing, setPlaying] = useState(false)
  return <article className={`video-card${isShort ? '' : ' video-card--wide'}${revealed ? ' is-visible' : ''}`} data-reveal>
    <div className="video-frame">{playing
      ? <iframe src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&playsinline=1&rel=0`} title={title} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
      : <button type="button" onClick={() => setPlaying(true)} aria-label={`Play video: ${title}`}><Image src={`https://i.ytimg.com/vi/${id}/hqdefault.jpg`} alt="" fill sizes={isShort ? '(max-width: 600px) 45vw, (max-width: 900px) 30vw, 220px' : '(max-width: 900px) 90vw, 380px'} />{isShort && <span className="video-short-badge">Short</span>}<span className="video-play"><Play /></span></button>}
    </div>
    <div className="video-body"><h3>{title}</h3><p>{date}</p></div>
  </article>
}
