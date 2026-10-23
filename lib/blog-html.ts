import sanitizeHtml from 'sanitize-html'

// Allowlist for blog article HTML written in the admin panel. The admin sanitises on save with the
// same rules (naturals-beauty-admin/lib/blog-html.ts); this runs again before rendering so content
// edited directly in the database can never inject scripts, event handlers or foreign iframes.
const YOUTUBE_EMBED = /^https:\/\/(www\.)?youtube(-nocookie)?\.com\/embed\/[\w-]{6,20}(\?[\w=&;-]*)?$/
const ALIGN = { 'text-align': [/^(left|right|center|justify)$/] }

const options: sanitizeHtml.IOptions = {
  allowedTags: ['p', 'br', 'h1', 'h2', 'h3', 'h4', 'strong', 'b', 'em', 'i', 'u', 's', 'a', 'ul', 'ol', 'li', 'blockquote', 'hr', 'figure', 'img', 'figcaption', 'div', 'iframe', 'code', 'pre'],
  allowedAttributes: {
    a: ['href', 'target', 'rel'],
    img: ['src', 'alt', 'width', 'height', 'loading', 'decoding'],
    iframe: ['src', 'width', 'height', 'allowfullscreen', 'allow', 'title', 'loading'],
    div: ['data-youtube-video'],
    p: ['style'], h1: ['style'], h2: ['style'], h3: ['style'], h4: ['style'], li: ['style'],
  },
  allowedStyles: { '*': ALIGN },
  allowedSchemes: ['http', 'https', 'mailto', 'tel'],
  allowedSchemesByTag: { img: ['https'] },
  allowProtocolRelative: false,
  allowedIframeHostnames: ['www.youtube.com', 'youtube.com', 'www.youtube-nocookie.com', 'youtube-nocookie.com'],
  exclusiveFilter: (frame) => frame.tag === 'iframe' && !YOUTUBE_EMBED.test(frame.attribs.src ?? ''),
  transformTags: {
    // The page already has an <h1> (the article title), so headings inside the article start at <h2>.
    h1: 'h2',
    a: (tagName, attribs) => ({ tagName, attribs: attribs.target === '_blank' ? { ...attribs, rel: 'noopener noreferrer' } : attribs }),
    img: (tagName, attribs) => ({ tagName, attribs: { ...attribs, alt: attribs.alt ?? '', loading: 'lazy', decoding: 'async' } }),
    iframe: (tagName, attribs) => ({ tagName, attribs: { ...attribs, title: attribs.title || 'YouTube video', loading: 'lazy' } }),
  },
}

export function sanitizeBlogHtml(html: string) {
  return sanitizeHtml(html, options).trim()
}
