/**
 * Browser batch limits.
 *
 * The cap is a RELIABILITY boundary (resumable upload makes 5 GB viable).
 * Delivery egress (≤5 GB in-browser) is absorbed into the per-output task rates
 * rather than billed as a separate line — so the quote stays a single fixed price
 * equal to the bill. The desktop app (proxy path, ~zero egress) is the home for
 * anything larger.
 */
export const BROWSER_MAX_FILES = 800
export const BROWSER_MAX_BYTES = 5 * 1024 * 1024 * 1024 // 5 GB total
/** Per-FILE ceiling. Browser encryption is whole-file in memory (WebCrypto has
 *  no streaming AES-GCM), so one multi-GB file would OOM the tab even when the
 *  batch total is fine — huge single files belong on the desktop's proxy path. */
export const BROWSER_MAX_FILE_BYTES = 1024 * 1024 * 1024 // 1 GB each

export const DESKTOP_INSTALL_CMD = 'npx @ucin-studio/desktop@latest'

export interface BatchCheck {
  ok: boolean
  totalBytes: number
  count: number
  reason: 'files' | 'bytes' | 'file-size' | null
}

export function checkBatch(files: File[]): BatchCheck {
  const totalBytes = files.reduce((s, f) => s + f.size, 0)
  const count = files.length
  if (count > BROWSER_MAX_FILES) return { ok: false, totalBytes, count, reason: 'files' }
  if (totalBytes > BROWSER_MAX_BYTES) return { ok: false, totalBytes, count, reason: 'bytes' }
  if (files.some((f) => f.size > BROWSER_MAX_FILE_BYTES)) return { ok: false, totalBytes, count, reason: 'file-size' }
  return { ok: true, totalBytes, count, reason: null }
}

export function fmtBytes(n: number): string {
  if (n >= 1024 ** 3) return `${(n / 1024 ** 3).toFixed(1)} GB`
  if (n >= 1024 ** 2) return `${Math.round(n / 1024 ** 2)} MB`
  return `${Math.round(n / 1024)} KB`
}
