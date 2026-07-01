import { api } from '@/api/config' // authed axios (Bearer token interceptor)

/** Generative assistant: a plain-language goal → a plan of UCIN tasks (Claude). */

export interface AssistantPlanLine {
  action_id: string
  count: number | null
  note: string | null
}

export interface AssistantPlan {
  rationale: string
  speed: 'flex' | 'core' | 'priority' | null
  lines: AssistantPlanLine[]
}

export const planEvent = async (
  goal: string,
  vertical?: string,
  itemCount?: number,
): Promise<AssistantPlan> =>
  (await api.post<AssistantPlan>('/customer/assistant/plan', {
    goal,
    vertical,
    item_count: itemCount,
  })).data
