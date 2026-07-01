import { useCallback, useEffect, useState } from 'react'
import axios from 'axios'

/**
 * Web auth — mirrors the backend /auth endpoints (auth_api.py): POST /auth/login,
 * POST /auth/signup, GET /auth/me. The JWT is stored in localStorage and attached
 * as a Bearer token (see api/config.ts interceptor) so /customer calls are authed.
 * Email/password is free; Google/Microsoft OAuth buttons layer on later.
 */
const API_BASE = (import.meta.env.VITE_API_BASE as string | undefined) ?? ''
const http = axios.create({ baseURL: API_BASE, timeout: 20_000 })

export interface AuthAccount {
  id: string
  email: string
  account_type: 'customer' | 'dc_operator'
  user_id: string | null
  email_verified: boolean
  mfa_enabled: boolean
  status: string
  created_at: string
}

interface TokenResponse {
  token: string
  expires_at: string
  account: AuthAccount
}

const TOKEN_KEY = 'ucin.token'

export const getToken = (): string | null => localStorage.getItem(TOKEN_KEY)
export const setToken = (t: string): void => localStorage.setItem(TOKEN_KEY, t)
export const clearToken = (): void => localStorage.removeItem(TOKEN_KEY)

export async function login(email: string, password: string, totpCode?: string): Promise<AuthAccount> {
  const { data } = await http.post<TokenResponse>('/auth/login', {
    email,
    password,
    ...(totpCode ? { totp_code: totpCode } : {}),
  })
  setToken(data.token)
  return data.account
}

export async function signup(email: string, password: string): Promise<AuthAccount> {
  const { data } = await http.post<TokenResponse>('/auth/signup', { email, password })
  setToken(data.token)
  return data.account
}

async function fetchMe(): Promise<AuthAccount> {
  const { data } = await http.get<AuthAccount>('/auth/me', {
    headers: { Authorization: `Bearer ${getToken()}` },
  })
  return data
}

/** Auth state for the app. Resolves the stored token to an account on mount. */
export function useAuth() {
  const [account, setAccount] = useState<AuthAccount | null>(null)
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(async (): Promise<void> => {
    if (!getToken()) {
      setAccount(null)
      setLoading(false)
      return
    }
    try {
      setAccount(await fetchMe())
    } catch {
      clearToken()
      setAccount(null)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void refresh()
  }, [refresh])

  const logout = useCallback((): void => {
    clearToken()
    setAccount(null)
  }, [])

  return { account, loading, refresh, logout }
}
