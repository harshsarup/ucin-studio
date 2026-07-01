import { api } from '@/api/config' // authed axios (Bearer token interceptor)

/** Saved, reusable per-client event recipes — an accumulating switching-cost asset. */

export interface Workflow {
  id: string
  name: string
  client_name: string | null
  config: Record<string, unknown>
  created_at: string
}

export const listWorkflows = async (): Promise<Workflow[]> =>
  (await api.get<Workflow[]>('/customer/workflows')).data

export const createWorkflow = async (
  name: string,
  client_name: string | undefined,
  config: Record<string, unknown>,
): Promise<Workflow> =>
  (await api.post<Workflow>('/customer/workflows', { name, client_name, config })).data

export const deleteWorkflow = async (id: string): Promise<void> => {
  await api.delete(`/customer/workflows/${id}`)
}
