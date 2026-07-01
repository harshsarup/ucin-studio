/**
 * Browser batch limits + delivery pricing.
 *
 * The cap is now a RELIABILITY boundary (resumable upload makes 5 GB viable),
 * and the per-GB delivery cost is passed through in the quote so browser volume
 * stays cost-neutral — the desktop app (proxy path, ~zero egress) remains the
 * home for anything larger.
 */
export const BROWSER_MAX_FILES = 800
export const BROWSER_MAX_BYTES = 5 * 1024 * 1024 * 1024 // 5 GB total

/** Pass-through delivery rate (₹/GB of upload). Covers S3 Mumbai egress + result
 *  inflation + a sliver of margin. Confirm against the live egress rate. */
export const DELIVERY_INR_PER_GB = 15

export const DESKTOP_INSTALL_CMD = 'npx @ucin-studio/desktop@latest'

export interface BatchCheck {
  ok: boolean
  totalBytes: number
  count: number
  reason: 'files' | 'bytes' | null
}

export function checkBatch(files: File[]): BatchCheck {
  const totalBytes = files.reduce((s, f) => s + f.size, 0)
  const count = files.length
  if (count > BROWSER_MAX_FILES) return { ok: false, totalBytes, count, reason: 'files' }
  if (totalBytes > BROWSER_MAX_BYTES) return { ok: false, totalBytes, count, reason: 'bytes' }
  return { ok: true, totalBytes, count, reason: null }
}

/** Delivery charge for a batch, in whole rupees (rounded up). */
export function deliveryInr(totalBytes: number): number {
  return Math.ceil((totalBytes / (1024 ** 3)) * DELIVERY_INR_PER_GB)
}

export function fmtBytes(n: number): string {
  if (n >= 1024 ** 3) return `${(n / 1024 ** 3).toFixed(1)} GB`
  if (n >= 1024 ** 2) return `${Math.round(n / 1024 ** 2)} MB`
  return `${Math.round(n / 1024)} KB`
}
