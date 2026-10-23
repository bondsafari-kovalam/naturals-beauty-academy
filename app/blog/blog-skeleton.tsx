// Placeholder cards shown while blog posts load (same layout as the real grid, so nothing jumps).
export function BlogGridSkeleton() {
  return <div className="blog-skeleton" aria-busy="true" aria-label="Loading articles">
    <div className="blog-skeleton-featured"><span /><div><i /><i /><i /></div></div>
    <div className="blog-grid">{Array.from({ length: 6 }, (_, i) => <div className="blog-card" key={i}><span className="blog-skeleton-image" /><div className="blog-card-body"><i /><i /><i /></div></div>)}</div>
  </div>
}
