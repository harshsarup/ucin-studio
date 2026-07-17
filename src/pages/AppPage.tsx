import { useEffect, useMemo, useState, type ReactNode } from 'react'
import { ArrowLeft, Clock, ShieldCheck, ArrowRight, Wand2, Sparkles, ChevronDown, Settings, Download } from 'lucide-react'
import { Logo } from '@/components/Logo'
import { Onboarding } from '@/components/Onboarding'
import { fmtINR } from '@/api/config'
import { getToken, clearToken, setToken } from '@/api/auth'
import { planEvent, type AssistantPlan } from '@/api/assistant'
import { getStyleProfile, type StyleProfile } from '@/api/style'
import { listWorkflows, createWorkflow, deleteWorkflow, type Workflow } from '@/api/workflows'
import { listMyModels, type MyModel } from '@/api/models'
import type { Tier, TaskId, Vertical, EventToggles } from '@/lib/catalog'
import {
  VERTICALS, TASKS, SPEED_TIERS, TOGGLES, NO_TOGGLES,
  presetsFor, defaultCounts, quoteEvent, modelsFor,
  usesDials, defaultDials, dialsToLines, type OutcomeDials,
  SLA_DELIVERED_BANDS, SLA_DELIVERED_TOLERANCE_PCT,
} from '@/lib/catalog'
import { checkBatch, fmtBytes, DESKTOP_INSTALL_CMD } from '@/lib/batch'
import { submitBrowserJob, BROWSER_ACTIONS, type SubmitProgress } from '@/lib/browserSubmit'
import { SubmitJourney } from '@/components/SubmitJourney'
import { BrandStamp } from '@/components/BrandStamp'
import type { ResultArtifact } from '@/api/pipeline'

const inputCls =
  'w-full rounded-lg border border-canvas-border bg-canvas-surface px-3 py-2 text-[15px] text-fg outline-none focus:border-accent'

/** The assistant speaks backend action_ids ('upscale', 'text-to-image'); the
 *  builder's counts are keyed by catalog TaskIds ('enhance', 'generate'). */
const TASK_BY_ACTION: Record<string, TaskId> = Object.fromEntries(
  Object.values(TASKS).map((t) => [t.actionId, t.id]),
) as Record<string, TaskId>
const toTaskId = (actionId: string): TaskId | undefined =>
  TASK_BY_ACTION[actionId] ?? (actionId in TASKS ? (actionId as TaskId) : undefined)

/** A selectable model/style row showing its name, what it does, and its SOTA base. */
function StyleOption({ name, blurb, base, selected, onPick }: {
  name: string; blurb?: string; base?: string; selected: boolean; onPick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onPick}
      className="block w-full rounded-lg px-2.5 py-2 text-left transition-colors hover:bg-canvas-surface"
      style={selected ? { background: 'var(--tint)', boxShadow: 'inset 0 0 0 1px var(--accent)' } : undefined}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="text-[14px] font-medium text-fg">{name}</span>
        {base && <span className="shrink-0 rounded bg-canvas-border/60 px-1.5 py-0.5 text-[10px] text-fg-faint">{base}</span>}
      </div>
      {blurb && <div className="mt-0.5 text-[12px] text-fg-subtle">{blurb}</div>}
    </button>
  )
}

/**
 * The browser Event Builder — the warm-premium twin of the desktop NewEvent.
 * Pick your world → a preset → how many → how fast, and get a fixed,
 * never-billed-over quote (computed by the shared catalog; equal to the bill).
 *
 * v1 is the quote/build surface; sign-in + upload/connect-storage for actual
 * submission is the next slice (auth + browser pipeline).
 */
export function AppPage() {
  const [vertical, setVertical] = useState<Vertical | null>(() => {
    const saved = localStorage.getItem('ucin.vertical')
    return saved && saved in VERTICALS ? (saved as Vertical) : null
  })
  const activeVertical: Vertical = vertical ?? 'photo'
  const presets = useMemo(() => presetsFor(activeVertical), [activeVertical])
  const [presetId, setPresetId] = useState(presets[0]?.id ?? '')
  const preset = presets.find((p) => p.id === presetId) ?? presets[0]
  const labels = VERTICALS[activeVertical]

  const [name, setName] = useState('')
  const [totalItems, setTotalItems] = useState(0)
  const [counts, setCounts] = useState<Record<string, number>>({})
  const [speedId, setSpeedId] = useState<Tier>('flex')
  const [modelId, setModelId] = useState('')
  const [hfModel, setHfModel] = useState('')   // bring-your-own HuggingFace model
  const [hfToken, setHfToken] = useState('')   // token for a private/gated hf model
  const [toggles, setToggles] = useState<EventToggles>(NO_TOGGLES)
  const [files, setFiles] = useState<File[]>([])
  const [phase, setPhase] = useState<SubmitProgress | null>(null)
  const [result, setResult] = useState<{ jobId: string; status: string; artifacts: ResultArtifact[] } | null>(null)
  const [submitErr, setSubmitErr] = useState('')
  const [authed, setAuthed] = useState<boolean>(() => !!getToken())
  const [aiGoal, setAiGoal] = useState('')
  const [aiPlan, setAiPlan] = useState<AssistantPlan | null>(null)
  const [aiBusy, setAiBusy] = useState(false)
  const [aiErr, setAiErr] = useState('')
  const [styleProfile, setStyleProfile] = useState<StyleProfile | null>(null)
  const [workflows, setWorkflows] = useState<Workflow[]>([])
  const [myModels, setMyModels] = useState<MyModel[]>([])
  const [aiOpen, setAiOpen] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)

  // Capture the token Google SSO returns as ?token=…&expires_at=… then clean the URL.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const t = params.get('token')
    if (t) {
      setToken(t, params.get('expires_at'))
      setAuthed(true)
      window.history.replaceState({}, '', '/app')
    }
  }, [])

  useEffect(() => {
    if (!authed) return
    void getStyleProfile().then(setStyleProfile).catch(() => undefined)
    void listWorkflows().then(setWorkflows).catch(() => undefined)
    void listMyModels().then(setMyModels).catch(() => undefined)
  }, [authed])

  useEffect(() => {
    if (vertical) localStorage.setItem('ucin.vertical', vertical)
    setPresetId(presets[0]?.id ?? '')
  }, [vertical]) // eslint-disable-line react-hooks/exhaustive-deps

  const pickVertical = (v: Vertical): void => {
    localStorage.setItem('ucin.vertical', v)
    setVertical(v)
  }

  // Outcome dials (photo presets): the 3 numbers the customer actually knows.
  // Step counts DERIVE from these — never typed per step (OUTCOME_SLA_SPEC.md).
  const [dials, setDials] = useState<OutcomeDials | null>(null)
  const dialMode = usesDials(preset)

  // Files auto-count the input; the number field is only an estimator until then.
  useEffect(() => {
    if (files.length > 0) setTotalItems(files.length)
  }, [files.length]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!preset) return
    if (usesDials(preset)) {
      const d = defaultDials(preset, totalItems)
      setDials(d)
      setCounts(Object.fromEntries(dialsToLines(d, preset).map((l) => [l.taskId, l.count])) as Record<string, number>)
    } else {
      setDials(null)
      setCounts(defaultCounts(preset, totalItems))
    }
  }, [presetId, totalItems]) // eslint-disable-line react-hooks/exhaustive-deps

  /** Move a dial: clamp to sane bounds, then re-derive every step count. */
  const setDial = (patch: Partial<OutcomeDials>): void => {
    if (!preset || !dials) return
    const d = { ...dials, ...patch, inputCount: totalItems }
    d.deliveredTarget = Math.max(0, Math.min(Math.round(d.deliveredTarget || 0), d.inputCount))
    d.heroCount = Math.max(0, Math.min(Math.round(d.heroCount || 0), d.deliveredTarget))
    setDials(d)
    setCounts(Object.fromEntries(dialsToLines(d, preset).map((l) => [l.taskId, l.count])) as Record<string, number>)
  }

  const lines = (preset?.tasks ?? []).map((t) => ({ taskId: t.taskId, count: counts[t.taskId] ?? 0 }))
  const quote = quoteEvent(lines, speedId, toggles)
  const speed = SPEED_TIERS.find((s) => s.id === speedId)!
  // Style/model only matters when a model-driven step is in the plan.
  const modelDriven = lines.some((l) => l.count > 0 && ['grade', 'enhance', 'generate'].includes(l.taskId))

  // ── Browser submission: small single-step batches only; the rest → desktop ──
  const batch = checkBatch(files)
  const singleTask = quote.lines.length === 1 ? quote.lines[0] : null
  const actionId = singleTask ? TASKS[singleTask.taskId].actionId : null
  const multiStep = quote.lines.length > 1
  const browserAction = !!actionId && BROWSER_ACTIONS.has(actionId)
  const needsDesktop = files.length > 0 && (multiStep || !batch.ok || !browserAction)
  const canBrowserSubmit = authed && files.length > 0 && browserAction && batch.ok && !multiStep
  const submitting = !!phase && phase.phase !== 'error' && phase.phase !== 'done' && !result
  // Delivery egress (≤5 GB in-browser) is absorbed into the per-output task rates,
  // so the shown total is exactly tasks + base — equal to what the backend bills.

  const runSubmit = async (): Promise<void> => {
    if (!actionId || !singleTask) return
    setSubmitErr(''); setResult(null)
    try {
      const res = await submitBrowserJob(
        {
          files,
          actionId,
          tier: speedId,
          itemCount: singleTask.count || files.length,
          modelId,
          // Bring-your-own HuggingFace model (+ token for private/gated).
          hfModel: hfModel.trim() || undefined,
          hfToken: hfModel.trim() && hfToken.trim() ? hfToken.trim() : undefined,
          // Every add-on priced into the quote must reach the backend.
          privacy: toggles.privacy,
          guarantee: toggles.guarantee,
          whitelabel: toggles.whitelabel,
        },
        setPhase,
      )
      setResult(res)
    } catch (e) {
      setSubmitErr(e instanceof Error ? e.message : 'Submission failed')
      setPhase({ phase: 'error', done: 0, total: 0 })
    }
  }

  const setCount = (taskId: TaskId, value: number): void =>
    setCounts((c) => ({ ...c, [taskId]: Math.max(0, Math.round(value || 0)) }))

  const runAssistant = async (): Promise<void> => {
    setAiBusy(true)
    setAiErr('')
    try {
      setAiPlan(await planEvent(aiGoal, vertical ?? undefined, totalItems || undefined))
    } catch (e) {
      const detail = (e as { response?: { data?: { detail?: string } } })?.response?.data?.detail
      setAiErr(detail ?? 'Could not reach the assistant.')
    } finally {
      setAiBusy(false)
    }
  }

  const applyPlan = (): void => {
    if (!aiPlan) return
    const fallback = totalItems || aiPlan.lines.reduce((m, l) => Math.max(m, l.count ?? 0), 0)
    if (!totalItems && fallback) setTotalItems(fallback)
    if (dialMode && dials) {
      // Dial presets: the plan maps onto the dials (the single source of truth),
      // so a later preset/count change can't silently overwrite it.
      const byTask = Object.fromEntries(
        aiPlan.lines.map((l) => [toTaskId(l.action_id), l.count ?? 0] as const).filter(([id]) => id != null),
      ) as Partial<Record<TaskId, number>>
      setDial({
        deliveredTarget: byTask.grade ?? dials.deliveredTarget,
        heroCount: byTask.retouch ?? dials.heroCount,
      })
    } else {
      setCounts((c) => ({
        ...c,
        ...Object.fromEntries(
          aiPlan.lines
            .map((l) => [toTaskId(l.action_id), l.count ?? fallback] as const)
            .filter(([id]) => id != null),
        ),
      }))
    }
    if (aiPlan.speed && SPEED_TIERS.some((s) => s.id === aiPlan.speed)) setSpeedId(aiPlan.speed as Tier)
  }

  const saveWorkflow = async (): Promise<void> => {
    const name = window.prompt('Name this workflow (e.g. "Wedding — full edit")')?.trim()
    if (!name) return
    const client = window.prompt('Client name (optional)')?.trim() || undefined
    try {
      await createWorkflow(name, client, { vertical, presetId, speedId, toggles, modelId, totalItems })
      setWorkflows(await listWorkflows())
    } catch { /* non-critical */ }
  }

  const applyWorkflow = (w: Workflow): void => {
    const c = w.config as {
      vertical?: Vertical; presetId?: string; speedId?: Tier
      toggles?: EventToggles; modelId?: string; totalItems?: number
    }
    if (typeof c.totalItems === 'number') setTotalItems(c.totalItems)
    if (c.speedId) setSpeedId(c.speedId)
    if (c.toggles) setToggles(c.toggles)
    if (c.modelId) setModelId(c.modelId)
    if (c.vertical) setVertical(c.vertical)
    // preset is restored after the vertical effect (which resets it) settles
    if (c.presetId) setTimeout(() => setPresetId(c.presetId as string), 0)
  }

  const removeWorkflow = async (id: string): Promise<void> => {
    try {
      await deleteWorkflow(id)
      setWorkflows((w) => w.filter((x) => x.id !== id))
    } catch { /* non-critical */ }
  }

  if (!vertical) return <Onboarding onPick={pickVertical} />

  return (
    <div className="min-h-screen">
      {/* App bar */}
      <header className="border-b border-canvas-border">
        <div className="max-w-6xl mx-auto flex h-16 items-center justify-between px-4 sm:px-6">
          <a href="/" aria-label="UCIN Studio"><Logo /></a>
          <div className="flex items-center gap-3 sm:gap-5">
            <div className="relative">
              <button
                onClick={() => setSettingsOpen((o) => !o)}
                className="flex items-center gap-1.5 text-[13px] text-fg-subtle hover:text-fg"
                aria-label="Settings"
              >
                <Settings size={16} />
              </button>
              {settingsOpen && (
                <div
                  className="absolute right-0 mt-2 w-56 rounded-lg border p-1.5 z-50"
                  style={{ background: 'var(--bg)', borderColor: 'var(--border)', boxShadow: '0 10px 30px rgba(0,0,0,0.12)' }}
                >
                  <div className="px-2.5 py-1.5 text-[11px] text-fg-faint">Workspace · {labels.label}</div>
                  <button
                    onClick={() => { setVertical(null); setSettingsOpen(false) }}
                    className="block w-full rounded-md px-2.5 py-1.5 text-left text-[13px] text-fg hover:bg-canvas-surface"
                  >
                    Change workspace
                  </button>
                </div>
              )}
            </div>
            {authed ? (
              <>
                {/* Studio is per-event (no wallet/credits) — the wallet pill was removed. */}
                <a href="/team" className="whitespace-nowrap text-[13px] text-fg-subtle hover:text-fg">Team</a>
                <button
                  onClick={() => { clearToken(); location.reload() }}
                  className="whitespace-nowrap text-[13px] text-fg-subtle hover:text-fg"
                >
                  Sign out
                </button>
              </>
            ) : (
              <a href="/login" className="whitespace-nowrap text-[13px] font-medium text-accent">Sign in</a>
            )}
            <a href="/" aria-label="Back to site" className="flex items-center gap-1.5 whitespace-nowrap text-[14px] font-medium text-fg-subtle hover:text-fg">
              <ArrowLeft size={15} /> <span className="hidden sm:inline">Back to site</span>
            </a>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-12">
        <div className="eyebrow mb-3">{labels.newCta}</div>
        <h1 className="display mb-2" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' }}>
          Build your edit. See the price up front.
        </h1>
        <p className="text-lg text-fg-muted mb-10 max-w-xl">
          Choose what gets done and how fast — you get one fixed, all-in quote before anything starts.
          Your work stays encrypted and India-resident.
        </p>

        {/* Your style — the living profile that compounds with every shoot */}
        {authed && styleProfile && (
          <div className="card p-4 mb-6 flex items-center gap-3">
            <Sparkles size={18} className="text-accent shrink-0" />
            <div>
              <div className="text-[14px] font-semibold text-fg">Your style — v{styleProfile.version}</div>
              <div className="text-[12px] text-fg-subtle mt-0.5">
                {styleProfile.sample_count > 0
                  ? `Matched your picks ${styleProfile.match_rate != null ? `${Math.round(styleProfile.match_rate * 100)}%` : '—'} last event · ${styleProfile.sample_count.toLocaleString()} edits learned — it sharpens every shoot.`
                  : 'Starts learning from your first reviewed event, then gets sharper with every shoot.'}
              </div>
            </div>
          </div>
        )}

        {/* Saved workflows — reusable per-client recipes (workflow embedding) */}
        {authed && (
          <div className="card p-4 mb-6">
            <div className="flex items-center justify-between">
              <div className="text-[14px] font-semibold text-fg">Saved workflows</div>
              <button onClick={saveWorkflow} className="text-[12px] font-medium text-accent">Save current setup</button>
            </div>
            {workflows.length === 0 ? (
              <p className="mt-1.5 text-[12px] text-fg-subtle">
                Save an event setup as a reusable per-client workflow — one click to rerun it next time.
              </p>
            ) : (
              <div className="mt-2.5 flex flex-wrap gap-2">
                {workflows.map((w) => (
                  <div key={w.id} className="flex items-center gap-1.5 rounded-lg border border-canvas-border px-2.5 py-1.5">
                    <button onClick={() => applyWorkflow(w)} className="text-[13px] text-fg hover:text-accent">
                      {w.name}{w.client_name ? <span className="text-fg-faint"> · {w.client_name}</span> : null}
                    </button>
                    <button onClick={() => removeWorkflow(w.id)} className="text-fg-faint hover:text-fg" aria-label="Delete workflow">×</button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Assistant — optional, collapsed by default so it doesn't compete with the builder */}
        <div className="card mb-6">
          <button
            onClick={() => setAiOpen((o) => !o)}
            className="flex w-full items-center justify-between gap-2 p-4 text-left"
          >
            <span className="flex items-center gap-2 text-[14px] font-semibold text-fg">
              <Wand2 size={16} className="text-accent" /> Prefer to just describe it? Let the assistant plan the steps
            </span>
            <ChevronDown size={16} className="text-fg-faint" style={{ transform: aiOpen ? 'rotate(180deg)' : undefined }} />
          </button>
          {aiOpen && (
          <div className="px-4 pb-4">
          {authed ? (
            <>
              <textarea
                className={`${inputCls} mt-3 min-h-[64px] resize-y`}
                value={aiGoal}
                onChange={(e) => setAiGoal(e.target.value)}
                placeholder="e.g. Cull the blinks from ~1,800 wedding photos, give them a warm filmic grade, and upscale the 20 hero shots — need it by Friday."
              />
              <div className="mt-3 flex items-center gap-3">
                <button onClick={runAssistant} disabled={aiBusy || !aiGoal.trim()} className="btn-primary">
                  {aiBusy ? 'Planning…' : 'Plan it'}
                </button>
                {aiErr && <span className="text-[13px] text-fg-muted">{aiErr}</span>}
              </div>
              {aiPlan && (
                <div className="mt-4 rounded-lg border px-4 py-3" style={{ borderColor: 'var(--tint-border)', background: 'var(--tint)' }}>
                  <div className="text-[14px] text-fg">{aiPlan.rationale}</div>
                  <ul className="mt-2 space-y-1">
                    {aiPlan.lines.map((l, i) => (
                      <li key={i} className="text-[13px] text-fg-subtle">
                        • <span className="text-fg">{(() => { const id = toTaskId(l.action_id); return id ? TASKS[id].label : l.action_id })()}</span>
                        {l.count != null && ` — ${l.count.toLocaleString()}`}
                        {l.note && <span className="text-fg-faint"> · {l.note}</span>}
                      </li>
                    ))}
                  </ul>
                  <button onClick={applyPlan} className="btn-line mt-3">Use this plan</button>
                </div>
              )}
            </>
          ) : (
            <p className="mt-3 text-[13px] text-fg-muted">
              <a href="/login" className="text-accent font-medium">Sign in</a> to use the assistant.
            </p>
          )}
          </div>
          )}
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* ── Build ─────────────────────────────────────────────── */}
          <div className="card p-7 space-y-6">
            <Field label={`${labels.object} name`}>
              <input
                className={inputCls}
                placeholder={`e.g. ${preset?.label ?? 'Untitled'} · Dec 3`}
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </Field>

            <Field label="Preset" hint="A ready-made recipe — fine-tune the steps below.">
              <div className="grid gap-2">
                {presets.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => setPresetId(p.id)}
                    className="rounded-xl border px-4 py-3 text-left transition-colors"
                    style={presetId === p.id
                      ? { borderColor: 'var(--accent)', background: 'var(--tint)' }
                      : { borderColor: 'var(--border)' }}
                  >
                    <div className="text-[15px] font-medium text-fg">{p.label}</div>
                    <div className="mt-0.5 text-[13px] text-fg-subtle">{p.blurb}</div>
                  </button>
                ))}
              </div>
            </Field>

            {files.length > 0 ? (
              <Field label={`Your ${labels.object.toLowerCase()}`} hint="Counted from your files — nothing to type.">
                <div className="rounded-lg border border-canvas-border bg-canvas-surface px-3 py-2 text-[15px] text-fg">
                  {totalItems.toLocaleString('en-IN')} {totalItems === 1 ? 'frame' : 'frames'} in
                </div>
              </Field>
            ) : (
              <Field label={`How many ${labels.object.toLowerCase()} items?`} hint="An estimate is fine — your files set the real count when you add them.">
                <input
                  type="number"
                  min={0}
                  className={inputCls}
                  value={totalItems || ''}
                  onChange={(e) => setTotalItems(Math.max(0, Math.round(Number(e.target.value) || 0)))}
                  placeholder="e.g. 5000"
                />
              </Field>
            )}

            {totalItems > 0 && dialMode && dials ? (
              <Field
                label="Your gallery"
                hint={`We cull all ${totalItems.toLocaleString('en-IN')} — you choose the finished gallery (±${SLA_DELIVERED_TOLERANCE_PCT}%).`}
              >
                <div className="space-y-3">
                  <div className="rounded-lg border border-canvas-border px-3 py-2.5">
                    <div className="flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        <div className="text-[14px] text-fg">Finished photos</div>
                        <div className="text-[12px] text-fg-faint">The gallery you deliver — we keep the best, drop the rest.</div>
                      </div>
                      <input
                        type="number"
                        min={0}
                        max={totalItems}
                        className={`${inputCls} w-28 text-right`}
                        value={dials.deliveredTarget}
                        onChange={(e) => setDial({ deliveredTarget: Number(e.target.value) })}
                      />
                    </div>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {SLA_DELIVERED_BANDS.map((b) => {
                        const n = Math.round(totalItems * b)
                        const on = dials.deliveredTarget === n
                        return (
                          <button
                            key={b}
                            type="button"
                            onClick={() => setDial({ deliveredTarget: n })}
                            className="rounded-full border px-2.5 py-1 text-[12px] transition-colors"
                            style={on
                              ? { borderColor: 'var(--accent)', background: 'var(--tint)', color: 'var(--accent)' }
                              : { borderColor: 'var(--border)', color: 'var(--fg-subtle)' }}
                          >
                            Top {Math.round(b * 100)}% · {n.toLocaleString('en-IN')}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                  {(preset?.tasks ?? []).some((t) => t.taskId === 'retouch') && (
                    <div className="flex items-center justify-between gap-3 rounded-lg border border-canvas-border px-3 py-2.5">
                      <div className="min-w-0">
                        <div className="text-[14px] text-fg">Hero retouches</div>
                        <div className="text-[12px] text-fg-faint">Full skin & cleanup on your showcase shots · {fmtINR(TASKS.retouch.flatRateInr)} / photo</div>
                      </div>
                      <input
                        type="number"
                        min={0}
                        max={dials.deliveredTarget}
                        className={`${inputCls} w-24 text-right`}
                        value={dials.heroCount}
                        onChange={(e) => setDial({ heroCount: Number(e.target.value) })}
                      />
                    </div>
                  )}
                  {(preset?.tasks ?? []).some((t) => t.taskId === 'enhance') && (
                    <p className="px-1 text-[12px] text-fg-faint">
                      Enhance / upscale is need-based — any finished photo below the quality floor
                      is fixed automatically, priced into the quote.
                    </p>
                  )}
                </div>
              </Field>
            ) : totalItems > 0 && (
              <Field label="Steps" hint="Auto-filled from the preset — edit any count.">
                <div className="space-y-2">
                  {(preset?.tasks ?? []).map((t) => {
                    const def = TASKS[t.taskId]
                    return (
                      <div key={t.taskId} className="flex items-center justify-between gap-3 rounded-lg border border-canvas-border px-3 py-2">
                        <div className="min-w-0">
                          <div className="text-[14px] text-fg">{def.label}</div>
                          <div className="text-[12px] text-fg-faint">{fmtINR(def.flatRateInr)} / {def.unit}</div>
                        </div>
                        <input
                          type="number"
                          min={0}
                          className={`${inputCls} w-24 text-right`}
                          value={counts[t.taskId] ?? 0}
                          onChange={(e) => setCount(t.taskId, Number(e.target.value))}
                        />
                      </div>
                    )
                  })}
                </div>
              </Field>
            )}

            {modelDriven && (
            <Field label="Style / model" hint="A model tuned for your work — or bring your own.">
              <div className="max-h-72 space-y-1 overflow-y-auto rounded-lg border border-canvas-border p-1.5">
                <StyleOption
                  name="Auto — best for each step"
                  blurb="We pick the right model for every step"
                  selected={modelId === ''}
                  onPick={() => setModelId('')}
                />
                {authed && (
                  <>
                    <div className="px-2 pt-2 text-[10px] font-semibold uppercase tracking-wide text-fg-faint">Your models</div>
                    {myModels.length > 0 ? (
                      myModels.map((m) => (
                        <StyleOption
                          key={m.model_id}
                          name={m.name}
                          blurb={m.description || m.base_model}
                          base={m.status === 'ready' ? 'Yours' : m.status}
                          selected={modelId === m.model_id}
                          onPick={() => setModelId(m.model_id)}
                        />
                      ))
                    ) : (
                      <div className="px-2.5 py-1.5 text-[12px] text-fg-subtle">None yet — train or import one in the <a href="/download" target="_blank" rel="noopener noreferrer" className="font-medium text-accent hover:underline">desktop app</a>.</div>
                    )}
                  </>
                )}
                <div className="px-2 pt-2 text-[10px] font-semibold uppercase tracking-wide text-fg-faint">UCIN looks</div>
                {modelsFor(activeVertical).map((m) => (
                  <StyleOption
                    key={m.id}
                    name={m.name}
                    blurb={m.blurb}
                    base={m.base}
                    selected={modelId === m.id}
                    onPick={() => setModelId(m.id)}
                  />
                ))}
              </div>
              <div className="mt-2 flex items-start gap-2 rounded-lg border border-canvas-border px-3 py-2.5">
                <Download size={15} className="mt-0.5 shrink-0 text-accent" />
                <div className="text-[12px] text-fg-subtle">
                  <span className="font-medium text-fg">Train your own style</span> — learn from your past edits or import any Hugging Face model in the{' '}
                  <a href="/download" target="_blank" rel="noopener noreferrer" className="font-medium text-accent hover:underline">UCIN desktop app</a>. It’ll appear here under <span className="text-fg">Your models</span>, on this account.
                </div>
              </div>
            </Field>
            )}

            <Field label="When do you need it?">
              <div className="grid grid-cols-3 gap-2">
                {SPEED_TIERS.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setSpeedId(s.id)}
                    className="rounded-xl border px-3 py-3 text-left transition-colors"
                    style={speedId === s.id
                      ? { borderColor: 'var(--accent)', background: 'var(--tint)' }
                      : { borderColor: 'var(--border)' }}
                  >
                    <div className="flex items-center gap-1.5 text-[14px] font-medium text-fg">
                      <Clock size={13} /> {s.label}
                    </div>
                    <div className="mt-1 text-[12px] leading-snug text-fg-subtle">{s.promise}</div>
                  </button>
                ))}
              </div>
            </Field>

            <Field label="Add-ons" hint="Optional — priced into the quote.">
              <div className="space-y-2">
                {TOGGLES.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setToggles((s) => ({ ...s, [t.id]: !s[t.id] }))}
                    className="flex w-full items-center justify-between gap-3 rounded-xl border px-4 py-3 text-left transition-colors"
                    style={toggles[t.id]
                      ? { borderColor: 'var(--accent)', background: 'var(--tint)' }
                      : { borderColor: 'var(--border)' }}
                  >
                    <div className="min-w-0">
                      <div className="text-[15px] font-medium text-fg">{t.label}</div>
                      <div className="mt-0.5 text-[13px] text-fg-subtle">{t.blurb}</div>
                    </div>
                    <span className="shrink-0 text-[13px]" style={{ color: toggles[t.id] ? 'var(--accent)' : 'var(--fg-faint)' }}>
                      {toggles[t.id] ? 'Added' : t.kind === 'pct' ? `+${Math.round(t.amount * 100)}%` : `+₹${t.amount}`}
                    </span>
                  </button>
                ))}
              </div>
            </Field>
          </div>

          {/* ── Quote ─────────────────────────────────────────────── */}
          <div className="lg:sticky lg:top-8 self-start card p-7"
            style={{ background: 'var(--tint)', borderColor: 'var(--tint-border)' }}>
            <div className="eyebrow mb-4">Your quote</div>

            <div className="display text-fg" style={{ fontSize: 'clamp(2.4rem, 5vw, 3.4rem)' }}>
              {fmtINR(quote.totalInr)}
            </div>
            <p className="mt-1 text-[14px] text-fg-subtle">
              {speed.label} · {speed.promise.toLowerCase()}
            </p>

            <div className="mt-6 space-y-1.5">
              {quote.lines.length === 0 ? (
                <p className="py-6 text-center text-[14px] text-fg-subtle">
                  Pick a preset and enter how many to see the price.
                </p>
              ) : (
                <>
                  {quote.lines.map((l) => (
                    <div key={l.taskId} className="flex items-center justify-between text-[14px]">
                      <span className="text-fg-muted">
                        {l.label} · {l.count.toLocaleString('en-IN')} {l.unit}{l.count !== 1 ? 's' : ''}
                      </span>
                      <span className="text-fg">{fmtINR(l.lineTotal)}</span>
                    </div>
                  ))}
                  <div className="flex items-center justify-between border-t border-canvas-border pt-1.5 text-[14px]">
                    <span className="text-fg-muted">Base fee</span>
                    <span className="text-fg">{fmtINR(quote.baseFeeInr)}</span>
                  </div>
                  {quote.multiplier !== 1 && (
                    <div className="flex items-center justify-between text-[14px]">
                      <span className="text-fg-muted">{speed.label} speed</span>
                      <span className="text-fg">×{quote.multiplier}</span>
                    </div>
                  )}
                  {quote.toggleLines.map((t) => (
                    <div key={t.id} className="flex items-center justify-between text-[14px]">
                      <span className="text-fg-muted">{t.label}</span>
                      <span className="text-fg">{fmtINR(t.amountInr)}</span>
                    </div>
                  ))}
                </>
              )}
            </div>

            <ul className="mt-6 space-y-1.5 text-[12px] text-fg-subtle">
              <li className="flex items-start gap-1.5">
                <ShieldCheck size={13} className="mt-0.5 shrink-0 text-accent" />
                Fixed price — never billed above this
              </li>
              <li className="flex items-start gap-1.5">
                <ShieldCheck size={13} className="mt-0.5 shrink-0 text-accent" />
                Encrypted &amp; India-resident — your work stays yours
              </li>
            </ul>

            {!authed ? (
              <a
                href="/login"
                className={`btn-primary w-full mt-6 ${quote.lines.length === 0 ? 'pointer-events-none opacity-50' : ''}`}
              >
                {quote.lines.length === 0 ? 'Build your quote' : 'Sign in to start'}
                <ArrowRight size={15} />
              </a>
            ) : quote.lines.length === 0 ? (
              <button disabled className="btn-primary w-full mt-6 opacity-50">
                Build your quote <ArrowRight size={15} />
              </button>
            ) : (
              <div className="mt-6 space-y-3">
                <label className="btn-line w-full cursor-pointer">
                  <input
                    type="file"
                    multiple
                    className="hidden"
                    onChange={(e) => { setFiles(Array.from(e.target.files ?? [])); setResult(null); setPhase(null); setSubmitErr('') }}
                  />
                  {files.length
                    ? `${files.length} file${files.length > 1 ? 's' : ''} · ${fmtBytes(batch.totalBytes)}`
                    : 'Add your files'}
                </label>

                {needsDesktop && (
                  <div className="rounded-lg border px-3 py-3" style={{ borderColor: 'var(--tint-border)', background: 'var(--tint)' }}>
                    <div className="text-[13px] font-semibold text-fg">
                      {multiStep
                        ? 'Multi-step builds run in the desktop app.'
                        : batch.reason === 'file-size'
                          ? 'One of your files is too large for the browser.'
                          : 'For your file size we recommend the UCIN Studio desktop app.'}
                    </div>
                    <div className="mt-1 text-[12.5px] text-fg-subtle">
                      {multiStep
                        ? 'This build has more than one step — the desktop app runs the whole pipeline locally.'
                        : batch.reason === 'file-size'
                          ? 'Files over 1 GB each are handled by the desktop app — only tiny proxies ever leave your machine.'
                          : 'Larger batches process cheaper on the desktop — only tiny proxies ever leave your machine.'}
                    </div>
                    <code className="mt-2 block rounded bg-canvas-sunk px-2 py-1.5 mono text-[12px] text-fg">{DESKTOP_INSTALL_CMD}</code>
                    <a
                      href="/download"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-line mt-3 w-full text-[13px]"
                    >
                      How to install the desktop app <ArrowRight size={14} />
                    </a>
                  </div>
                )}

                {phase && !result && <SubmitJourney progress={phase} />}

                {result && (
                  <>
                    <div className="rounded-lg border border-canvas-border px-3 py-3">
                      <div className="text-[13px] font-semibold text-fg">Job {result.status} · {result.jobId.slice(0, 8)}</div>
                      {result.artifacts.length > 0 ? (
                        <ul className="mt-2 space-y-1">
                          {result.artifacts.map((a) => (
                            <li key={a.filename}>
                              <a href={a.download_url} className="link-arrow text-[13px]" download>{a.filename} <Download size={13} /></a>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <div className="mt-1 text-[12.5px] text-fg-subtle">Results will appear here when they&apos;re ready.</div>
                      )}
                    </div>
                    {/* Deliver under the studio's own mark — stamped in-browser. */}
                    {result.artifacts.length > 0 && <BrandStamp artifacts={result.artifacts} />}
                  </>
                )}

                {submitErr && (
                  <div className="text-[13px]" style={{ color: '#c0362c' }}>
                    {submitErr}
                    <div className="mt-0.5 text-fg-faint">Your uploaded files are saved — Resume picks up where it stopped.</div>
                  </div>
                )}

                {canBrowserSubmit && !result && actionId === 'text-to-image' && (
                  <details className="mb-3 text-[13px]">
                    <summary className="cursor-pointer select-none text-fg-subtle">
                      Use your own model (HuggingFace)
                    </summary>
                    <div className="mt-2 space-y-2">
                      <input
                        className="ui-input w-full font-mono text-[13px]"
                        value={hfModel}
                        onChange={(e) => setHfModel(e.target.value)}
                        placeholder="org/model — e.g. stabilityai/sdxl-turbo (empty = our default)"
                      />
                      {hfModel.trim() && (
                        <>
                          <input
                            type="password"
                            autoComplete="off"
                            className="ui-input w-full font-mono text-[13px]"
                            value={hfToken}
                            onChange={(e) => setHfToken(e.target.value)}
                            placeholder="hf_… token — only for a private or gated model"
                          />
                          <p className="text-[11px] text-fg-faint">
                            Sent once over an encrypted connection, used only for your own
                            isolated run, and discarded after. Public models need no token.
                          </p>
                        </>
                      )}
                    </div>
                  </details>
                )}

                {canBrowserSubmit && !result && (
                  <button onClick={runSubmit} disabled={submitting} className={`btn-primary w-full ${submitting ? 'opacity-60' : ''}`}>
                    {submitting ? 'Submitting…' : submitErr ? 'Resume upload' : `Start — ${fmtINR(quote.totalInr)}`}
                    <ArrowRight size={15} />
                  </button>
                )}

                {files.length === 0 && (
                  <p className="text-center text-[12px] text-fg-faint">
                    Add files (up to 5 GB) to submit in the browser — larger or multi-step jobs run in the desktop app.
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}

function Field({ label, hint, children }: { label: string; hint?: string; children: ReactNode }) {
  return (
    <div>
      <label className="text-[13px] font-medium text-fg">{label}</label>
      {hint ? <p className="mb-2 text-[12px] text-fg-faint">{hint}</p> : <div className="mb-2" />}
      {children}
    </div>
  )
}

