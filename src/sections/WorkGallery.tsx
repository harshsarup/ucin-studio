import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { BeforeAfter } from '@/components/BeforeAfter'
import { BEFORE_AFTER } from '@/lib/samples'
import { Reveal } from '@/components/Reveal'

const ease = [0.16, 1, 0.3, 1] as const

export function WorkGallery() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-50px' })

  return (
    <section ref={ref} className="py-32 bg-stone-50 dark:bg-stone-950">
      <div className="max-w-6xl mx-auto px-6">
        <Reveal className="max-w-3xl mb-16">
          <div className="text-sm font-medium text-stone-500 dark:text-stone-400 mb-4 tracking-widest uppercase">The work</div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-light leading-tight text-stone-900 dark:text-stone-100"
            style={{ fontFamily: 'ui-serif, Georgia, Cambria, "Times New Roman", Times, serif' }}>
            Proof, not promises.
          </h2>
          <p className="mt-6 text-lg text-stone-600 dark:text-stone-400 leading-relaxed max-w-xl">
            Thousands of finished assets – upscaled, cut out, generated, restored, graded to your style. Every frame, production‑ready.
          </p>
        </Reveal>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {BEFORE_AFTER.map((sample, i) => (
            <motion.div
              key={sample.id}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: i * 0.1, ease }}
              className="rounded-2xl overflow-hidden bg-white dark:bg-stone-900 shadow-lg shadow-stone-900/5"
            >
              <BeforeAfter before={sample.before} after={sample.after} />
              <div className="p-4">
                <p className="text-sm text-stone-600 dark:text-stone-400">{sample.caption}</p>
                <span className="text-xs text-stone-400">{sample.label}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
