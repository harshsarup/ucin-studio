import axios from 'axios'

// The backend is always the live Control Plane so nothing needs configuring:
//   • an explicit VITE_API_BASE wins (custom deploy),
//   • a production build defaults to https://api.ucin.in,
//   • dev uses '' so Vite proxies /customer + /auth to the local backend.
export const API_BASE =
  (import.meta.env.VITE_API_BASE as string | undefined) ||
  (import.meta.env.PROD ? 'https://api.ucin.in' : '')
export const api = axios.create({ baseURL: API_BASE, timeout: 20_000 })

// Attach the auth token (set by api/auth.ts) to every Control-Plane call.
api.interceptors.request.use((cfg) => {
  const token = localStorage.getItem('ucin.token')
  if (token) cfg.headers.Authorization = `Bearer ${token}`
  return cfg
})

/** Per-result Studio pricing + the competitor it undercuts (GET /customer/config). */
export interface TaskPricing {
  action_id: string
  price_inr: number
  label: string
  unit: string
  competitor: string
  competitor_inr: number
}

export interface ClientConfig {
  task_pricing?: TaskPricing[]
  ts?: string
}

/** Built-in prices so the site renders fully even with the backend offline. */
export const FALLBACK_TASK_PRICING: TaskPricing[] = [
  { action_id: 'upscale',       price_inr: 1.90, label: 'Upscale image',     unit: 'image', competitor: 'Cloudinary AI',  competitor_inr: 2.52 },
  { action_id: 'remove-bg',     price_inr: 6.50, label: 'Remove background', unit: 'image', competitor: 'Remove.bg',      competitor_inr: 8.40 },
  { action_id: 'text-to-image', price_inr: 2.80, label: 'Generate image',    unit: 'image', competitor: 'DALL·E 3',       competitor_inr: 3.36 },
  { action_id: 'transcribe',    price_inr: 7.50, label: 'Transcribe audio',  unit: 'file',  competitor: 'AWS Transcribe', competitor_inr: 10.08 },
  { action_id: 'translate',     price_inr: 0.90, label: 'Translate',         unit: 'doc',   competitor: 'AWS Translate',  competitor_inr: 1.26 },
  { action_id: 'summarize',     price_inr: 0.12, label: 'Summarize',         unit: 'doc',   competitor: 'Azure Text',     competitor_inr: 0.17 },
  { action_id: 'classify-img',  price_inr: 0.10, label: 'Classify image',    unit: 'image', competitor: 'Google Vision',  competitor_inr: 0.13 },
  { action_id: 'detect',        price_inr: 0.10, label: 'Detect objects',    unit: 'image', competitor: 'Google Vision',  competitor_inr: 0.13 },
]

export async function getClientConfig(): Promise<ClientConfig> {
  const { data } = await api.get<ClientConfig>('/customer/config')
  return data
}

export interface PricedTask extends TaskPricing {
  discount_pct: number
}

/** Merge live pricing (if present) with the fallback, keyed by action_id. */
export function pricedByAction(live?: TaskPricing[]): Record<string, PricedTask> {
  const list = live && live.length ? live : FALLBACK_TASK_PRICING
  return list.reduce<Record<string, PricedTask>>((acc, t) => {
    const discount_pct = t.competitor_inr > 0
      ? Math.round(((t.competitor_inr - t.price_inr) / t.competitor_inr) * 100)
      : 0
    acc[t.action_id] = { ...t, discount_pct }
    return acc
  }, {})
}

export const fmtINR = (n: number) => `₹${n % 1 === 0 ? n.toFixed(0) : n.toFixed(2)}`
