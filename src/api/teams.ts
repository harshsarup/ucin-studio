import { api } from '@/api/config' // authed axios (Bearer token interceptor)

/** Typed client for the /customer/teams endpoints (multi-seat). */

export interface Team {
  id: string
  name: string
  owner_user_id: string
  role: 'owner' | 'admin' | 'member'
  member_count: number
  created_at: string
}

export interface Member {
  id: string
  email: string
  user_id: string | null
  role: 'owner' | 'admin' | 'member'
  status: 'invited' | 'active'
  created_at: string
}

export const listTeams = async (): Promise<Team[]> =>
  (await api.get<Team[]>('/customer/teams')).data

export const createTeam = async (name: string): Promise<Team> =>
  (await api.post<Team>('/customer/teams', { name })).data

export const listMembers = async (teamId: string): Promise<Member[]> =>
  (await api.get<Member[]>(`/customer/teams/${teamId}/members`)).data

export const inviteMember = async (
  teamId: string,
  email: string,
  role: string,
): Promise<{ invite_token: string; email: string; team_id: string }> =>
  (await api.post(`/customer/teams/${teamId}/invites`, { email, role })).data

export const acceptInvite = async (token: string): Promise<Team> =>
  (await api.post<Team>(`/customer/teams/invites/${token}/accept`)).data

export const setMemberRole = async (teamId: string, memberId: string, role: string): Promise<Member> =>
  (await api.patch<Member>(`/customer/teams/${teamId}/members/${memberId}`, { role })).data

export const removeMember = async (teamId: string, memberId: string): Promise<void> => {
  await api.delete(`/customer/teams/${teamId}/members/${memberId}`)
}
