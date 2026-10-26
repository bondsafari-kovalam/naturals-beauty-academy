import { ArrowRight, PlaySquare } from 'lucide-react'
import { siteConfig } from '../../lib/site-config'
import { getChannelVideos } from '../../lib/youtube'
import { ScrollRevealObserver } from '../../components/scroll-reveal-observer'
import { SiteFooter } from '../../components/site-footer'
import { SiteHeader } from '../../components/site-header'
import { VideoLibrary } from '../../components/video-library'
import { pageMetadata } from '../../lib/seo'

export const metadata = pageMetadata({
  title: 'Student Stories & Beauty Videos',
  description: 'Watch student stories, makeup looks, hair styling and beauty training videos from Naturals Beauty Academy, Alappuzha.',
  path: '/videos',
})

// New uploads appear on the site within five minutes when the YouTube API is configured.
export const revalidate = 300

export default async function VideosPage() {
  const videos = await getChannelVideos()

  return <><ScrollRevealObserver /><SiteHeader /><main className="videos-page">
    <section className="academy-hero"><div className="academy-hero-inner"><p className="section-label">Watch &amp; learn · YouTube</p><div className="academy-hero-copy"><h1>See our artistry <em>in motion.</em></h1><p>Makeup looks, hair styling and student transformations from our academy in Alappuzha.</p><a href={siteConfig.youtube} target="_blank" rel="noreferrer" className="button button-dark">Subscribe on YouTube <ArrowRight /></a></div></div></section>

    {videos.length === 0 && <section className="videos-section"><div className="videos-empty" data-reveal><span className="benefit-icon"><PlaySquare /></span><h3>Our student stories are on YouTube.</h3><p>We couldn&rsquo;t load the latest stories just now. Watch them directly on our channel.</p><a href={siteConfig.youtube} target="_blank" rel="noreferrer" className="button button-dark">Watch on YouTube <ArrowRight /></a></div></section>}

    <VideoLibrary videos={videos} />

    <section className="academy-careers"><div className="academy-careers-icon"><PlaySquare /></div><div><p className="section-label">Never miss a video</p><h2>Follow our <em>channel.</em></h2><p>Subscribe for new looks, tutorials and highlights from our classes and workshops.</p></div><a href={siteConfig.youtube} target="_blank" rel="noreferrer" className="button button-dark">Subscribe <ArrowRight /></a></section>
  </main><SiteFooter /></>
}
