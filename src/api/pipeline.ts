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
  kind: 'xmp_sidecar' | 'safetensors' | 'metadata'
  filename: string
  download_url: string
  source_path: string | null
  bytes: number
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

export async function estimateJob(req: EstimateRequest) {
  const { data } = await api.post(`${C}/jobs/estimate`, req)
  return data as { quoted_price_inr: number; etc_hrs: number | null }
}

export async function scanJob(req: EstimateRequest): Promise<SecurityReport> {
  const { data } = await api.post<SecurityReport>(`${C}/jobs/scan`, req)
  return data
}

export async function auditJob(req: EstimateRequest): Promise<AuditReport> {
  const { data } = await api.post<AuditReport>(`${C}/jobs/audit`, req)
  return data
}

export async function deployJob(req: DeployRequest): Promise<DeployResponse> {
  const { data } = await api.post<DeployResponse>(`${C}/jobs/deploy`, req, { validateStatus: (s) => s >= 200 && s < 300 })
  return data
}

export async function getJob(jobId: string): Promise<JobStatus> {
  const { data } = await api.get<JobStatus>(`${C}/jobs/${jobId}`)
  return data
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
