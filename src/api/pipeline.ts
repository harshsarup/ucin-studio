/**
 * Browser pipeline API — the subset of the V5 Control-Plane customer API needed
 * to submit a job from the browser. Mirrors ucin_creator_studio's
 * OrchestrationClient, but uses the shared axios `api` (which attaches the JWT),
 * so user_id is always derived server-side from the token.
 *
 * Flow: presign → (client encrypts + uploads) → estimate → scan → audit →
 *       deploy(audit_token) → wrapped-keys → poll getJob → jobResults.
 */
import { api } from './config'

export type Tier = 'priority' | 'core' | 'flex'

export interface PresignedUpload {
  blob_uri: string
  upload_url: string
  headers: Record<string, string>
  expires_at: string
}

export interface EstimateRequest {
  docker_image: string
  tier: Tier
  run_command?: string
  action_id?: string | null
  item_count?: number | null
  security_mode?: string
  state_lock?: string | null
}

export interface AuditReport {
  overall: 'pass' | 'fail' | 'warn'
  checks: { name: string; status: 'pass' | 'fail' | 'warn'; detail: string; blocking: boolean }[]
  quoted_price_inr: number
  credits_required: number
  credits_available: number
  audit_token: string | null
  message: string
}

export interface SecurityReport {
  job_id: string | null
  status: string
  remediations: { severity: string; finding: string; fix: string }[]
}

export interface DeployRequest extends EstimateRequest {
  env_vars?: Record<string, string>
  audit_token?: string | null
}

export interface DeployResponse {
  job_id: string
  status: string
  quoted_price_inr: number
  auth_hold_inr: number
  message: string
}

export interface JobStatus {
  job_id: string
  status: string
  quoted_price_inr: number
  actual_cost_inr: number | null
  credit_back_inr: number | null
  message?: string | null
}

export interface EnclaveKeyGrant {
  job_id: string
  enclave_public_key_pem: string
}

export interface WrappedKeyItem {
  key_ref: string
  wrapped_key_b64: string
  iv: string
  auth_tag: string
  blob_uri: string | null
  sha256: string | null
}

export interface ResultArtifact {
  kind: 'image' | 'captions' | 'xmp_sidecar' | 'safetensors' | 'metadata' | 'chunked'
  filename: string
  download_url: string
  source_path: string | null
  bytes: number
  /** For generate outputs: which prompt slot this variant belongs to. */
  slot?: number | null
}
export interface JobResultManifest { job_id: string; artifacts: ResultArtifact[] }

const C = '/customer'

export async function presignUpload(blobName: string, bytes: number): Promise<PresignedUpload> {
  const { data } = await api.post<PresignedUpload>(`${C}/storage/presign`, { blob_name: blobName, size_bytes: bytes })
  return data
}

export async function storageCount(url: string): Promise<{ file_count: number | null; source: string | null; error: string | null }> {
  const { data } = await api.get(`${C}/storage/count`, { params: { url } })
  return data
}

// The estimate/scan/audit/deploy calls all run the AutoProfiler + capacity/queue
// queries server-side, so they're far heavier than the 20s default client timeout —
// on a cold or loaded backend that default trips before deploy can return. Give the
// idempotent read-side calls 60s; deploy gets 120s. Deploy is deliberately NOT retried
// (it creates a Job — a retry could produce a duplicate job and double-charge).
const HEAVY_TIMEOUT_MS = 60_000
const DEPLOY_TIMEOUT_MS = 120_000

export async function estimateJob(req: EstimateRequest) {
  const { data } = await api.post(`${C}/jobs/estimate`, req, { timeout: HEAVY_TIMEOUT_MS })
  return data as { quoted_price_inr: number; etc_hrs: number | null }
}

export async function scanJob(req: EstimateRequest): Promise<SecurityReport> {
  const { data } = await api.post<SecurityReport>(`${C}/jobs/scan`, req, { timeout: HEAVY_TIMEOUT_MS })
  return data
}

export async function auditJob(req: EstimateRequest): Promise<AuditReport> {
  const { data } = await api.post<AuditReport>(`${C}/jobs/audit`, req, { timeout: HEAVY_TIMEOUT_MS })
  return data
}

export async function deployJob(req: DeployRequest): Promise<DeployResponse> {
  const { data } = await api.post<DeployResponse>(`${C}/jobs/deploy`, req, {
    timeout: DEPLOY_TIMEOUT_MS,
    validateStatus: (s) => s >= 200 && s < 300,
  })
  return data
}

export async function getJob(jobId: string): Promise<JobStatus> {
  const { data } = await api.get<JobStatus>(`${C}/jobs/${jobId}`)
  return data
}

// ── Studio per-event checkout (one-off Cashfree order → run) ─────────────────
import { openCashfreeCheckout } from '@/lib/cashfreeCheckout'

// Custom-branded Cashfree Elements checkout (the approved design) — the SHIPPED path.
// Component wiring audited against Cashfree's Element docs + pg-svelte wrapper (2026-07);
// the hosted `_modal` checkout below stays as a one-flag kill switch if the branded
// modal ever misbehaves in the field.
const CUSTOM_CHECKOUT = true

interface StudioOrder { order_id: string; payment_session_id: string; env: 'sandbox' | 'production'; amount_inr: number }

function loadCashfreeSdk(): Promise<void> {
  return new Promise((resolve, reject) => {
    const w = window as unknown as { Cashfree?: unknown }
    if (w.Cashfree) return resolve()
    const s = document.createElement('script')
    s.src = 'https://sdk.cashfree.com/js/v3/cashfree.js'
    s.onload = () => resolve()
    s.onerror = () => reject(new Error('Could not load the Cashfree checkout SDK'))
    document.head.appendChild(s)
  })
}

/** Pay for a Studio job that deployed in `pending_payment`: create a one-off Cashfree
 *  order, run the in-page (`_modal`) checkout, then wait for the webhook to release the
 *  job (pending_payment → queued). Throws if the user cancels or payment fails. */
export async function payStudioJob(jobId: string): Promise<void> {
  const { data } = await api.post<StudioOrder>(`${C}/studio/order`, { job_id: jobId })
  if (CUSTOM_CHECKOUT) {
    const r = await openCashfreeCheckout({
      mode: data.env,
      paymentSessionId: data.payment_session_id,
      amountInr: data.amount_inr,
      merchant: 'UCIN Studio',
      subtitle: 'Creative studio · pay per job',
      note: 'Fixed — never billed above',
    })
    if (r !== 'success') throw new Error('Payment was not completed')
  } else {
    await loadCashfreeSdk()
    const Cashfree = (window as unknown as { Cashfree: (o: { mode: string }) => { checkout: (o: Record<string, unknown>) => Promise<{ error?: { message?: string } }> } }).Cashfree
    const result = await Cashfree({ mode: data.env }).checkout({
      paymentSessionId: data.payment_session_id,
      redirectTarget: '_modal',
    })
    if (result?.error) throw new Error(result.error.message || 'Payment was not completed')
  }
  // The webhook releases the job (source of truth); wait (bounded) for it to leave pending_payment.
  const deadline = Date.now() + 90_000
  for (;;) {
    const job = await getJob(jobId)
    if (job.status !== 'pending_payment') return
    if (Date.now() > deadline) throw new Error('Payment received — the job will start shortly.')
    await new Promise((r) => setTimeout(r, 3000))
  }
}

export async function enclaveKey(jobId: string): Promise<EnclaveKeyGrant> {
  const { data } = await api.get<EnclaveKeyGrant>(`${C}/jobs/${jobId}/enclave-key`)
  return data
}

export async function submitWrappedKeys(jobId: string, keys: WrappedKeyItem[]) {
  const { data } = await api.post(`${C}/jobs/${jobId}/wrapped-keys`, { keys })
  return data as { job_id: string; accepted: number; verified: number; message: string }
}

export async function jobResults(jobId: string): Promise<JobResultManifest> {
  const { data } = await api.get<JobResultManifest>(`${C}/jobs/${jobId}/results`)
  return data
}

/** Upload one ciphertext blob straight to S3 via the presigned PUT URL. */
export async function putToStorage(grant: PresignedUpload, cipher: Blob): Promise<void> {
  const res = await fetch(grant.upload_url, { method: 'PUT', headers: grant.headers, body: cipher })
  if (!res.ok) throw new Error(`Upload failed (${res.status}) — check S3 CORS on the input bucket`)
}

// ── Outcome SLA delivery report (OUTCOME_SLA_SPEC.md §4) ─────────────────────

export interface SlaClauseResult {
  id: string
  result: 'pass' | 'fail' | 'insufficient_evidence' | 'reported_only'
  value?: unknown
  margin?: unknown
}

export interface SlaReport {
  sla_id: string
  event_id: string
  status: string
  scorecard: {
    delivered_at: string
    input_frames: number | null
    delivered_count: number | null
    enhanced_count: number | null
    clause_results: SlaClauseResult[]
    failed_clauses: string[]
    evidence_frames: number
  } | null
  invoice_lines: { label: string; amount_inr: number }[]
  quoted_inr: number
  promised_by: string | null
  delivered_at: string | null
  accepted: boolean
  revisions: { included: number }
  receipts_sha256: string | null
}

/** The delivery report for a shoot, by its event id (null → no SLA contract). */
export async function slaReportByEvent(eventId: string): Promise<SlaReport | null> {
  const { data } = await api.get<{ sla_id: string }[]>(`${C}/sla/contracts`, { params: { event_id: eventId } })
  const sla = data[0]?.sla_id
  if (!sla) return null
  const { data: report } = await api.get<SlaReport>(`${C}/sla/contracts/${sla}/report`)
  return report
}

export async function slaAccept(slaId: string): Promise<SlaReport> {
  const { data } = await api.post<SlaReport>(`${C}/sla/contracts/${slaId}/accept`, {})
  return data
}
