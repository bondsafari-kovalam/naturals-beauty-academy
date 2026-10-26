import type { Metadata } from 'next'

// Production address: metadataBase, canonical links, the sitemap and structured data all build on it.
export const siteUrl = 'https://naturalsbeautyacademypro.com'
export const siteName = 'Naturals Beauty Academy'
const defaultImage = { url: '/og-image.png', width: 1200, height: 630, alt: 'Alappuzha Naturals Beauty Academy — professional beauty courses' }

// The academy's details exactly as published on the contact page and footer. Keep them in step (NAP consistency).
export const academy = {
  name: 'Naturals Beauty Academy, Alappuzha',
  telephone: '+91-89296-60506',
  email: 'om@naturalsbeautyacademypro.com',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'ASAP Community Skill Park, Cheriya Kalavoor Temple, Behind Little Flower Nursery',
    addressLocality: 'Alappuzha',
    addressRegion: 'Kerala',
    postalCode: '688522',
    addressCountry: 'IN',
  },
  sameAs: [
    'https://www.instagram.com/naturalsbeautyacademyalappuzha/',
    'https://www.facebook.com/naturalsbeautyacademyalappuzha',
    'https://www.youtube.com/@alappuzhanaturalsbeautyacademy',
  ],
}

export const absoluteUrl = (src: string) => (src.startsWith('/') ? `${siteUrl}${src}` : src)

/**
 * Title, description, canonical, Open Graph and X card for one page. Next.js replaces (does not merge) a parent's
 * openGraph, so every page sets the whole block here rather than inheriting the root layout's title and URL.
 */
export function pageMetadata({ title, description, path, image, imageAlt, type = 'website', robots }: {
  title: string
  description: string
  path: string
  image?: string | null
  imageAlt?: string
  type?: 'website' | 'article'
  robots?: Metadata['robots']
}): Metadata {
  const fullTitle = title.includes(siteName) ? title : `${title} | ${siteName}`
  // WhatsApp, Facebook and X cannot show AVIF or SVG previews; those pages share the site image instead.
  const images = image && !/\.(avif|svg)(\?|$)/i.test(image) ? [{ url: image, alt: imageAlt ?? title }] : [defaultImage]
  return {
    title: { absolute: fullTitle },
    description,
    alternates: { canonical: path },
    robots,
    openGraph: { type, siteName, locale: 'en_IN', url: path, title: fullTitle, description, images },
    twitter: { card: 'summary_large_image', title: fullTitle, description, images: images.map((item) => item.url) },
  }
}

// ---------------------------------------------------------------------------
// Structured data (schema.org JSON-LD). Only facts that are visible on the site; no ratings, fees or invented dates.
// ---------------------------------------------------------------------------
export const organizationId = `${siteUrl}/#organization`

export const organizationSchema = {
  '@type': 'EducationalOrganization',
  '@id': organizationId,
  name: academy.name,
  alternateName: siteName,
  url: siteUrl,
  logo: `${siteUrl}/alappuzha-naturals-beauty-academy-logo.png`,
  image: `${siteUrl}/og-image.png`,
  email: academy.email,
  telephone: academy.telephone,
  address: academy.address,
  sameAs: academy.sameAs,
}

export const websiteSchema = {
  '@type': 'WebSite',
  '@id': `${siteUrl}/#website`,
  url: siteUrl,
  name: siteName,
  inLanguage: 'en-IN',
  publisher: { '@id': organizationId },
}

/** Breadcrumb trail; the last item is the current page. */
export function breadcrumbSchema(items: Array<[name: string, path: string]>) {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: items.map(([name, path], i) => ({ '@type': 'ListItem', position: i + 1, name, item: `${siteUrl}${path === '/' ? '' : path}` })),
  }
}

/** "360 Hrs" → "PT360H"; anything else → undefined. */
export function isoHours(duration?: string) {
  const hours = duration?.match(/^\s*(\d+)\s*h/i)?.[1]
  return hours ? `PT${hours}H` : undefined
}

/** Serialises one or more schema.org nodes for a <script type="application/ld+json">, escaping `<` against XSS. */
export function jsonLd(...nodes: object[]) {
  const data = nodes.length === 1 ? { '@context': 'https://schema.org', ...nodes[0] } : { '@context': 'https://schema.org', '@graph': nodes }
  return { __html: JSON.stringify(data).replace(/</g, '\\u003c') }
}
