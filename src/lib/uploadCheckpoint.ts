/**
 * uploadCheckpoint — persists a browser upload's progress so a dropped
 * connection (or even a page reload) never loses work. Keyed by a stable
 * signature of the selected files, so re-selecting the same batch resumes:
 * already-uploaded blobs are skipped, and the job's AES key is restored so the
 * earlier ciphertext is still decryptable.
 *
 * Stored in localStorage (small: ~a few hundred bytes/file) and CLEARED on
 * successful submit. The AES key lives here only for the batch's lifetime and
 * never leaves the device.
 */
export interface BlobRecord {
  blobUri: string
  iv: string
  authTag: string
  sha256: string
  cipherBytes: number
}

export interface Checkpoint {
  keyB64?: string
  blobs: Record<string, BlobRecord> // keyed by fileSig
  /** Last touch (ms epoch) — abandoned checkpoints expire so a batch's AES key
   *  never lingers in localStorage past its useful life. */
  touchedAt?: number
}

const NS = 'ucin.upload.'
const MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000 // 7 days

/** Drop abandoned checkpoints (their presigned uploads are long expired anyway). */
export function sweepCheckpoints(): void {
  try {
    const now = Date.now()
    const stale: string[] = []
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i)
      if (!k?.startsWith(NS)) continue
      try {
        const cp = JSON.parse(localStorage.getItem(k) ?? '') as Checkpoint
        if (!cp.touchedAt || now - cp.touchedAt > MAX_AGE_MS) stale.push(k)
      } catch {
        stale.push(k) // unparseable — drop it
      }
    }
    for (const k of stale) localStorage.removeItem(k)
  } catch { /* storage unavailable — nothing to sweep */ }
}

export const fileSig = (f: File): string => `${f.name}:${f.size}:${f.lastModified}`

/** Stable id for a file selection (order-independent). */
export function batchIdFor(files: File[]): string {
  const sig = files.map(fileSig).sort().join('|')
  let h = 5381
  for (let i = 0; i < sig.length; i++) h = ((h << 5) + h + sig.charCodeAt(i)) | 0
  return (h >>> 0).toString(36)
}

export function loadCheckpoint(id: string): Checkpoint {
  try {
    const raw = localStorage.getItem(NS + id)
    if (raw) return JSON.parse(raw) as Checkpoint
  } catch { /* corrupt / unavailable — start fresh */ }
  return { blobs: {} }
}

export function saveCheckpoint(id: string, cp: Checkpoint): void {
  try { localStorage.setItem(NS + id, JSON.stringify({ ...cp, touchedAt: Date.now() })) } catch { /* quota — non-fatal */ }
}

export function clearCheckpoint(id: string): void {
  try { localStorage.removeItem(NS + id) } catch { /* ignore */ }
}
