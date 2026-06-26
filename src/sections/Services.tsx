import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Scissors, Palette, Zap, Layers, Wand2, Image } from 'lucide-react'
import { Reveal } from '@/components/Reveal'

const ease = [0.16, 1, 0.3, 1] as const

const services = [
  { icon: Zap, title: 'AI Upscale', desc: '4K to 8K with detail preservation, no artefacts.' },
  { icon: Scissors, title: 'Background Removal', desc: 'Precision cutouts, even for hair and glass.' },
  { icon: Palette, title: 'Colour Grading', desc: 'LUT matching, cinematic tones, brand‑consistent.' },
  { icon: Wand2, title: 'Generative Fill', desc: 'Inpainting, outpainting, object removal, extensions.' },
  { icon: Layers, title: 'Style Transfer', desc: 'Brand‑Style LoRA learns your look and applies consistently.' },
  { icon: Image, title: 'Batch Processing', desc: 'Hundreds of assets processed overnight with SLA.' },
]

export function Services() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-50px' })

  return (
    <section ref={ref} className="py-32 bg-stone-100 dark:bg-stone-800">
      <div className="max-w-6xl mx-auto px-6">
        <Reveal className="text-center mb-16">
          <div className="text-sm font-medium text-stone-500 dark:text-stone-400 mb-4 tracking-widest uppercase">What we handle</div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-light leading-tight text-stone-900 dark:text-stone-100"
            style={{ fontFamily: 'ui-serif, Georgia, Cambria, "Times New Roman", Times, serif' }}>
            You shoot, we ship.
          </h2>
          <p className="mt-6 text-lg text-stone-600 dark:text-stone-400 leading-relaxed max-w-2xl mx-auto">
            From culling to final delivery, our post‑production pipeline handles everything so you can focus on the art.
          </p>
        </Reveal>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((s, i) => (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: i * 0.08, ease }}
              className="bg-white/60 dark:bg-stone-900/60 backdrop-blur-sm rounded-2xl p-8 border border-stone-200/50 dark:border-stone-700/50"
            >
              <div className="w-12 h-12 rounded-xl bg-[#5B3DAF]/10 flex items-center justify-center mb-6">
                <s.icon size={24} className="text-[#5B3DAF]" />
              </div>
              <h3 className="text-xl font-medium text-stone-900 dark:text-stone-100 mb-3">{s.title}</h3>
              <p className="text-stone-600 dark:text-stone-400 leading-relaxed">{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
