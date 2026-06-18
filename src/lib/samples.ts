/**
 * Sample imagery for the marketing site.
 *
 * PLACEHOLDERS NOW → REAL ASSETS LATER. Swap the URLs here (or drop files into
 * public/samples/ and point to '/samples/...'). See public/samples/README.md —
 * the strongest version is real before/after pairs produced by running photos
 * through the UCIN platform itself.
 */
const ph = (seed: string, w = 900, h = 700) => `https://picsum.photos/seed/${seed}/${w}/${h}`

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
export interface WorkTile { src: string; span: 'tall' | 'wide' | 'sq'; tag: string }

export const WORK: WorkTile[] = [
  { src: ph('ucin-w1', 800, 1100), span: 'tall', tag: 'Upscaled' },
  { src: ph('ucin-w2', 1100, 800), span: 'wide', tag: 'Generated' },
  { src: ph('ucin-w3', 800, 800),  span: 'sq',   tag: 'Cut-out' },
  { src: ph('ucin-w4', 800, 800),  span: 'sq',   tag: 'Brand-Style' },
  { src: ph('ucin-w5', 1100, 800), span: 'wide', tag: 'Restored' },
  { src: ph('ucin-w6', 800, 1100), span: 'tall', tag: 'Generated' },
  { src: ph('ucin-w7', 800, 800),  span: 'sq',   tag: 'Upscaled' },
  { src: ph('ucin-w8', 800, 800),  span: 'sq',   tag: 'Brand-Style' },
]

export const GALLERY: string[] = WORK.slice(0, 6).map((w) => w.src)
