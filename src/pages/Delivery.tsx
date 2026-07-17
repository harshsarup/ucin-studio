import { useEffect, useState } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { BadgeCheck, AlertTriangle, HelpCircle, ShieldCheck } from 'lucide-react'
import { fmtINR } from '@/api/config'
import { getToken } from '@/api/auth'
import { slaReportByEvent, slaAccept, type SlaReport, type SlaClauseResult } from '@/api/pipeline'

const CLAUSE_LABEL: Record<string, string> = {
  on_time: 'Delivered on time',
  delivered_size: 'Gallery size as agreed',
  keeper_sharpness: 'Every keeper is sharp',
  eyes_open: 'No blinks delivered',
  burst_dedup: 'No duplicate burst frames',
  coverage: 'Every moment covered',
  enhance_floor: 'Quality floor met',
  style_match: 'Style match',
}

function ClauseRow({ c }: { c: SlaClauseResult }) {
  const tone = c.result === 'pass' ? '#2e9e6b' : c.result === 'fail' ? '#c0392b' : 'var(--fg-faint)'
  const Icon = c.result === 'pass' ? BadgeCheck : c.result === 'fail' ? AlertTriangle : HelpCircle
  const detail =
    c.result === 'insufficient_evidence' ? 'no evidence from this run'
    : c.result === 'reported_only' ? 'reported, not guaranteed'
    : [c.value, typeof c.margin === 'string' ? c.margin : null].filter(Boolean).join(' · ')
  return (
    <div className="flex items-center justify-between gap-3 border-b border-canvas-border/60 px-4 py-2.5 last:border-0">
      <span className="flex items-center gap-2 text-[14px] text-fg">
        <Icon size={15} style={{ color: tone }} />
        {CLAUSE_LABEL[c.id] ?? c.id}
      </span>
      <span className="text-[12px]" style={{ color: tone }}>{String(detail || c.result)}</span>
    </div>
  )
}

/** /delivery?event=… — the SLA delivery report: promises, measurements, acceptance. */
export function Delivery() {
  const [params] = useSearchParams()
  const eventId = params.get('event') ?? ''
  const authed = !!getToken()
  const [report, setReport] = useState<SlaReport | null>(null)
  const [loading, setLoading] = useState(true)
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    if (!eventId || !authed) { setLoading(false); return }
    slaReportByEvent(eventId)
      .then(setReport)
      .catch(() => setReport(null))
      .finally(() => setLoading(false))
  }, [eventId, authed])

  const sc = report?.scorecard
  return (
    <div className="mx-auto max-w-xl px-4 py-10">
      <h1 className="text-xl font-semibold text-fg">Delivery report</h1>
      <p className="mt-1 text-[13px] text-fg-subtle">
        What was promised, what was measured — every claim backed by per-frame evidence.
      </p>

      {!authed ? (
        <p className="mt-6 text-[14px] text-fg-subtle">
          <Link to="/login" className="font-medium text-accent hover:underline">Sign in</Link> to view this report.
        </p>
      ) : loading ? (
        <p className="mt-6 text-[14px] text-fg-subtle">Loading…</p>
      ) : !report ? (
        <p className="mt-6 flex items-center gap-2 text-[14px] text-fg-subtle">
          <ShieldCheck size={16} /> No delivery contract found for this shoot.
        </p>
      ) : (
        <div className="mt-6 space-y-4">
          <div className="rounded-xl border border-canvas-border p-4">
            <div className="text-[13px] font-medium text-fg">
              {report.accepted ? 'Accepted & closed' : report.status === 'delivered' ? 'Delivered — review & accept' : `Status: ${report.status}`}
            </div>
            <div className="mt-2 space-y-1">
              {report.invoice_lines.map((l, i) => (
                <div key={i} className="flex items-center justify-between text-[13px]">
                  <span className="text-fg">{l.label}</span>
                  <span className="tabular-nums text-fg">{l.amount_inr > 0 ? fmtINR(l.amount_inr) : ''}</span>
                </div>
              ))}
              <div className="mt-1 flex items-center justify-between border-t border-canvas-border pt-2 text-[13px] font-medium">
                <span className="text-fg">Fixed price — never billed above</span>
                <span className="tabular-nums text-fg">{fmtINR(report.quoted_inr)}</span>
              </div>
            </div>
          </div>

          {sc && (
            <div className="overflow-hidden rounded-xl border border-canvas-border">
              <div className="border-b border-canvas-border px-4 py-3 text-[12px] text-fg-subtle">
                {sc.evidence_frames.toLocaleString()} per-frame receipts
                {sc.delivered_count != null && <> · {sc.delivered_count.toLocaleString()} delivered of {sc.input_frames?.toLocaleString() ?? '—'} in</>}
                {sc.enhanced_count != null && <> · {sc.enhanced_count} enhanced (need-based)</>}
              </div>
              {sc.clause_results.map((c) => <ClauseRow key={c.id} c={c} />)}
            </div>
          )}

          {report.status === 'delivered' && !report.accepted && (
            <button
              disabled={busy}
              onClick={() => {
                setBusy(true)
                slaAccept(report.sla_id).then(setReport).finally(() => setBusy(false))
              }}
              className="w-full rounded-xl bg-accent px-4 py-2.5 text-[14px] font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50"
            >
              Accept delivery
            </button>
          )}
        </div>
      )}
    </div>
  )
}
