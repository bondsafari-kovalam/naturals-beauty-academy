'use client'

import { usePathname } from 'next/navigation'
import { useEffect } from 'react'

const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches
const hasFinePointer = () => window.matchMedia('(hover: hover) and (pointer: fine)').matches

/* Inertial wheel scrolling, similar in feel to Lenis. Keyboard, touch and scrollbar scrolling stay native. */
function useSmoothScroll() {
  useEffect(() => {
    if (prefersReducedMotion() || !hasFinePointer()) return

    const root = document.documentElement
    let current = window.scrollY
    let target = current
    let frame = 0
    let last = 0

    const clamp = (value: number) => Math.max(0, Math.min(root.scrollHeight - window.innerHeight, value))
    const stop = () => {
      cancelAnimationFrame(frame)
      frame = 0
      last = 0
      current = target = window.scrollY
    }
    const canScrollInside = (node: EventTarget | null, deltaY: number) => {
      for (let el = node instanceof Element ? node : null; el && el !== document.body; el = el.parentElement) {
        if (!/(auto|scroll)/.test(window.getComputedStyle(el).overflowY) || el.scrollHeight <= el.clientHeight) continue
        if (deltaY > 0 ? el.scrollTop + el.clientHeight < el.scrollHeight - 1 : el.scrollTop > 0) return true
      }
      return false
    }
    const step = (time: number) => {
      const elapsed = last ? Math.min(time - last, 64) : 16.67
      last = time
      current += (target - current) * (1 - Math.pow(0.9, elapsed / 16.67))
      if (Math.abs(target - current) < 0.5) current = target
      window.scrollTo({ top: current, behavior: 'instant' })
      if (current === target) { frame = 0; last = 0 } else frame = requestAnimationFrame(step)
    }
    const onWheel = (event: WheelEvent) => {
      if (event.ctrlKey || event.defaultPrevented || Math.abs(event.deltaX) > Math.abs(event.deltaY) || canScrollInside(event.target, event.deltaY)) return
      event.preventDefault()
      if (!frame) current = target = window.scrollY
      const unit = event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? window.innerHeight : 1
      target = clamp(target + event.deltaY * unit)
      if (!frame) frame = requestAnimationFrame(step)
    }
    const onScroll = () => {
      if (!frame) current = target = window.scrollY
      else if (Math.abs(window.scrollY - current) > 2) stop()
    }

    window.addEventListener('wheel', onWheel, { passive: false })
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('keydown', stop)
    window.addEventListener('pointerdown', stop)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('wheel', onWheel)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('keydown', stop)
      window.removeEventListener('pointerdown', stop)
    }
  }, [])
}

/* A soft follower ring that grows over interactive elements. The native cursor stays visible. */
function useCursorFollower() {
  useEffect(() => {
    if (prefersReducedMotion() || !hasFinePointer()) return

    const ring = document.createElement('div')
    const dot = document.createElement('div')
    ring.className = 'site-cursor'
    dot.className = 'site-cursor site-cursor-dot'
    ring.innerHTML = '<span></span>'
    dot.innerHTML = '<span></span>'
    ring.setAttribute('aria-hidden', 'true')
    dot.setAttribute('aria-hidden', 'true')
    document.body.append(ring, dot)

    let x = -100
    let y = -100
    let ringX = x
    let ringY = y
    let frame = 0

    const render = () => {
      ringX += (x - ringX) * 0.18
      ringY += (y - ringY) * 0.18
      ring.style.transform = `translate3d(${ringX}px,${ringY}px,0)`
      frame = Math.abs(x - ringX) + Math.abs(y - ringY) > 0.1 ? requestAnimationFrame(render) : 0
    }
    const onMove = (event: MouseEvent) => {
      x = event.clientX
      y = event.clientY
      dot.style.transform = `translate3d(${x}px,${y}px,0)`
      const interactive = event.target instanceof Element && event.target.closest('a,button,input,textarea,select,label,[role="button"]')
      ring.classList.toggle('is-hover', Boolean(interactive))
      ring.classList.add('is-visible')
      dot.classList.add('is-visible')
      if (!frame) frame = requestAnimationFrame(render)
    }
    const onOut = (event: MouseEvent) => {
      if (event.relatedTarget) return
      ring.classList.remove('is-visible')
      dot.classList.remove('is-visible')
    }
    const onDown = () => ring.classList.add('is-active')
    const onUp = () => ring.classList.remove('is-active')

    window.addEventListener('mousemove', onMove, { passive: true })
    window.addEventListener('mouseout', onOut)
    window.addEventListener('mousedown', onDown)
    window.addEventListener('mouseup', onUp)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseout', onOut)
      window.removeEventListener('mousedown', onDown)
      window.removeEventListener('mouseup', onUp)
      ring.remove()
      dot.remove()
    }
  }, [])
}

/* Splits a heading's text into word and character spans, keeping inline elements such as <em> and <br>. */
function splitHeading(heading: HTMLElement) {
  const label = Array.from(heading.childNodes).map((node) => (node.nodeName === 'BR' ? ' ' : node.textContent)).join('').replace(/\s+/g, ' ').trim()
  const textNodes: Text[] = []
  const walker = document.createTreeWalker(heading, NodeFilter.SHOW_TEXT)
  while (walker.nextNode()) textNodes.push(walker.currentNode as Text)

  const chars: HTMLElement[] = []
  textNodes.forEach((textNode) => {
    const fragment = document.createDocumentFragment()
    textNode.data.split(/(\s+)/).forEach((part) => {
      if (!part) return
      if (/^\s+$/.test(part)) { fragment.append(document.createTextNode(part)); return }
      const word = document.createElement('span')
      word.className = 'split-word'
      word.setAttribute('aria-hidden', 'true')
      Array.from(part).forEach((character) => {
        const char = document.createElement('span')
        char.className = 'split-char'
        char.textContent = character
        word.append(char)
        chars.push(char)
      })
      fragment.append(word)
    })
    textNode.replaceWith(fragment)
  })

  // Stagger from the centre outwards, like the reference site's SplitText setup.
  const centre = (chars.length - 1) / 2
  chars.forEach((char, index) => char.style.setProperty('--char-delay', `${(Math.abs(index - centre) * 0.03).toFixed(2)}s`))
  heading.setAttribute('aria-label', label)
  heading.dataset.split = 'true'
}

function useSplitHeadings(pathname: string) {
  useEffect(() => {
    if (prefersReducedMotion() || !('IntersectionObserver' in window)) return

    const headings = Array.from(document.querySelectorAll<HTMLElement>('main h1, main h2')).filter((heading) => !heading.closest('.hero, [data-static-headings]'))
    headings.forEach((heading) => { if (!heading.dataset.split) splitHeading(heading) })

    const observer = new IntersectionObserver((entries, currentObserver) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return
        entry.target.classList.add('split-in')
        currentObserver.unobserve(entry.target)
      })
    }, { rootMargin: '0px 0px -15% 0px' })

    headings.forEach((heading) => { if (!heading.classList.contains('split-in')) observer.observe(heading) })
    return () => observer.disconnect()
  }, [pathname])
}

export function SiteMotion() {
  const pathname = usePathname()
  useSmoothScroll()
  useCursorFollower()
  useSplitHeadings(pathname)
  return null
}
