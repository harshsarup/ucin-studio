import { useQuery } from '@tanstack/react-query'
import {
  ImageUp, Wand2, Scissors, Mic, Languages, FileText, Tags, ScanSearch,
  type LucideIcon,
} from 'lucide-react'
import { Reveal } from '@/components/Reveal'
import { getClientConfig, pricedByAction, fmtINR } from '@/api/config'

type Cat = 'image' | 'generative' | 'audio' | 'text'

const TASKS: { action_id: string; label: string; benefit: string; Icon: LucideIcon; cat: Cat }[] = [
  { action_id: 'upscale',       label: 'Upscale to 4K',      benefit: 'Low-res exports into crisp, print-ready 4K — in bulk.', Icon: ImageUp,    cat: 'image' },
  { action_id: 'text-to-image', label: 'Generate visuals',   benefit: 'Studio-quality images from a folder of prompts.',      Icon: Wand2,      cat: 'generative' },
  { action_id: 'remove-bg',     label: 'Remove backgrounds', benefit: 'Clean cut-outs for products, portraits and catalogs.', Icon: Scissors,   cat: 'image' },
  { action_id: 'transcribe',    label: 'Transcribe audio',   benefit: 'Subtitles and transcripts in 90+ languages.',          Icon: Mic,        cat: 'audio' },
  { action_id: 'translate',     label: 'Translate copy',     benefit: 'Localize captions and scripts across 100+ languages.', Icon: Languages,  cat: 'text' },
  { action_id: 'summarize',     label: 'Summarize',          benefit: 'Long footage notes and docs into crisp key points.',   Icon: FileText,   cat: 'text' },
  { action_id: 'classify-img',  label: 'Auto-tag & sort',    benefit: 'Label and organize thousands of assets in seconds.',   Icon: Tags,       cat: 'image' },
  { action_id: 'detect',        label: 'Detect objects',     benefit: 'Find and label everything across a batch.',            Icon: ScanSearch, cat: 'image' },
]

const ACCENT: Record<Cat, { bg: string; text: string; border: string }> = {
  image:      { bg: 'bg-plum-500/10',    text: 'text-plum-300',  border: 'border-plum-500/20' },
  generative: { bg: 'bg-amber-500/10',   text: 'text-amber-400', border: 'border-amber-500/20' },
  audio:      { bg: 'bg-cyan-500/10',    text: 'text-cyan-400',  border: 'border-cyan-500/20' },
  text:       { bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/20' },
}

export function WhatWeHandle() {
  const { data } = useQuery({ queryKey: ['config'], queryFn: getClientConfig, staleTime: 36e5, retry: 1 })
  const priced = pricedByAction(data?.task_pricing)

  return (
    <section id="handle" className="py-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <Reveal className="max-w-2xl mb-12">
          <div className="eyebrow mb-4">What we handle for you</div>
          <h2 className="font-display font-light text-fg leading-[1.06]" style={{ fontSize: 'clamp(1.9rem, 4vw, 2.9rem)' }}>
            Your whole post-production backlog,<br />
            <span className="text-gradient-plum">off your plate.</span>
          </h2>
          <p className="mt-4 text-fg-muted leading-relaxed">
            Point us at a folder. We process the entire batch in parallel and send back
            finished results — priced per outcome, always under the tool you use today.
          </p>
        </Reveal>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {TASKS.map((t, i) => {
            const p = priced[t.action_id]
            const a = ACCENT[t.cat]
            return (
              <Reveal key={t.action_id} delay={i * 0.05}>
                <div className="card-hover p-4 h-full flex flex-col">
                  <div className={`w-10 h-10 rounded-xl ${a.bg} border ${a.border} flex items-center justify-center mb-3`}>
                    <t.Icon size={17} className={a.text} strokeWidth={1.75} />
                  </div>
                  <div className="text-sm font-semibold text-fg">{t.label}</div>
                  <div className="text-xs text-fg-subtle leading-snug mt-1 flex-1">{t.benefit}</div>
                  {p && (
                    <div className="mt-3 pt-3 border-t border-canvas-border flex items-end justify-between">
                      <div>
                        <span className="text-base font-bold text-fg font-mono">{fmtINR(p.price_inr)}</span>
                        <span className="text-[11px] text-fg-subtle">/{p.unit}</span>
                      </div>
                      {p.discount_pct > 0 && <span className="badge badge-emerald text-[10px] px-1.5 py-0.5">−{p.discount_pct}%</span>}
                    </div>
                  )}
                  {p && p.discount_pct > 0 && (
                    <div className="text-[10px] text-fg-faint mt-1.5">vs {p.competitor} {fmtINR(p.competitor_inr)}</div>
                  )}
                </div>
              </Reveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}
