import { api } from '@/api/config' // authed axios (Bearer token interceptor)

/** The studio's own models (trained / uploaded / imported from Hugging Face). */

export interface MyModel {
  model_id: string
  name: string
  base_model: string
  status: string
  description: string | null
}

export const listMyModels = async (): Promise<MyModel[]> =>
  (await api.get<MyModel[]>('/customer/lora')).data
