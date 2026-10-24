'use client'

import { useEffect, useId, useRef, useState, type FormEvent, type KeyboardEvent } from 'react'
import { ArrowRight, Check, ChevronDown } from 'lucide-react'
import { TurnstileField, resetTurnstile } from './turnstile-field'

type Status = { tone: 'success' | 'error'; text: string } | null

// A styled stand-in for <select> (the browser's own option list cannot be styled). The value is
// posted through a hidden input, and it goes back to the default when the form is reset.
function CourseSelect({ courses, defaultValue }: { courses: string[]; defaultValue: string }) {
  const id = useId()
  const rootRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const listRef = useRef<HTMLUListElement>(null)
  const [value, setValue] = useState(defaultValue)
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(0)
  const options = ['', ...courses]
  const labelOf = (option: string) => option || 'Not sure yet'

  useEffect(() => {
    const form = rootRef.current?.closest('form')
    const reset = () => setValue(defaultValue)
    form?.addEventListener('reset', reset)
    return () => form?.removeEventListener('reset', reset)
  }, [defaultValue])

  useEffect(() => {
    if (!open) return
    const closeOutside = (event: MouseEvent) => { if (!rootRef.current?.contains(event.target as Node)) setOpen(false) }
    document.addEventListener('mousedown', closeOutside)
    return () => document.removeEventListener('mousedown', closeOutside)
  }, [open])

  useEffect(() => {
    if (open) listRef.current?.children[active]?.scrollIntoView({ block: 'nearest' })
  }, [open, active])

  const openList = () => { setActive(Math.max(0, options.indexOf(value))); setOpen(true) }
  const choose = (index: number) => { setValue(options[index]); setOpen(false); buttonRef.current?.focus() }

  function handleKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    if (!open) {
      if (['ArrowDown', 'ArrowUp', 'Enter', ' '].includes(event.key)) { event.preventDefault(); openList() }
      return
    }
    const last = options.length - 1
    if (event.key === 'ArrowDown') setActive((i) => Math.min(i + 1, last))
    else if (event.key === 'ArrowUp') setActive((i) => Math.max(i - 1, 0))
    else if (event.key === 'Home') setActive(0)
    else if (event.key === 'End') setActive(last)
    else if (event.key === 'Enter' || event.key === ' ') choose(active)
    else if (event.key === 'Escape') setOpen(false)
    else if (event.key === 'Tab') { setOpen(false); return }
    else if (event.key.length === 1) {
      // Type a letter to jump to the next course starting with it.
      const key = event.key.toLowerCase()
      const order = [...options.keys()].map((n) => (active + 1 + n) % options.length)
      const match = order.find((n) => labelOf(options[n]).toLowerCase().startsWith(key))
      if (match !== undefined) setActive(match)
    } else return
    event.preventDefault()
  }

  return <div className="contact-select" ref={rootRef}>
    <span id={`${id}-label`}>Course of interest</span>
    <input type="hidden" name="course" value={value} />
    <button ref={buttonRef} type="button" role="combobox" className="contact-select-trigger" aria-labelledby={`${id}-label`} aria-haspopup="listbox" aria-expanded={open} aria-controls={`${id}-list`} aria-activedescendant={open ? `${id}-${active}` : undefined} data-empty={!value || undefined} onClick={() => (open ? setOpen(false) : openList())} onKeyDown={handleKeyDown} onBlur={(event) => { if (!rootRef.current?.contains(event.relatedTarget as Node | null)) setOpen(false) }}>
      <span>{labelOf(value)}</span><ChevronDown aria-hidden="true" />
    </button>
    {open && <ul ref={listRef} id={`${id}-list`} role="listbox" aria-labelledby={`${id}-label`} className="contact-select-list">
      {options.map((option, i) => <li key={option || 'none'} id={`${id}-${i}`} role="option" aria-selected={option === value} data-active={i === active || undefined} data-empty={!option || undefined} onMouseEnter={() => setActive(i)} onMouseDown={(event) => event.preventDefault()} onClick={() => choose(i)}>
        <span>{labelOf(option)}</span>{option === value && <Check aria-hidden="true" />}
      </li>)}
    </ul>}
  </div>
}

// Enquiry form: /api/contact saves the enquiry for the admin panel's Enquiries page (public.enquiries).
export function ContactForm({ courses, courseSlugs = {} }: { courses: string[]; courseSlugs?: Record<string, string> }) {
  const [status, setStatus] = useState<Status>(null)
  const [sending, setSending] = useState(false)
  // ?course=<slug> (the "Enquire about this course" link) pre-selects that course. Read here in the browser
  // so the contact page can stay pre-built instead of rendering on every visit.
  const [defaultCourse, setDefaultCourse] = useState('')
  useEffect(() => {
    const slug = new URLSearchParams(window.location.search).get('course')
    if (slug && courseSlugs[slug]) setDefaultCourse(courseSlugs[slug])
  }, [courseSlugs])

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (sending) return
    const form = event.currentTarget
    const data = new FormData(form)
    const course = String(data.get('course') ?? '')
    const message = String(data.get('message') ?? '').trim()
    if (!course && !message) {
      setStatus({ tone: 'error', text: 'Please choose a course or write a short message.' })
      return
    }

    setSending(true)
    setStatus(null)

    try {
      const controller = new AbortController()
      const timeout = window.setTimeout(() => controller.abort(), 15000)
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...Object.fromEntries(data), source: 'website-enquiry-form' }),
        signal: controller.signal,
      })
      window.clearTimeout(timeout)
      if (response.ok) {
        form.reset()
        setStatus({ tone: 'success', text: 'Thank you! Your enquiry has been sent. Our team will get back to you soon.' })
      } else {
        const result = await response.json().catch(() => null) as { error?: string } | null
        setStatus({ tone: 'error', text: result?.error ?? 'We could not send your enquiry right now. Please try again in a moment.' })
        resetTurnstile()
      }
    } catch {
      setStatus({ tone: 'error', text: 'We could not send your enquiry. Please check your connection and try again.' })
      resetTurnstile()
    } finally {
      setSending(false)
    }
  }

  return <form className="contact-form" onSubmit={handleSubmit}>
    <div className="contact-form-fields">
      <label>Your name<input name="name" autoComplete="name" placeholder="Enter your name" required maxLength={120} /></label>
      <label>Phone / WhatsApp<input name="phone" type="tel" autoComplete="tel" placeholder="Your contact number" required maxLength={40} pattern="[0-9+()\-\s]{7,}" title="Enter a valid phone number" /></label>
    </div>
    <input name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" className="contact-honeypot" />
    <div className="contact-form-fields">
      <label>Email address<input name="email" type="email" autoComplete="email" placeholder="you@example.com" required maxLength={254} /></label>
      <CourseSelect key={defaultCourse} courses={courses} defaultValue={courses.includes(defaultCourse) ? defaultCourse : ''} />
    </div>
    <label>Your message <span>(optional if you choose a course)</span><textarea name="message" rows={5} placeholder="Tell us what you would like to know..." maxLength={4500} /></label>
    <TurnstileField />
    <div className="contact-form-submit">
      <button type="submit" className="button button-dark" disabled={sending}>{sending ? 'Sending…' : <>Send enquiry <ArrowRight /></>}</button>
      {status && <p role={status.tone === 'error' ? 'alert' : 'status'} aria-live="polite" className={`contact-form-status contact-form-status--${status.tone}`}>{status.text}</p>}
    </div>
  </form>
}
