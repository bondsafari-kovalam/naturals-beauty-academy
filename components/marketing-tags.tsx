import Script from 'next/script'

// Meta Pixel and Google Analytics 4, loaded only when their IDs are configured:
//   NEXT_PUBLIC_META_PIXEL_ID, NEXT_PUBLIC_GA4_MEASUREMENT_ID
// IDs are validated so a malformed value can never inject script.
export function MarketingTags() {
  const pixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID?.trim()
  const gaId = process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID?.trim()
  const pixel = pixelId && /^\d{6,20}$/.test(pixelId) ? pixelId : null
  const ga = gaId && /^G-[A-Z0-9]{4,15}$/.test(gaId) ? gaId : null

  return <>
    {pixel && <Script id="meta-pixel" strategy="afterInteractive">{`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${pixel}');fbq('track','PageView');`}</Script>}
    {ga && <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${ga}`} strategy="afterInteractive" />
      <Script id="ga4" strategy="afterInteractive">{`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}window.gtag=gtag;gtag('js',new Date());gtag('config','${ga}');`}</Script>
    </>}
  </>
}
