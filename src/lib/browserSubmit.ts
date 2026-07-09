/**
 * browserSubmit — the browser's zero-trust submission pipeline, the small-batch
 * twin of the desktop PipelineService:
 *
 *   encrypt (WebCrypto) → presign + PUT ciphertext to S3 → estimate → scan →
 *   audit → deploy(audit_token, INPUT_MANIFEST) → wrap+submit keys → poll → results
 *
 * Cost-conscious by construction: one AES key per job, ciphertext-only uploads,
 * and this path is only ever reached for small batches (see lib/batch.ts) — big
 * jobs are routed to the desktop app before we get here.
 */
import { generateJobKey, encryptFile, wrapKeyForEnclave, exportKeyB64, importKeyB64 } from './webcrypto'
import {
  batchIdFor, fileSig, loadCheckpoint, saveCheckpoint, clearCheckpoint, sweepCheckpoints,
  type BlobRecord,
} from './uploadCheckpoint'
import {
  presignUpload, putToStorage, estimateJob, scanJob, auditJob, deployJob,
  enclaveKey, submitWrappedKeys, getJob, jobResults,
  type Tier, type WrappedKeyItem, type ResultArtifact,
} from '@/api/pipeline'

/** Retry a network op with exponential backoff — rides out connection blips so a
 *  drop mid-batch doesn't lose progress. Throws only after the outage persists. */
async function withRetry<T>(fn: () => Promise<T>, attempts = 6): Promise<T> {
  let delay = 800
  for (let i = 0; i < attempts; i++) {
    try { return await fn() } catch (e) {
      if (i === attempts - 1) throw e
      await new Promise((r) => setTimeout(r, delay))
      delay = Math.min(delay * 2, 15_000)
    }
  }
  throw new Error('unreachable')
}

/**
 * The backend forces `docker_image = STUDIO_WORKER_IMAGE` at deploy for any
 * action in STUDIO_WORKER_ACTIONS (customer_api.py) and injects UCIN_ACTION etc.
 * We send the same image so the pre-deploy security scan runs against the real
 * managed image. Keep in sync with `UCIN_STUDIO_WORKER_IMAGE` on the backend.
 */
const STUDIO_WORKER_IMAGE = 'ucin/studio-worker:latest'

/** The only actions the studio worker handles → the only ones eligible for
 *  in-browser submit (matches STUDIO_WORKER_ACTIONS in ucin_network_factory). */
export const BROWSER_ACTIONS = new Set(['cull', 'grade', 'upscale', 'enhance', 'remove-bg', 'retouch'])

export type SubmitPhase =
  | 'encrypting' | 'uploading' | 'estimating' | 'auditing'
  | 'deploying' | 'sealing' | 'running' | 'done' | 'error'

export interface SubmitProgress {
  phase: SubmitPhase
  done: number
  total: number
  message?: string
}

export interface SubmitConfig {
  files: File[]
  actionId: string      // backend action_id (from the catalog TaskDef.actionId)
  tier: Tier
  itemCount: number
  /** Style/model id ('' = auto per step) — mirrors the desktop's UCIN_MODEL. */
  modelId?: string
  // SLA add-ons. They are PRICED into the client quote, so every one the user
  // toggles MUST reach the backend (which bills them) or quote != bill.
  privacy?: boolean     // isolated processing (+ one-time setup fee, single batch)
  guarantee?: boolean   // deadline guarantee
  whitelabel?: boolean  // white-label delivery
}

export interface SubmitResult {
  jobId: string
  status: string
  artifacts: ResultArtifact[]
}

const POLL_MS = 5000
const TERMINAL = new Set(['completed', 'complete', 'succeeded', 'done', 'failed', 'error', 'cancelled', 'canceled'])

/** Run the full pipeline. Streams progress via onProgress; resolves on terminal state. */
export async function submitBrowserJob(cfg: SubmitConfig, onProgress: (p: SubmitProgress) => void): Promise<SubmitResult> {
  const emit = (phase: SubmitPhase, done: number, total: number, message?: string) =>
    onProgress({ phase, done, total, message })

  const baseReq = {
    docker_image: STUDIO_WORKER_IMAGE,
    tier: cfg.tier,
    run_command: '',
    action_id: cfg.actionId,
    item_count: cfg.itemCount,
    security_mode: 'standard',
  }

  // 1. Resume-aware setup: reuse the checkpoint's key (so earlier ciphertext is
  //    still decryptable) or mint a new one and persist it for the batch.
  sweepCheckpoints() // expire abandoned batches (and their keys) first
  const batchId = batchIdFor(cfg.files)
  const cp = loadCheckpoint(batchId)
  let jobKey
  if (cp.keyB64) {
    jobKey = await importKeyB64(cp.keyB64)
  } else {
    jobKey = await generateJobKey()
    cp.keyB64 = await exportKeyB64(jobKey)
    saveCheckpoint(batchId, cp)
  }

  // 2. Encrypt + upload each file (ciphertext only), checkpointing after each so
  //    a dropped connection resumes exactly where it left off — completed blobs
  //    are never re-encrypted or re-uploaded.
  const total = cfg.files.length
  let done = Object.keys(cp.blobs).length
  emit('uploading', done, total)
  for (const file of cfg.files) {
    const sig = fileSig(file)
    if (cp.blobs[sig]) continue // already uploaded in a prior attempt
    emit('encrypting', done, total, file.name)
    const env = await encryptFile(jobKey, file)
    emit('uploading', done, total, file.name)
    const grant = await withRetry(() => presignUpload(file.name, env.cipherBytes))
    await withRetry(() => putToStorage(grant, env.cipher))
    cp.blobs[sig] = { blobUri: grant.blob_uri, iv: env.iv, authTag: env.authTag, sha256: env.sha256, cipherBytes: env.cipherBytes }
    saveCheckpoint(batchId, cp) // durable after every file
    done++
    emit('uploading', done, total, file.name)
  }

  // Assemble the full manifest from the checkpoint, in file order.
  const envelopes: { rec: BlobRecord }[] = cfg.files.map((f) => ({ rec: cp.blobs[fileSig(f)] }))

  // 3. Quote → security gate → audit token.
  emit('estimating', 0, 1)
  await estimateJob(baseReq)
  const scan = await scanJob(baseReq)
  if (scan.status === 'Failed') throw new Error(`Security scan failed: ${scan.remediations.map((r) => r.finding).join('; ') || 'rejected'}`)
  emit('auditing', 0, 1)
  const audit = await auditJob(baseReq)
  if (audit.overall === 'fail') {
    const failed = audit.checks.filter((c) => c.status === 'fail').map((c) => `${c.name}: ${c.detail}`)
    throw new Error(`Pre-acceptance audit failed — ${failed.join('; ') || audit.message}`)
  }
  if (!audit.audit_token) throw new Error('Audit passed but no token was issued; cannot deploy.')

  // 4. Deploy — hand the encrypted-input manifest to the runner, plus the full
  //    contract the quote was priced on: style model, item limit, and EVERY SLA
  //    add-on (they're in the client quote, so the backend must see them to
  //    bill/honor them). A browser job is always a single, first batch, so the
  //    one-time private setup fee rides along when privacy is on.
  emit('deploying', 0, 1)
  const manifest = envelopes.map((e) => e.rec.blobUri)
  const limit = Math.min(cfg.itemCount || cfg.files.length, cfg.files.length)
  const deploy = await deployJob({
    ...baseReq,
    audit_token: audit.audit_token,
    env_vars: {
      UCIN_INPUT_MANIFEST: JSON.stringify(manifest),
      UCIN_MODEL: cfg.modelId ?? '',
      UCIN_LIMIT: String(limit),
      // 'hero' = top-N by quality when the step covers only part of the upload.
      UCIN_SELECT: limit < cfg.files.length ? 'hero' : 'all',
      UCIN_PRIVATE: String(!!cfg.privacy),
      UCIN_PRIVATE_SETUP: String(!!cfg.privacy),
      UCIN_GUARANTEE: String(!!cfg.guarantee),
      UCIN_WHITELABEL: String(!!cfg.whitelabel),
    },
  })
  // Job is now server-side — the upload can no longer be lost, so drop the checkpoint.
  clearCheckpoint(batchId)

  // 5. Seal: wrap the job key for the enclave + submit per-blob envelopes.
  //    Best-effort — enclave infra is a placeholder today, so a seal failure
  //    must not fail an otherwise-deployed job (mirrors the desktop).
  emit('sealing', 0, 1)
  try {
    const grant = await enclaveKey(deploy.job_id)
    const wrapped = await wrapKeyForEnclave(jobKey, grant.enclave_public_key_pem)
    const keys: WrappedKeyItem[] = envelopes.map((e, i) => ({
      key_ref: `job-${deploy.job_id}-${i}`,
      wrapped_key_b64: wrapped,
      iv: e.rec.iv,
      auth_tag: e.rec.authTag,
      blob_uri: e.rec.blobUri,
      sha256: e.rec.sha256,
    }))
    await submitWrappedKeys(deploy.job_id, keys)
  } catch {
    /* placeholder enclave — deferred, non-fatal */
  }

  // 6. Poll to terminal, then pull the result manifest. Consecutive failures are
  //    bounded: past the cutoff (expired session, network gone) we stop polling
  //    and hand back the job id — the job continues server-side either way, and
  //    the UI must NOT offer a re-submit (that would deploy, and bill, again).
  emit('running', 0, 1, deploy.job_id)
  let status = deploy.status
  let pollFailures = 0
  const MAX_POLL_FAILURES = 24 // ≈2 min of solid failures at POLL_MS
  for (;;) {
    await new Promise((r) => setTimeout(r, POLL_MS))
    try {
      const job = await getJob(deploy.job_id)
      pollFailures = 0
      status = job.status
      emit('running', 0, 1, job.message ?? status)
    } catch {
      pollFailures++
      if (pollFailures >= MAX_POLL_FAILURES) {
        emit('done', total, total, 'lost contact — the job continues on the network')
        return { jobId: deploy.job_id, status: 'running', artifacts: [] }
      }
    }
    if (TERMINAL.has(status.toLowerCase())) break
  }

  let artifacts: ResultArtifact[] = []
  try {
    artifacts = (await jobResults(deploy.job_id)).artifacts
  } catch { /* results may lag terminal state */ }

  emit('done', total, total)
  return { jobId: deploy.job_id, status, artifacts }
}
