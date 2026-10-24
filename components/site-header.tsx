'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { ArrowRight, Menu, X } from 'lucide-react'

const logo = '/alappuzha-naturals-beauty-academy-logo.png'
const links = [
  ['The Academy', '/the-academy'],
  ['Faculty', '/faculty'],
  ['Courses', '/courses'],
  ['Workshops', '/workshops'],
  ['Student Stories', '/videos'],
  ['Blog', '/blog'],
  ['Contact', '/contact#enquiry'],
]

export function SiteHeader() {
  const [open, setOpen] = useState(false)
  const menuButtonRef = useRef<HTMLButtonElement>(null)
  const pathname = usePathname()
  const isActive = (href: string) => {
    const route = href.split('#')[0]
    return route === '/' ? pathname === '/' : pathname === route || pathname.startsWith(`${route}/`)
  }

  useEffect(() => {
    if (!open) return

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return
      setOpen(false)
      menuButtonRef.current?.focus()
    }

    window.addEventListener('keydown', closeOnEscape)
    return () => window.removeEventListener('keydown', closeOnEscape)
  }, [open])

  // While the menu is open the page behind it is blurred and cannot scroll (styles: html.menu-open).
  // Close it when the screen grows to the desktop header, so the page is never left locked.
  useEffect(() => {
    if (!open) return
    document.documentElement.classList.add('menu-open')
    const desktop = window.matchMedia('(min-width: 981px)')
    const closeOnDesktop = () => { if (desktop.matches) setOpen(false) }
    desktop.addEventListener('change', closeOnDesktop)
    return () => {
      document.documentElement.classList.remove('menu-open')
      desktop.removeEventListener('change', closeOnDesktop)
    }
  }, [open])

  return (
    <>
    {open && <div className="menu-backdrop" aria-hidden="true" onClick={() => setOpen(false)} />}
    <header id="top" className="site-header">
      <div className="nav-shell">
        <Link href="/" className="brand" aria-label="Naturals Beauty Academy home">
          <Image src={logo} alt="Alappuzha Naturals Beauty Academy" width={230} height={72} priority />
        </Link>
        <nav className="desktop-nav" aria-label="Main navigation">
          <Link href="/" aria-current={isActive('/') ? 'page' : undefined}>Home</Link>
          {links.map(([label, href]) => <Link key={href} href={href} aria-current={isActive(href) ? 'page' : undefined}>{label}</Link>)}
        </nav>
        <div className="nav-actions">
          <Link href="/contact#enquiry" className="nav-cta">Enquire now <ArrowRight /></Link>
          <button ref={menuButtonRef} className="menu-button" onClick={() => setOpen(!open)} aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open} aria-controls="mobile-site-navigation">
            {open ? <X /> : <Menu />}
          </button>
        </div>
      </div>
      <nav id="mobile-site-navigation" className="mobile-nav" aria-label="Mobile navigation" hidden={!open}>
        <Link href="/" onClick={() => setOpen(false)} aria-current={isActive('/') ? 'page' : undefined}>Home</Link>
        {links.map(([label, href]) => <Link key={href} href={href} onClick={() => setOpen(false)} aria-current={isActive(href) ? 'page' : undefined}>{label}</Link>)}
        <Link href="/contact#enquiry" onClick={() => setOpen(false)}>Enquire now</Link>
      </nav>
    </header>
    </>
  )
}
