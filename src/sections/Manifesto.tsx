import { useRef } from 'react'
import { motion, useScroll, useTransform, useInView } from 'framer-motion'

const ease = [0.16, 1, 0.3, 1] as const

export function Manifesto() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], [50, -50])
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section ref={ref} className="relative py-32 bg-stone-100 dark:bg-stone-800 overflow-hidden">
      
      {/* Subtle background texture */}
      <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]" 
        style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(0,0,0,0.15) 1px, transparent 0)', backgroundSize: '30px 30px' }} />
      
      <motion.div style={{ y }} className="relative max-w-5xl mx-auto px-6">
        
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, ease }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/60 dark:bg-stone-900/60 backdrop-blur-sm text-sm font-medium text-stone-600 dark:text-stone-400 mb-8">
            Our philosophy
          </div>
          
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-light leading-tight text-stone-900 dark:text-stone-100 mb-8"
            style={{ fontFamily: 'ui-serif, Georgia, Cambria, "Times New Roman", Times, serif' }}>
            Creative flow, uninterrupted
          </h2>
          
          <p className="text-xl md:text-2xl text-stone-600 dark:text-stone-400 leading-relaxed max-w-4xl mx-auto">
            Stop waiting for compute. UCIN Studio makes your hardware a supercomputer
            so you can focus on what you do best.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-16 items-center">
          
          {/* Left column – Philosophy */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 1, delay: 0.2, ease }}
            className="space-y-8"
          >
            <div className="space-y-6">
              <h3 className="text-2xl md:text-3xl font-light text-stone-900 dark:text-stone-100"
                style={{ fontFamily: 'ui-serif, Georgia, Cambria, "Times New Roman", Times, serif' }}>
                Your vision, unchained
              </h3>
              <p className="text-lg text-stone-600 dark:text-stone-400 leading-relaxed">
                Every minute spent rendering is a minute not spent creating.
                We remove the bottleneck so your imagination becomes the only limit.
              </p>
            </div>
            
            <div className="space-y-6">
              <h3 className="text-2xl md:text-3xl font-light text-stone-900 dark:text-stone-100"
                style={{ fontFamily: 'ui-serif, Georgia, Cambria, "Times New Roman", Times, serif' }}>
                The UCIN way
              </h3>
              <p className="text-lg text-stone-600 dark:text-stone-400 leading-relaxed">
                Our India‑based post‑production team becomes an extension of your studio.
                Brand‑Style LoRA learns your look, so every frame feels authentically yours.
              </p>
            </div>
          </motion.div>

          {/* Right column – Values */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 1, delay: 0.4, ease }}
            className="space-y-8"
          >
            {[
              {
                title: "Time is creative currency",
                desc: "Every minute spent on technical processing is a minute not spent creating. We give you that time back."
              },
              {
                title: "Style is sacred",
                desc: "Your signature aesthetic is what sets you apart. Our Brand‑Style LoRA learns and preserves your unique vision."
              },
              {
                title: "Deliver with confidence",
                desc: "SLA‑backed delivery means your commitments to clients become our commitments to you. No exceptions."
              }
            ].map((value, i) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.6 + i * 0.1, ease }}
                className="bg-white/60 dark:bg-stone-900/60 backdrop-blur-sm rounded-2xl p-6 border border-stone-200/50 dark:border-stone-700/50"
              >
                <h4 className="text-lg font-medium text-stone-900 dark:text-stone-100 mb-3">
                  {value.title}
                </h4>
                <p className="text-stone-600 dark:text-stone-400 leading-relaxed">
                  {value.desc}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Bottom statement */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, delay: 0.8, ease }}
          className="text-center mt-20"
        >
          <p className="text-xl md:text-2xl font-light text-[#5B3DAF] leading-relaxed"
            style={{ fontFamily: 'ui-serif, Georgia, Cambria, "Times New Roman", Times, serif' }}>
            "Your creativity shouldn't wait for technology."
          </p>
        </motion.div>
      </motion.div>
    </section>
  )
}
