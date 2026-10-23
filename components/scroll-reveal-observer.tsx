'use client'

import { useEffect } from 'react'

export function ScrollRevealObserver() {
  useEffect(() => {
    const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (motionPreference.matches || !('IntersectionObserver' in window)) return

    const elements = document.querySelectorAll<HTMLElement>('[data-reveal]')
    if (elements.length === 0) return

    const observer = new IntersectionObserver((entries, currentObserver) => {
      // Elements that enter together are staggered; the delay is cleared afterwards so hover transitions stay instant.
      entries.filter((entry) => entry.isIntersecting).forEach((entry, index) => {
        const element = entry.target as HTMLElement
        const delay = Math.min(index, 5) * 120
        element.style.transitionDelay = `${delay}ms`
        element.classList.add('is-visible')
        currentObserver.unobserve(element)
        window.setTimeout(() => { element.style.transitionDelay = '' }, delay + 1000)
      })
    }, { threshold: 0.12, rootMargin: '0px 0px -32px 0px' })

    document.documentElement.classList.add('reveal-ready')
    elements.forEach((element) => observer.observe(element))

    return () => {
      observer.disconnect()
      document.documentElement.classList.remove('reveal-ready')
    }
  }, [])

  return null
}
