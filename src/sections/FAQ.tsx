import { useState } from 'react'
import { Plus, Minus } from 'lucide-react'
import { Reveal } from '@/components/Reveal'

const QA = [
  { q: 'Do I have to manage any technology?', a: 'Never. There are no pipelines to build, no models to train, no servers to run. You work through a simple interface and we handle all of the AI and compute behind it. Managing none of it is the entire point of a production partner.' },
  { q: 'How is it cheaper than the tools I already use?', a: 'You pay per result, and every result is priced 20–40% under the dominant tool in its category — Cloudinary, Remove.bg, AWS, DALL·E. There is no subscription required to start, so you only pay for work we actually deliver.' },
  { q: 'What is Brand-Style?', a: 'Send us a set of your best work and we learn your signature aesthetic — colour, grade, composition. From then on every visual we generate and every batch we finish comes back in your look, automatically. The consistency a brand needs, at the scale a studio runs.' },
  { q: 'Is my work private and secure?', a: 'Yes. Your assets are encrypted before they leave your device and processed on India-resident infrastructure. Your files and your trained styles are yours alone.' },
  { q: 'How much can I process at once?', a: 'Thousands of files in a single batch. We process everything in parallel, so a folder of 5,000 photos finishes in minutes, not days.' },
]

export function FAQ() {
  const [open, setOpen] = useState<number | null>(0)
  return (
    <section className="py-32 sm:py-40">
      <div className="max-w-3xl mx-auto px-6">
        <Reveal className="mb-14">
          <div className="eyebrow mb-5">Questions</div>
          <h2 className="h-display" style={{ fontSize: 'clamp(2.2rem, 5vw, 3.2rem)' }}>Good to know</h2>
        </Reveal>
        <div className="divide-y divide-canvas-border border-y border-canvas-border">
          {QA.map((item, i) => (
            <div key={i}>
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-center justify-between gap-6 py-5 text-left group"
              >
                <span className="text-[17px] font-medium text-fg group-hover:text-plum-600 transition-colors">{item.q}</span>
                {open === i ? <Minus size={18} className="text-plum-600 shrink-0" /> : <Plus size={18} className="text-fg-subtle shrink-0" />}
              </button>
              {open === i && (
                <p className="pb-6 -mt-1 text-[15px] text-fg-subtle leading-relaxed max-w-2xl">{item.a}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
