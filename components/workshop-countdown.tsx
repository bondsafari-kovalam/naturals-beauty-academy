'use client'

import { useEffect, useState } from 'react'

export function WorkshopCountdown({ startsAt }: { startsAt: string }) {
  // Start empty so the server and browser render the same markup, then tick every second.
  const [remaining, setRemaining] = useState<number | null>(null)
  useEffect(() => {
    const target = new Date(startsAt).getTime()
    const tick = () => setRemaining(Math.max(0, target - Date.now()))
    tick()
    const timer = window.setInterval(tick, 1000)
    return () => window.clearInterval(timer)
  }, [startsAt])

  if (remaining === 0) return <p className="wl-countdown-live">Happening today — see you at the academy!</p>

  const seconds = remaining === null ? null : Math.floor(remaining / 1000)
  const units = [
    ['Days', seconds === null ? null : Math.floor(seconds / 86400)],
    ['Hours', seconds === null ? null : Math.floor(seconds / 3600) % 24],
    ['Mins', seconds === null ? null : Math.floor(seconds / 60) % 60],
    ['Secs', seconds === null ? null : seconds % 60],
  ] as const

  return <div className="wl-countdown" role="timer" aria-label="Time until the workshop starts">{units.map(([label, value]) => <div key={label}><strong>{value === null ? '--' : String(value).padStart(2, '0')}</strong><span>{label}</span></div>)}</div>
}
