// Shown while workshop pages load.
export default function WorkshopsLoading() {
  return <main className="workshops-page" aria-busy="true" aria-label="Loading workshops">
    <section className="ws-list"><div className="faculty-shell">
      <div className="ws-skeleton-title" />
      <ul className="ws-grid">{Array.from({ length: 3 }, (_, i) => <li key={i} className="ws-card ws-card--skeleton"><span className="ws-card-image" /><div className="ws-card-body"><i /><i /><i /></div></li>)}</ul>
    </div></section>
  </main>
}
