/**
 * Browser watermarking — the Canvas twin of the desktop GalleryService stamp.
 *
 * Mirror of ucin_creator_studio/src/shared/types/agent.ts (WatermarkSpec /
 * DEFAULT_WATERMARK): keep the two in sync so a studio's mark composes
 * identically whether results are stamped at desktop delivery or in-browser.
 *
 * The invariant that makes one spec work on every image: all units are relative
 * to the image's SHORT edge — size, and inset. Portrait, landscape, full-res or
 * web-res, the composition is the same. Everything runs in-page: the logo is a
 * data URL in localStorage and never leaves the browser.
 */

export type WatermarkAnchor =
  | 'top-left' | 'top-center' | 'top-right'
  | 'center-left' | 'center' | 'center-right'
  | 'bottom-left' | 'bottom-center' | 'bottom-right'

export interface WatermarkSpec {
  anchor: WatermarkAnchor
  /** Logo width as a fraction of the image's SHORT edge (0.03–0.6). */
  sizePct: number
  /** Logo opacity (0.05–1). */
  opacity: number
  /** Inset from the anchored edge(s), as a fraction of the short edge (0–0.2). */
  marginPct: number
}

export const DEFAULT_WATERMARK: WatermarkSpec = {
  anchor: 'bottom-right',
  sizePct: 0.18,
  opacity: 0.55,
  marginPct: 0.02,
}

export const ANCHORS: WatermarkAnchor[] = [
  'top-left', 'top-center', 'top-right',
  'center-left', 'center', 'center-right',
  'bottom-left', 'bottom-center', 'bottom-right',
]

const clampN = (n: number, lo: number, hi: number, fallback: number): number =>
  Number.isFinite(n) ? Math.min(hi, Math.max(lo, n)) : fallback

// ── The studio's web brand (logo + spec), persisted in this browser ───────────

const BRAND_KEY = 'ucin.web.brand'

export interface WebBrand {
  /** The logo as a data URL — small, alpha-preserving, never leaves the browser. */
  logoDataUrl: string | null
  stamp: WatermarkSpec
}

export function loadWebBrand(): WebBrand {
  try {
    const raw = JSON.parse(localStorage.getItem(BRAND_KEY) ?? '') as Partial<WebBrand> & { stamp?: Partial<WatermarkSpec> }
    const s: Partial<WatermarkSpec> = raw.stamp ?? {}
    return {
      logoDataUrl: typeof raw.logoDataUrl === 'string' ? raw.logoDataUrl : null,
      stamp: {
        anchor: (ANCHORS as string[]).includes(s.anchor ?? '') ? (s.anchor as WatermarkAnchor) : DEFAULT_WATERMARK.anchor,
        sizePct: clampN(s.sizePct as number, 0.03, 0.6, DEFAULT_WATERMARK.sizePct),
        opacity: clampN(s.opacity as number, 0.05, 1, DEFAULT_WATERMARK.opacity),
        marginPct: clampN(s.marginPct as number, 0, 0.2, DEFAULT_WATERMARK.marginPct),
      },
    }
  } catch {
    return { logoDataUrl: null, stamp: DEFAULT_WATERMARK }
  }
}

export function saveWebBrand(brand: WebBrand): void {
  try { localStorage.setItem(BRAND_KEY, JSON.stringify(brand)) } catch { /* quota — non-fatal */ }
}

/** Read a picked logo file into a data URL (≤5 MB, image types only). */
export function logoFileToDataUrl(file: File): Promise<string> {
  if (!/^image\/(png|jpeg|webp)$/.test(file.type)) return Promise.reject(new Error('Use a PNG, JPEG, or WebP logo.'))
  if (file.size > 5 * 1024 * 1024) return Promise.reject(new Error('Logo too large — keep it under 5 MB.'))
  return new Promise((resolve, reject) => {
    const r = new FileReader()
    r.onload = () => resolve(r.result as string)
    r.onerror = () => reject(new Error('Could not read the logo file.'))
    r.readAsDataURL(file)
  })
}

// ── Stamping ──────────────────────────────────────────────────────────────────

/** Anchor → top-left corner of a `lw`×`lh` logo on a `W`×`H` image. */
function anchorXY(anchor: WatermarkAnchor, W: number, H: number, lw: number, lh: number, m: number): { x: number; y: number } {
  const x = anchor.endsWith('left') ? m : anchor.endsWith('right') ? W - lw - m : (W - lw) / 2
  const y = anchor.startsWith('top') ? m : anchor.startsWith('bottom') ? H - lh - m : (H - lh) / 2
  return { x, y }
}

/**
 * Stamp the logo onto one image blob, per the spec, and return the stamped blob.
 * PNG sources stay PNG (cut-outs keep their transparency); everything else
 * exports as high-quality JPEG.
 */
export async function stampImageBlob(source: Blob, logoDataUrl: string, spec: WatermarkSpec): Promise<Blob> {
  const [img, logo] = await Promise.all([
    createImageBitmap(source),
    fetch(logoDataUrl).then((r) => r.blob()).then((b) => createImageBitmap(b)),
  ])
  try {
    const canvas = document.createElement('canvas')
    canvas.width = img.width
    canvas.height = img.height
    const ctx = canvas.getContext('2d')
    if (!ctx) throw new Error('Canvas unavailable in this browser.')
    ctx.drawImage(img, 0, 0)

    const short = Math.min(img.width, img.height)
    const lw = short * clampN(spec.sizePct, 0.03, 0.6, DEFAULT_WATERMARK.sizePct)
    const lh = lw * (logo.height / logo.width)
    const m = short * clampN(spec.marginPct, 0, 0.2, DEFAULT_WATERMARK.marginPct)
    const { x, y } = anchorXY(spec.anchor, img.width, img.height, lw, lh, m)
    ctx.globalAlpha = clampN(spec.opacity, 0.05, 1, DEFAULT_WATERMARK.opacity)
    ctx.drawImage(logo, x, y, lw, lh)

    const keepAlpha = source.type === 'image/png' || source.type === 'image/webp'
    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, keepAlpha ? 'image/png' : 'image/jpeg', 0.92),
    )
    if (!blob) throw new Error('Could not encode the stamped image.')
    return blob
  } finally {
    img.close()
    logo.close()
  }
}

/**
 * Fetch a result artifact and return it stamped. Presigned result URLs must be
 * CORS-readable from this origin — when they aren't, we throw a message that
 * says so rather than producing a silently-tainted canvas.
 */
export async function stampFromUrl(url: string, logoDataUrl: string, spec: WatermarkSpec): Promise<Blob> {
  let res: Response
  try {
    res = await fetch(url)
  } catch {
    throw new Error('Could not fetch this result for stamping (storage CORS) — download it normally, or stamp at delivery in the desktop app.')
  }
  if (!res.ok) throw new Error(`Could not fetch this result for stamping (${res.status}).`)
  return stampImageBlob(await res.blob(), logoDataUrl, spec)
}

/** Trigger a browser download of a blob. */
export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  setTimeout(() => URL.revokeObjectURL(url), 10_000)
}
