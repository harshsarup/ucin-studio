import { useEffect, useRef, useState } from 'react'
import { Wallet } from 'lucide-react'
import { api } from '@/api/config' // authed axios (Bearer token interceptor)

interface RecentJob {
  job_id: string
  status: string
  action_id: string | null
  quoted_price_inr: number | null
  actual_cost_inr: number | null
  created_at: string | null
}

interface Usage {
  wallet_balance_inr: number
  jobs_total: number
  jobs_by_status: Record<string, number>
  total_spent_inr: number
  recent_jobs: RecentJob[]
}

const inr = (n?: number | null): string =>
  '₹' + (n ?? 0).toLocaleString('en-IN', { maximumFractionDigits: 0 })

/**
 * Header widget: shows the signed-in customer's wallet balance as a pill, and opens
 * a panel with their spend + recent jobs (GET /customer/usage). Same account/wallet
 * the network admin panel manages — a comp credit granted there shows up here.
 */
export function WalletUsage() {
  const [open, setOpen] = useState(false)
  const [usage, setUsage] = useState<Usage | null>(null)
  const [err, setErr] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  const load = (): void => {
    api.get<Usage>('/customer/usage')
      .then((r) => { setUsage(r.data); setErr(false) })
      .catch(() => setErr(true))
  }

  useEffect(() => { load() }, [])
  useEffect(() => {
    if (!open) return
    load()
    const onClick = (e: MouseEvent): void => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [open])

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[13px] font-medium text-fg-subtle hover:text-fg"
        style={{ borderColor: 'var(--border)' }}
        aria-label="Wallet and usage"
      >
        <Wallet size={14} />
        <span>
          {usage ? inr(usage.wallet_balance_inr) : '—'}
          <span className="hidden sm:inline text-fg-faint"> credits</span>
        </span>
      </button>

      {open && (
        <div
          className="absolute right-0 mt-2 w-80 rounded-lg border p-3 z-50"
          style={{ background: 'var(--bg)', borderColor: 'var(--border)', boxShadow: '0 10px 30px rgba(0,0,0,0.12)' }}
        >
          {err && <div className="px-1 py-2 text-[13px] text-fg-subtle">Sign in to see your usage.</div>}
          {usage && (
            <>
              <div className="mb-2 flex items-baseline justify-between border-b px-1 pb-2" style={{ borderColor: 'var(--border)' }}>
                <div>
                  <div className="text-[11px] uppercase tracking-wide text-fg-faint">Wallet balance</div>
                  <div className="text-xl font-semibold text-fg">{inr(usage.wallet_balance_inr)}</div>
                </div>
                <div className="text-right">
                  <div className="text-[11px] text-fg-faint">Spent · {usage.jobs_total} jobs</div>
                  <div className="text-[15px] font-medium text-fg-subtle">{inr(usage.total_spent_inr)}</div>
                </div>
              </div>
              <div className="mb-1.5 px-1 text-[11px] uppercase tracking-wide text-fg-faint">Recent activity</div>
              <div className="max-h-64 space-y-1 overflow-y-auto">
                {usage.recent_jobs.length === 0 && (
                  <div className="px-1 py-2 text-[13px] text-fg-subtle">No jobs yet.</div>
                )}
                {usage.recent_jobs.map((j) => (
                  <div key={j.job_id} className="flex items-center justify-between px-1 py-1 text-[13px]">
                    <div className="min-w-0">
                      <div className="truncate text-fg">{j.action_id ?? 'job'}</div>
                      <div className="text-[11px] text-fg-faint">
                        {j.status}{j.created_at ? ' · ' + new Date(j.created_at).toLocaleDateString('en-IN') : ''}
                      </div>
                    </div>
                    <div className="whitespace-nowrap font-medium text-fg-subtle">
                      {inr(j.actual_cost_inr ?? j.quoted_price_inr)}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  )
}
