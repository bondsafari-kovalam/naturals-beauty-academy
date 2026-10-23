'use client'

import { useState, type FormEvent } from 'react'
import { ArrowRight } from 'lucide-react'
import { whatsappUrl } from '../lib/site-config'

type Status = { tone: 'success' | 'warning' | 'error'; text: string } | null

// Enquiry form: saves the enquiry for the admin panel (public.enquiries via /api/contact)
// and opens WhatsApp with the same details.
export function ContactForm({ courses, defaultCourse = '' }: { courses: string[]; defaultCourse?: string }) {
  const [status, setStatus] = useState<Status>(null)
  const [sending, setSending] = useState(false)

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

    // Open the WhatsApp tab now, while the click still counts as a user action (pop-up blockers),
    // then point it at WhatsApp once the enquiry has been saved.
    const chatWindow = window.open('', '_blank')
    if (chatWindow) chatWindow.opener = null
    setSending(true)
    setStatus(null)

    let saved = false
    try {
      const controller = new AbortController()
      const timeout = window.setTimeout(() => controller.abort(), 10000)
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...Object.fromEntries(data), source: 'website-enquiry-form' }),
        signal: controller.signal,
      })
      window.clearTimeout(timeout)
      saved = response.ok
    } catch {
      saved = false
    }

    const text = [
      'Enquiry — Naturals Beauty Academy',
      `Name: ${data.get('name')}`,
      `Phone: ${data.get('phone')}`,
      `Email: ${data.get('email')}`,
      `Course of interest: ${course || 'Not sure yet'}`,
      ...(message ? ['', 'Message:', message] : []),
    ].join('\n')
    const chatUrl = whatsappUrl(text)
    if (chatWindow && !chatWindow.closed) chatWindow.location.href = chatUrl
    else window.location.href = chatUrl

    setSending(false)
    if (saved) {
      form.reset()
      setStatus({ tone: 'success', text: 'Thank you! Your enquiry has been received. WhatsApp has opened with your details. Tap Send there if you’d like to chat now.' })
    } else {
      setStatus({ tone: 'warning', text: 'WhatsApp has opened with your details. Please tap Send there so our team receives your enquiry.' })
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
      <label>Course of interest
        <select name="course" defaultValue={courses.includes(defaultCourse) ? defaultCourse : ''}>
          <option value="">Not sure yet</option>
          {courses.map((course) => <option key={course} value={course}>{course}</option>)}
        </select>
      </label>
    </div>
    <label>Your message <span>(optional if you choose a course)</span><textarea name="message" rows={5} placeholder="Tell us what you would like to know..." maxLength={4500} /></label>
    <div className="contact-form-submit">
      <button type="submit" className="button button-dark" disabled={sending}>{sending ? 'Sending…' : <>Send enquiry <ArrowRight /></>}</button>
      {status && <p role={status.tone === 'error' ? 'alert' : 'status'} aria-live="polite" className={`contact-form-status contact-form-status--${status.tone}`}>{status.text}</p>}
    </div>
  </form>
}
