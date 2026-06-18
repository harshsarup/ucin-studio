import { Network, Boxes, ShieldCheck, MapPin } from 'lucide-react'
import { Reveal } from '@/components/Reveal'

const POINTS = [
  {
    Icon: Network,
    title: 'Our own GPU network — not a reseller',
    body: 'Every job runs on UCIN’s SLA-backed compute, not a metered call to someone else’s endpoint. We run the models ourselves on our hardware.',
  },
  {
    Icon: ShieldCheck,
    title: 'Guaranteed completion, not best-effort',
    body: 'The same tiered SLA that powers production AI workloads — a Preemption Shield checkpoints and auto-resumes, so batches finish on a committed deadline.',
  },
  {
    Icon: Boxes,
    title: 'Batch-native, priced from real compute',
    body: 'Thousands of assets processed in parallel. Per-result prices are derived from actual GPU cost — not arbitrary SaaS tiers or per-call API markups.',
  },
  {
    Icon: MapPin,
    title: 'India-resident & encrypted end-to-end',
    body: 'Assets are encrypted client-side and processed on India-resident infrastructure. DISHA-aligned data residency, by default.',
  },
]

const STACK = [
  { label: 'Your assets', sub: 'shoots · catalogs · footage', tone: 'plain' },
  { label: 'UCIN Studio', sub: 'creative layer — upscale · cut-out · generate · transcribe', tone: 'accent' },
  { label: 'SLA-backed compute', sub: 'Flex · Core · Priority — guaranteed completion', tone: 'solid' },
  { label: 'India-resident GPU network', sub: 'Real-ESRGAN · Whisper v3 · FLUX, run on our hardware', tone: 'plain' },
]

export function Foundation() {
  return (
    <section id="foundation" className="py-32 sm:py-40 relative overflow-hidden">
      <div className="absolute inset-0 grid-lines opacity-50" />
      <div className="relative max-w-6xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Left: positioning + points */}
          <div>
            <Reveal>
              <div className="eyebrow mb-5"><span className="dot" /> Why it&apos;s different</div>
              <h2 className="h-display" style={{ fontSize: 'clamp(2.2rem, 5vw, 3.6rem)' }}>
                Most AI tools resell an API.<br /><span className="text-accent">We own the compute.</span>
              </h2>
              <p className="mt-6 text-lg text-fg-muted leading-relaxed max-w-xl">
                UCIN Studio is the creative layer on UCIN’s SLA-backed compute network. That
                foundation is the difference between a thin wrapper and a production platform —
                in reliability, scale, price and privacy.
              </p>
            </Reveal>

            <div className="mt-10 space-y-7">
              {POINTS.map((p, i) => (
                <Reveal key={p.title} delay={0.05 + i * 0.07}>
                  <div className="flex gap-4">
                    <div className="mt-0.5 h-9 w-9 rounded-lg border border-canvas-border bg-canvas-tint flex items-center justify-center shrink-0">
                      <p.Icon size={16} className="text-accent" strokeWidth={1.75} />
                    </div>
                    <div>
                      <div className="text-[15px] font-semibold text-fg">{p.title}</div>
                      <p className="text-sm text-fg-subtle leading-relaxed mt-1">{p.body}</p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>

          {/* Right: the stack */}
          <Reveal delay={0.2}>
            <div className="lg:sticky lg:top-28">
              <div className="mono text-[11px] text-fg-faint mb-3 tracking-wide">THE STACK</div>
              <div className="space-y-2.5">
                {STACK.map((layer, i) => (
                  <div
                    key={layer.label}
                    className="rounded-xl border px-5 py-4 transition-colors"
                    style={
                      layer.tone === 'solid'
                        ? { background: '#6A3CC4', borderColor: '#6A3CC4' }
                        : layer.tone === 'accent'
                          ? { background: 'var(--tint)', borderColor: 'var(--tint-border)' }
                          : { background: 'var(--card)', borderColor: 'var(--border)' }
                    }
                  >
                    <div className="flex items-center justify-between">
                      <span className={`text-sm font-semibold ${layer.tone === 'solid' ? 'text-white' : 'text-fg'}`}>{layer.label}</span>
                      <span className={`mono text-[10px] ${layer.tone === 'solid' ? 'text-white/70' : 'text-fg-faint'}`}>{`0${4 - i}`}</span>
                    </div>
                    <div className={`text-[12px] mt-1 ${layer.tone === 'solid' ? 'text-white/80' : 'text-fg-subtle'}`}>{layer.sub}</div>
                  </div>
                ))}
              </div>
              <p className="mono text-[11px] text-fg-faint mt-4 leading-relaxed">
                You work at the top. We run everything below it.
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
