/**
 * Sample imagery for the marketing site.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * PLACEHOLDERS NOW → REAL ASSETS LATER. This is the ONE place to swap them.
 *
 * To use real images, drop files into  ucin_studio/public/samples/  and change
 * the URLs below to e.g.  '/samples/upscale-before.jpg'.
 * See public/samples/README.md for the exact filenames + how to generate the
 * "after" images by running the "before" images through the UCIN platform.
 * ─────────────────────────────────────────────────────────────────────────────
 */

// Deterministic placeholder photos (look real, good for feel). Swap to /samples/*.
const ph = (seed: string, w = 800, h = 600) =>
  `https://picsum.photos/seed/${seed}/${w}/${h}`

export interface BeforeAfterSample {
  id: string
  label: string
  before: string
  after: string
  caption: string
}

export const BEFORE_AFTER: BeforeAfterSample[] = [
  {
    id: 'upscale',
    label: 'Upscale to 4K',
    before: ph('ucin-upscale-b', 800, 600),
    after: ph('ucin-upscale-a', 1600, 1200),
    caption: 'Low-res export → crisp 4K, batch of 5,000',
  },
  {
    id: 'remove-bg',
    label: 'Remove background',
    before: ph('ucin-rembg-b', 800, 600),
    after: ph('ucin-rembg-a', 800, 600),
    caption: 'Studio cut-outs for an entire product catalog',
  },
  {
    id: 'style',
    label: 'Brand-Style applied',
    before: ph('ucin-style-b', 800, 600),
    after: ph('ucin-style-a', 800, 600),
    caption: 'Your signature grade, applied to every frame',
  },
]

// Generated-visuals gallery (Brand-Style / text-to-image showcase)
export const GALLERY: string[] = [
  ph('ucin-gen-1', 500, 500),
  ph('ucin-gen-2', 500, 500),
  ph('ucin-gen-3', 500, 500),
  ph('ucin-gen-4', 500, 500),
  ph('ucin-gen-5', 500, 500),
  ph('ucin-gen-6', 500, 500),
]
