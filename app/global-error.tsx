'use client' // Error boundaries must be Client Components

// Last resort: replaces the root layout when the layout itself fails, so it brings its own <html>, <body> and
// styles and depends on nothing else in the app.
export default function GlobalError({ retry }: { error: unknown; retry: () => void }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, minHeight: '100vh', display: 'grid', placeItems: 'center', padding: '24px', background: '#F4EDF8', color: '#29242D', fontFamily: 'Georgia, serif' }}>
        <title>Something went wrong | Naturals Beauty Academy</title>
        <main style={{ maxWidth: 520, textAlign: 'center' }}>
          <p style={{ font: '700 11px/1.4 Arial, sans-serif', letterSpacing: '.18em', textTransform: 'uppercase', color: '#70358F' }}>Naturals Beauty Academy · Alappuzha</p>
          <h1 style={{ fontSize: 36, fontWeight: 400, margin: '12px 0' }}>We couldn&rsquo;t load the website.</h1>
          <p style={{ font: '16px/1.6 Arial, sans-serif', color: '#5f5664' }}>Please try again in a moment, or call us on <a href="tel:+918929660506" style={{ color: '#70358F' }}>+91 89296 60506</a>.</p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap', marginTop: 24 }}>
            <button type="button" onClick={() => retry()} style={{ minHeight: 48, padding: '14px 22px', border: 0, borderRadius: 6, background: '#4D1F68', color: '#fff', font: '700 12px Arial, sans-serif', letterSpacing: '.09em', textTransform: 'uppercase', cursor: 'pointer' }}>Try again</button>
            <a href="https://wa.me/918929660506" style={{ minHeight: 48, boxSizing: 'border-box', display: 'inline-flex', alignItems: 'center', padding: '14px 22px', borderRadius: 6, border: '1px solid #4D1F68', color: '#4D1F68', font: '700 12px Arial, sans-serif', letterSpacing: '.09em', textTransform: 'uppercase', textDecoration: 'none' }}>WhatsApp us</a>
          </div>
        </main>
      </body>
    </html>
  )
}
