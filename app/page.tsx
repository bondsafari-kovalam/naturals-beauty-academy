import type { Metadata } from 'next'
import { HomePage } from '../components/home-page'
import { siteUrl } from '../lib/blog'
import { getCourses } from '../lib/courses'
import { getTestimonials } from '../lib/testimonials'

// Courses and testimonials come from Supabase; refresh the static homepage at most every 5 minutes.
export const revalidate = 300

export const metadata: Metadata = { alternates: { canonical: '/' } }

// Lets search engines show the academy's name, logo, address and contact details (schema.org).
const organization = {
  '@context': 'https://schema.org',
  '@type': 'EducationalOrganization',
  name: 'Naturals Beauty Academy, Alappuzha',
  url: siteUrl,
  logo: `${siteUrl}/alappuzha-naturals-beauty-academy-logo.png`,
  image: `${siteUrl}/og-image.png`,
  email: 'om@naturalsbeautyacademypro.com',
  telephone: '+91 89296 60506',
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

export default async function Page() {
  const [courses, testimonials] = await Promise.all([getCourses(), getTestimonials()])
  return <>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organization).replace(/</g, '\\u003c') }} />
    <HomePage courses={courses} testimonials={testimonials} />
  </>
}
