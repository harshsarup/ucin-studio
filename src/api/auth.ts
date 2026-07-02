import { useCallback, useEffect, useState } from 'react'
import axios from 'axios'

/**
 * Web auth — mirrors the backend /auth endpoints (auth_api.py): POST /auth/login,
 * POST /auth/signup, GET /auth/me. The JWT is stored in localStorage and attached
 * as a Bearer token (see api/config.ts interceptor) so /customer calls are authed.
 * Email/password is free; Google/Microsoft OAuth buttons layer on later.
 */
// Same universal resolution as api/config.ts: always the live Control Plane in
// production, '' in dev (Vite proxies /auth), VITE_API_BASE overrides.
const API_BASE =
  (import.meta.env.VITE_API_BASE as string | undefined) ||
  (import.meta.env.PROD ? 'https://api.ucin.in' : '')
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
const EXP_KEY = 'ucin.token_exp'

/** Returns the stored JWT, or null if it's missing or past its expiry (which we
 *  also clear, so an expired Google/email session reads as signed-out). */
export const getToken = (): string | null => {
  const t = localStorage.getItem(TOKEN_KEY)
  if (!t) return null
  const exp = localStorage.getItem(EXP_KEY)
  if (exp && Date.now() > new Date(exp).getTime()) {
    clearToken()
    return null
  }
  return t
}

/** Persist a session. `expiresAt` (ISO) comes from the token response or the
 *  OAuth redirect (?expires_at=…) so the client knows when to treat it as stale. */
export const setToken = (t: string, expiresAt?: string | null): void => {
  localStorage.setItem(TOKEN_KEY, t)
  if (expiresAt) localStorage.setItem(EXP_KEY, expiresAt)
  else localStorage.removeItem(EXP_KEY)
}

export const clearToken = (): void => {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(EXP_KEY)
}

export async function login(email: string, password: string, totpCode?: string): Promise<AuthAccount> {
  const { data } = await http.post<TokenResponse>('/auth/login', {
    email,
    password,
    ...(totpCode ? { totp_code: totpCode } : {}),
  })
  setToken(data.token, data.expires_at)
  return data.account
}

export async function signup(email: string, password: string): Promise<AuthAccount> {
  const { data } = await http.post<TokenResponse>('/auth/signup', { email, password })
  setToken(data.token, data.expires_at)
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
