import { useState } from 'react'
import { Plus, Minus } from 'lucide-react'
import { Reveal } from '@/components/Reveal'

const QA = [
  { q: 'Do I need any software or technical setup?', a: 'No. There is nothing to install and no infrastructure to manage. You send us your files through the browser, pick what you want done, and download the finished results. We handle all the AI and compute behind the scenes.' },
  { q: 'How is it cheaper than the tools I already use?', a: 'You pay per result — and every result is priced 20–40% under the dominant tool in its category (Cloudinary, Remove.bg, AWS, DALL·E). No subscription is required to start, so you only pay for what we actually deliver.' },
  { q: 'What is Brand-Style?', a: 'Upload a set of your best work and we learn your signature aesthetic — colour, grade, composition. Then every generated visual and every batch we finish comes back in your look, automatically. It is the consistency a brand needs at the scale a studio runs.' },
  { q: 'Is my work private and secure?', a: 'Yes. Your assets are encrypted before they leave your device and processed on India-resident infrastructure. Your files and your trained styles are yours alone.' },
  { q: 'How many files can I process at once?', a: 'Thousands. We process your batch in parallel, so a folder of 5,000 photos finishes in minutes, not days.' },
]

export function FAQ() {
  const [open, setOpen] = useState<number | null>(0)
  return (
    <section className="py-24 relative">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <Reveal className="text-center mb-12">
          <div className="eyebrow mb-4 justify-center flex">Questions</div>
          <h2 className="font-display font-light text-fg leading-[1.06]" style={{ fontSize: 'clamp(1.9rem, 4vw, 2.7rem)' }}>
            Good to know
          </h2>
        </Reveal>
        <div className="space-y-3">
          {QA.map((item, i) => (
            <Reveal key={i} delay={i * 0.05}>
              <div className="card overflow-hidden">
                <button
                  onClick={() => setOpen(open === i ? null : i)}
                  className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left"
                >
                  <span className="text-sm font-medium text-fg">{item.q}</span>
                  {open === i ? <Minus size={16} className="text-plum-300 shrink-0" /> : <Plus size={16} className="text-fg-subtle shrink-0" />}
                </button>
                {open === i && (
                  <div className="px-5 pb-4 text-sm text-fg-subtle leading-relaxed">{item.a}</div>
                )}
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
