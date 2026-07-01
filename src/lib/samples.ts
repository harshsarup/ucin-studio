/**
 * Sample imagery for the marketing site.
 *
 * PLACEHOLDERS NOW → REAL ASSETS LATER. Swap the URLs here (or drop files into
 * public/samples/ and point to '/samples/...'). See public/samples/README.md —
 * the strongest version is real before/after pairs produced by running photos
 * through the UCIN platform itself.
 */
const ph = (seed: string, w = 900, h = 700) => `https://picsum.photos/seed/${seed}/${w}/${h}`
/** Keyword-relevant placeholder (keyless). lock keeps the same image across loads.
 *  Swap for real UCIN-processed assets / Pexels (once an API key is configured). */
export const lf = (w: number, h: number, keywords: string, lock: number) =>
  `https://loremflickr.com/${w}/${h}/${keywords}?lock=${lock}`

export interface BeforeAfterSample {
  id: string
  label: string
  before: string
  after: string
  caption: string
}

export const BEFORE_AFTER: BeforeAfterSample[] = [
  { id: 'upscale',   label: 'Upscale to 4K',      before: ph('ucin-up-b', 900, 675),  after: ph('ucin-up-a', 1800, 1350), caption: 'Low-res export → print-ready 4K · batch of 5,000' },
  { id: 'remove-bg', label: 'Remove background',  before: ph('ucin-bg-b', 900, 675),  after: ph('ucin-bg-a', 900, 675),   caption: 'Studio cut-outs across a full product catalog' },
  { id: 'style',     label: 'Brand-Style applied',before: ph('ucin-st-b', 900, 675),  after: ph('ucin-st-a', 900, 675),   caption: 'Your signature grade, applied to every frame' },
]

/** Editorial work grid — varied tiles. tall/wide drive the masonry rhythm. */
export interface WorkTile { src: string; span: 'tall' | 'wide' | 'sq'; tag: string; caption: string }

// Pexels imagery (Pexels License — free commercial use, no attribution). Curated
// build-time; replace with real UCIN-processed pairs as they're produced.
const px = 'https://images.pexels.com/photos'
export const pxSrc = (id: string) => `${px}/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940`

export const WORK: WorkTile[] = [
  { src: pxSrc('30237904'), span: 'tall', tag: 'Upscaled',    caption: 'Low-res export → print-ready 4K' },
  { src: pxSrc('37233404'), span: 'wide', tag: 'Generated',   caption: 'On-brand hero, from a prompt' },
  { src: pxSrc('301367'),   span: 'sq',   tag: 'Cut-out',     caption: 'Hair-level cut-out, catalog-wide' },
  { src: pxSrc('6023737'),  span: 'sq',   tag: 'Brand-Style', caption: 'Your signature grade, every frame' },
  { src: pxSrc('3692641'),  span: 'wide', tag: 'Restored',    caption: 'Faded scan → restored & sharp' },
  { src: pxSrc('34921744'), span: 'tall', tag: 'Generated',   caption: 'Fresh visual, generated on-brand' },
  { src: pxSrc('12978310'), span: 'sq',   tag: 'Retouched',   caption: 'Natural skin, texture kept' },
  { src: pxSrc('15984474'), span: 'sq',   tag: 'Brand-Style', caption: 'Consistent look at volume' },
  { src: pxSrc('32315685'), span: 'wide', tag: 'Culled',      caption: '5,000 frames → the keepers' },
  { src: pxSrc('4161710'),  span: 'sq',   tag: 'Cut-out',     caption: 'Shot-ready on pure white' },
  { src: pxSrc('776453'),   span: 'sq',   tag: 'Upscaled',    caption: '2× sharper, faces restored' },
  { src: pxSrc('35719219'), span: 'tall', tag: 'Graded',      caption: 'Warm filmic, your look' },
]

export const GALLERY: string[] = WORK.slice(0, 6).map((w) => w.src)
