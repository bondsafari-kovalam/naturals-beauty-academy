'use client'

import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Mail, MapPin, Phone } from 'lucide-react'

const academyMapLink = 'https://www.google.com/maps/search/?api=1&query=Cheriya%20Kalavoor%20Temple%2C%20ASAP%20Community%20Skill%20Park%2C%20Alappuzha%2C%20Kerala%20688522%2C%20India'

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="footer-cta">
        <div><span>YOUR NEXT CHAPTER STARTS HERE</span><h2>Make beauty your <em>beautiful career.</em></h2></div>
        <Link href="/contact" className="footer-cta-link">Talk to our team <ArrowRight /></Link>
      </div>
      <div className="footer-grid">
        <div className="footer-brand-column">
          <Image className="footer-logo" src="/alappuzha-naturals-beauty-academy-logo.png" alt="Alappuzha Naturals Beauty Academy" width={300} height={145} />
          <p className="footer-brand-copy">Practical beauty education for a beautiful career. Learn your craft, build confidence and take your next step with Naturals.</p>
          <p className="footer-social-label">Follow the academy</p>
          <div className="socials">
            <a href="https://www.instagram.com/naturalsbeautyacademyalappuzha/?igsh=Y2xwbHZwbjRuM2J4" aria-label="Instagram" target="_blank" rel="noreferrer"><svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor"><path d="M7.5 2h9A5.5 5.5 0 0 1 22 7.5v9a5.5 5.5 0 0 1-5.5 5.5h-9A5.5 5.5 0 0 1 2 16.5v-9A5.5 5.5 0 0 1 7.5 2Zm0 2A3.5 3.5 0 0 0 4 7.5v9A3.5 3.5 0 0 0 7.5 20h9a3.5 3.5 0 0 0 3.5-3.5v-9A3.5 3.5 0 0 0 16.5 4h-9ZM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10Zm0 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6Zm5.25-3a1.25 1.25 0 1 1 0 2.5 1.25 1.25 0 0 1 0-2.5Z" /></svg></a>
            <a href="https://www.facebook.com/naturalsbeautyacademyalappuzha" aria-label="Facebook" target="_blank" rel="noreferrer"><svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor"><path d="M13.5 21v-8.2h2.76l.41-3.2H13.5V7.56c0-.93.26-1.56 1.59-1.56h1.7V3.14C16.5 3.05 15.52 3 14.38 3c-2.38 0-4.01 1.45-4.01 4.12V9.6H7.68v3.2h2.69V21h3.13Z" /></svg></a>
            <a href="https://wa.me/918929660506" aria-label="WhatsApp" target="_blank" rel="noreferrer"><svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor"><path d="M20.52 3.48A11.86 11.86 0 0 0 12.08 0C5.5 0 .15 5.34.15 11.92c0 2.1.55 4.14 1.6 5.95L0 24l6.28-1.65a11.9 11.9 0 0 0 5.8 1.48h.01c6.58 0 11.92-5.35 11.92-11.93 0-3.18-1.24-6.17-3.49-8.42ZM12.08 21.8a9.9 9.9 0 0 1-5.04-1.38l-.36-.21-3.73.98 1-3.64-.24-.37a9.85 9.85 0 0 1-1.51-5.26c0-5.45 4.43-9.88 9.89-9.88a9.8 9.8 0 0 1 6.99 2.9 9.82 9.82 0 0 1 2.89 7c0 5.45-4.44 9.88-9.89 9.88Zm5.42-7.4c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.47-.88-.78-1.47-1.75-1.64-2.05-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.03-.52-.07-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.49s1.07 2.89 1.22 3.09c.15.2 2.1 3.2 5.08 4.49.71.3 1.27.49 1.7.63.71.23 1.36.2 1.87.12.57-.08 1.76-.72 2-1.42.25-.7.25-1.3.18-1.42-.08-.13-.28-.2-.58-.35Z" /></svg></a>
            <a href="https://youtube.com/@alappuzhanaturalsbeautyacademy" aria-label="YouTube" target="_blank" rel="noreferrer"><svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor"><path d="M23.5 6.2a3 3 0 0 0-2.1-2.12C19.54 3.57 12 3.57 12 3.57s-7.54 0-9.4.51A3 3 0 0 0 .5 6.2 31.4 31.4 0 0 0 0 12a31.4 31.4 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.12c1.86.51 9.4.51 9.4.51s7.54 0 9.4-.51a3 3 0 0 0 2.1-2.12A31.4 31.4 0 0 0 24 12a31.4 31.4 0 0 0-.5-5.8ZM9.55 15.57V8.43L15.82 12l-6.27 3.57Z" /></svg></a>
            <a href="mailto:om@naturalsbeautyacademypro.com" aria-label="Email"><Mail /></a>
          </div>
        </div>
        <nav className="footer-links-column" aria-label="Explore links">
          <h3>Explore</h3>
          <Link href="/">Home</Link>
          <Link href="/the-academy">The Academy</Link>
          <Link href="/faculty">Faculty</Link>
          <Link href="/courses">Courses</Link>
          <Link href="/workshops">Workshops</Link>
          <Link href="/videos">Student Stories</Link>
          <Link href="/blog">Blog</Link>
          <Link href="/contact">Contact</Link>
        </nav>
        <nav className="footer-links-column" aria-label="Information links">
          <h3>Information</h3>
          <Link href="/privacy-policy">Privacy Policy</Link>
          <Link href="/terms-and-conditions">Terms &amp; Conditions</Link>
        </nav>
        <div className="footer-contact-column">
          <h3>Visit us</h3>
          <a href={academyMapLink} target="_blank" rel="noreferrer" aria-label="Open Naturals Beauty Academy location in Google Maps"><MapPin /><span>Cheriya Kalavoor Temple, ASAP Community Skill Park, Behind Little Flower Nursery, Alappuzha, Kerala 688522, India</span></a>
          <a href="tel:08929660506"><Phone /><span>08929660506</span></a>
          <a href="mailto:om@naturalsbeautyacademypro.com"><Mail /><span>om@naturalsbeautyacademypro.com</span></a>
        </div>
      </div>
      <div className="footer-bottom">
        <span>&copy; {new Date().getFullYear()} Naturals Beauty Academy. All rights reserved.</span>
        <a href="#top" className="footer-top-link">Back to top</a>
      </div>
    </footer>
  )
}
