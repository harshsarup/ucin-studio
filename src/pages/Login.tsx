import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { Logo } from '@/components/Logo'
import { login, signup } from '@/api/auth'

const inputCls =
  'w-full rounded-lg border border-canvas-border bg-canvas-surface px-3 py-2.5 text-[15px] text-fg outline-none focus:border-accent'

/** Email/password sign-in & sign-up for the web app. Google/Microsoft OAuth
 *  buttons will sit above the divider once OAuth credentials are configured. */
export function Login() {
  const navigate = useNavigate()
  const [mode, setMode] = useState<'in' | 'up'>('in')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  const API = (import.meta.env.VITE_API_BASE as string | undefined) ?? ''
  // Redirect to the backend's Google OAuth initiation route (same-origin when
  // VITE_API_BASE is unset). Backend must be reachable at this path.
  const googleHref = `${API}/auth/google/login?next=${encodeURIComponent(window.location.origin + '/app')}`

  const submit = async (e: FormEvent): Promise<void> => {
    e.preventDefault()
    setBusy(true)
    setError('')
    try {
      if (mode === 'in') await login(email, password)
      else await signup(email, password)
      navigate('/app')
    } catch (err) {
      const detail = (err as { response?: { data?: { detail?: string } } })?.response?.data?.detail
      setError(detail ?? 'Something went wrong. Check your details and try again.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="min-h-screen">
      <header className="border-b border-canvas-border">
        <div className="max-w-5xl mx-auto flex h-16 items-center justify-between px-6">
          <a href="/" aria-label="UCIN Studio"><Logo /></a>
          <a href="/" className="flex items-center gap-1.5 text-[14px] font-medium text-fg-subtle hover:text-fg">
            <ArrowLeft size={15} /> Back to site
          </a>
        </div>
      </header>

      <main className="max-w-md mx-auto px-6 py-16">
        <div className="eyebrow mb-3">{mode === 'in' ? 'Welcome back' : 'Get started'}</div>
        <h1 className="display mb-2" style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.6rem)' }}>
          {mode === 'in' ? 'Sign in' : 'Create your account'}
        </h1>
        <p className="text-[15px] text-fg-muted mb-8">
          {mode === 'in' ? 'Pick up where you left off.' : 'Free to start — no card required.'}
        </p>

        <a href={googleHref} className="btn-line w-full justify-center gap-2.5">
          <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
            <path fill="#4285F4" d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.72v2.26h2.91c1.7-1.57 2.69-3.88 2.69-6.62z"/>
            <path fill="#34A853" d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.91-2.26c-.81.54-1.84.86-3.05.86-2.34 0-4.33-1.58-5.04-3.71H.96v2.33A9 9 0 0 0 9 18z"/>
            <path fill="#FBBC05" d="M3.96 10.71A5.41 5.41 0 0 1 3.68 9c0-.59.1-1.17.28-1.71V4.96H.96A9 9 0 0 0 0 9c0 1.45.35 2.83.96 4.04l3-2.33z"/>
            <path fill="#EA4335" d="M9 3.58c1.32 0 2.5.45 3.44 1.35l2.58-2.59C13.46.89 11.43 0 9 0A9 9 0 0 0 .96 4.96l3 2.33C4.67 5.16 6.66 3.58 9 3.58z"/>
          </svg>
          Continue with Google
        </a>
        <div className="my-5 flex items-center gap-3 text-[12px] text-fg-faint">
          <span className="h-px flex-1" style={{ background: 'var(--border)' }} /> or <span className="h-px flex-1" style={{ background: 'var(--border)' }} />
        </div>

        <form onSubmit={submit} className="card p-7 space-y-4">
          <div>
            <label className="text-[13px] font-medium text-fg">Email</label>
            <input
              type="email" required autoFocus
              className={`${inputCls} mt-1.5`}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@studio.com"
            />
          </div>
          <div>
            <label className="text-[13px] font-medium text-fg">Password</label>
            <input
              type="password" required minLength={8}
              className={`${inputCls} mt-1.5`}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 8 characters"
            />
          </div>

          {error && (
            <p className="rounded-lg border px-3 py-2 text-[13px]"
              style={{ borderColor: 'var(--tint-border)', background: 'var(--tint)', color: 'var(--fg-muted)' }}>
              {error}
            </p>
          )}

          <button type="submit" disabled={busy} className="btn-primary w-full">
            {busy ? 'Just a moment…' : mode === 'in' ? 'Sign in' : 'Create account'}
            <ArrowRight size={15} />
          </button>
        </form>

        <p className="mt-5 text-center text-[14px] text-fg-subtle">
          {mode === 'in' ? "Don't have an account? " : 'Already have one? '}
          <button
            onClick={() => { setMode(mode === 'in' ? 'up' : 'in'); setError('') }}
            className="text-accent font-medium"
          >
            {mode === 'in' ? 'Create one' : 'Sign in'}
          </button>
        </p>
      </main>
    </div>
  )
}
