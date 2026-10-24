import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { MarketingTags } from '../components/marketing-tags'
import { SiteMotion } from '../components/site-motion'
import { WhatsAppFloat } from '../components/whatsapp-float'
import './globals.css'

export const metadata: Metadata = {
  metadataBase: new URL('https://naturalsbeautyacademypro.com'),
  title: 'Naturals Beauty Academy | Alappuzha',
  description: 'Professional beauty education in hair, skin, makeup and more at Naturals Beauty Academy, Alappuzha.',
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    siteName: 'Naturals Beauty Academy',
    title: 'Naturals Beauty Academy | Alappuzha',
    description: 'Professional beauty education in hair, skin, makeup and more at Naturals Beauty Academy, Alappuzha.',
    // Social apps do not show SVG previews, so shared links use this 1200×630 PNG (pages with their own image override it).
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Alappuzha Naturals Beauty Academy — professional beauty courses' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Naturals Beauty Academy | Alappuzha',
    description: 'Professional beauty education in hair, skin, makeup and more at Naturals Beauty Academy, Alappuzha.',
    images: ['/og-image.png'],
  },
  icons: {
    icon: [{ url: '/icon.svg', type: 'image/svg+xml', sizes: 'any' }],
    shortcut: '/icon.svg',
    apple: [{ url: '/icon.svg', type: 'image/svg+xml', sizes: 'any' }],
  },
}

export const viewport: Viewport = {
  colorScheme: 'light',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#70358f' },
    { media: '(prefers-color-scheme: dark)', color: '#70358f' },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
        <WhatsAppFloat />
        <SiteMotion />
        {process.env.NODE_ENV === 'production' && <Analytics />}
        <MarketingTags />
      </body>
    </html>
  )
}
