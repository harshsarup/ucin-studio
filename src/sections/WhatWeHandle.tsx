import { useQuery } from '@tanstack/react-query'
import {
  ImageUp, Wand2, Scissors, Mic, Languages, FileText, Tags, ScanSearch,
  type LucideIcon,
} from 'lucide-react'
import { Reveal } from '@/components/Reveal'
import { getClientConfig, pricedByAction, fmtINR } from '@/api/config'

const TASKS: { action_id: string; label: string; benefit: string; Icon: LucideIcon }[] = [
  { action_id: 'upscale',       label: 'Upscale to 4K',      benefit: 'Low-res exports into crisp, print-ready 4K.', Icon: ImageUp },
  { action_id: 'text-to-image', label: 'Generate visuals',   benefit: 'Studio-quality images from your prompts.',    Icon: Wand2 },
  { action_id: 'remove-bg',     label: 'Remove backgrounds', benefit: 'Clean cut-outs for an entire catalog.',       Icon: Scissors },
  { action_id: 'transcribe',    label: 'Transcribe audio',   benefit: 'Subtitles and transcripts, 90+ languages.',   Icon: Mic },
  { action_id: 'translate',     label: 'Translate copy',     benefit: 'Localize across 100+ languages.',             Icon: Languages },
  { action_id: 'summarize',     label: 'Summarize',          benefit: 'Long notes and scripts into key points.',     Icon: FileText },
  { action_id: 'classify-img',  label: 'Auto-tag & sort',    benefit: 'Organize thousands of assets in seconds.',    Icon: Tags },
  { action_id: 'detect',        label: 'Detect objects',     benefit: 'Find and label everything in a batch.',       Icon: ScanSearch },
]

export function WhatWeHandle() {
  const { data } = useQuery({ queryKey: ['config'], queryFn: getClientConfig, staleTime: 36e5, retry: 1 })
  const priced = pricedByAction(data?.task_pricing)

  return (
    <section id="handle" className="py-32 sm:py-40">
      <div className="max-w-6xl mx-auto px-6">
        <Reveal className="max-w-3xl mb-16">
          <div className="eyebrow mb-5">What we handle</div>
          <h2 className="h-display" style={{ fontSize: 'clamp(2.2rem, 5vw, 3.6rem)' }}>
            We handle the grind.<br /><span className="text-fg-subtle">You keep the craft.</span>
          </h2>
          <p className="mt-6 text-lg text-fg-muted leading-relaxed max-w-xl">
            Point us at a folder. We finish the whole batch in parallel and send it back —
            every result priced below the tool you use today.
          </p>
        </Reveal>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-px rounded-3xl overflow-hidden" style={{ background: '#1C1726' }}>
          {TASKS.map((t, i) => {
            const p = priced[t.action_id]
            return (
              <Reveal key={t.action_id} delay={i * 0.04}>
                <div className="group h-full p-7 transition-colors duration-500" style={{ background: '#0F0D15' }}>
                  <t.Icon size={22} className="text-plum-300 mb-5" strokeWidth={1.5} />
                  <div className="text-[15px] font-semibold text-fg">{t.label}</div>
                  <div className="text-sm text-fg-subtle leading-snug mt-1.5">{t.benefit}</div>
                  {p && (
                    <div className="mt-5 text-sm">
                      <span className="font-semibold text-fg">{fmtINR(p.price_inr)}</span>
                      <span className="text-fg-subtle"> / {p.unit}</span>
                      {p.discount_pct > 0 && (
                        <span className="text-fg-faint"> · {p.discount_pct}% under {p.competitor}</span>
                      )}
                    </div>
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
