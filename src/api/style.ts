import { api } from '@/api/config' // authed axios (Bearer token interceptor)

/** The studio's living style profile — read-only surface of the lock-in it builds. */

export interface StyleProfile {
  id: string
  name: string
  version: number
  sample_count: number
  match_rate: number | null
  corrections_since_retrain: number
  retrain_budget_inr: number
  next_retrain_at_inr: number
  updated_at: string
}

export const getStyleProfile = async (): Promise<StyleProfile> =>
  (await api.get<StyleProfile>('/customer/style/profile')).data
