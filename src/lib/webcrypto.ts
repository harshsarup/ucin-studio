/**
 * Browser Zero-Trust crypto — the WebCrypto twin of the desktop agent's
 * CryptoService + encrypt.worker (AES-256-GCM per blob, RSA-OAEP/SHA-256 key
 * wrap for the enclave). Mirrors the scheme exactly so cipher blobs decrypt on
 * the same backend path:
 *   - AES-256-GCM, 12-byte IV, 128-bit tag. The uploaded blob is CIPHERTEXT ONLY;
 *     the auth tag + IV travel separately in the wrapped-keys envelope (matching
 *     Node's getAuthTag() split).
 *   - sha256 is over the PLAINTEXT (integrity check post-decrypt).
 *
 * Cost note: we mint ONE AES data key per job (not per file) so a single RSA
 * wrap covers the batch — fewer ops, and the per-file envelope stays tiny.
 * Nothing here ever sees the network: keys are generated + used in-page, and
 * only the RSA-wrapped form ever leaves (to the enclave).
 */

const b64 = (buf: ArrayBuffer): string => {
  const bytes = new Uint8Array(buf)
  let s = ''
  for (let i = 0; i < bytes.length; i++) s += String.fromCharCode(bytes[i])
  return btoa(s)
}

const hex = (buf: ArrayBuffer): string =>
  [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, '0')).join('')

/** Mint a fresh AES-256-GCM data key for one job. Extractable so we can RSA-wrap it. */
export function generateJobKey(): Promise<CryptoKey> {
  return crypto.subtle.generateKey({ name: 'AES-GCM', length: 256 }, true, ['encrypt'])
}

/** Export/import the job key so an interrupted upload can resume with the SAME
 *  key (required to reuse already-uploaded cipher blobs). Persisted only for the
 *  batch's lifetime and cleared on completion — it never leaves the device. */
export async function exportKeyB64(key: CryptoKey): Promise<string> {
  return b64(await crypto.subtle.exportKey('raw', key))
}
export function importKeyB64(keyB64: string): Promise<CryptoKey> {
  const raw = Uint8Array.from(atob(keyB64), (c) => c.charCodeAt(0))
  return crypto.subtle.importKey('raw', raw, { name: 'AES-GCM' }, true, ['encrypt'])
}

export interface CipherEnvelope {
  cipher: Blob        // ciphertext only (tag stripped) — this is what gets uploaded
  iv: string          // base64, 12 bytes
  authTag: string     // base64, 16 bytes
  sha256: string      // hex of the plaintext
  cipherBytes: number
}

/** Encrypt one file with the job key. Returns the upload blob + GCM envelope. */
export async function encryptFile(key: CryptoKey, file: Blob): Promise<CipherEnvelope> {
  const plaintext = await file.arrayBuffer()
  const sha = hex(await crypto.subtle.digest('SHA-256', plaintext))
  const iv = crypto.getRandomValues(new Uint8Array(12))
  const sealed = await crypto.subtle.encrypt({ name: 'AES-GCM', iv, tagLength: 128 }, key, plaintext)
  // WebCrypto appends the 16-byte tag; the backend expects it split out (Node getAuthTag()).
  const bytes = new Uint8Array(sealed)
  const cipher = bytes.slice(0, bytes.length - 16)
  const tag = bytes.slice(bytes.length - 16)
  return {
    cipher: new Blob([cipher], { type: 'application/octet-stream' }),
    iv: b64(iv.buffer),
    authTag: b64(tag.buffer),
    sha256: sha,
    cipherBytes: cipher.length,
  }
}

/** PEM (SPKI) → DER bytes for importKey. */
function pemToDer(pem: string): ArrayBuffer {
  const body = pem.replace(/-----(BEGIN|END) PUBLIC KEY-----/g, '').replace(/\s+/g, '')
  const raw = atob(body)
  const der = new Uint8Array(raw.length)
  for (let i = 0; i < raw.length; i++) der[i] = raw.charCodeAt(i)
  return der.buffer
}

/**
 * RSA-OAEP(SHA-256) wrap the AES job key with the enclave's public key so only
 * the GPU enclave can unwrap it in VRAM. Matches CryptoService.wrapKeyForEnclave.
 */
export async function wrapKeyForEnclave(key: CryptoKey, enclavePublicKeyPem: string): Promise<string> {
  const pub = await crypto.subtle.importKey(
    'spki', pemToDer(enclavePublicKeyPem),
    { name: 'RSA-OAEP', hash: 'SHA-256' }, false, ['encrypt'],
  )
  const raw = await crypto.subtle.exportKey('raw', key)
  return b64(await crypto.subtle.encrypt({ name: 'RSA-OAEP' }, pub, raw))
}
