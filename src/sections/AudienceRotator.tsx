import { useEffect, useState } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { Reveal } from '@/components/Reveal'
import { BeforeAfter } from '@/components/BeforeAfter'
import { pxSrc } from '@/lib/samples'

// Same relevant image for both sides; the "before" is dulled via filter to read as raw.
const RAW = 'grayscale(1) brightness(0.82) contrast(0.94)'
const AUD = [
  { word: 'photographers', line: 'Weddings, portraits and events — culled, graded and finished in your signature style.', img: pxSrc('8869381') },
  { word: 'agencies', line: 'On-brand campaign visuals, generated and retouched at volume, on deadline.', img: pxSrc('1834396') },
  { word: 'brands', line: 'Catalogs cut out and standardised, plus lifestyle scenes and social — at volume.', img: pxSrc('31213033') },
  { word: 'creators', line: 'Grade, generate and subtitle for every channel — the moment the content drops.', img: pxSrc('1368384') },
]

/** Rotating audience headline with a per-category sliding before/after. */
export function AudienceRotator() {
  const reduced = useReducedMotion()
  const [i, setI] = useState(0)
  useEffect(() => {
    if (reduced) return
    const id = setInterval(() => setI((v) => (v + 1) % AUD.length), 4600)
    return () => clearInterval(id)
  }, [reduced])
  const a = AUD[i]
  const ease = [0.16, 1, 0.3, 1] as const

  return (
    <section className="py-24 md:py-32 bg-canvas-sunk overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-[0.85fr_1.15fr] gap-12 lg:gap-16 items-center">
        {/* left — rotating audience headline */}
        <div>
          <Reveal><div className="eyebrow mb-6">In good company</div></Reveal>
          <h2 className="display" style={{ fontSize: 'clamp(2.2rem, 5vw, 4rem)' }}>
            Trusted by{' '}
            <AnimatePresence mode="wait">
              <motion.span key={a.word} className="text-grad inline-block"
                initial={reduced ? false : { opacity: 0, y: '0.35em' }} animate={{ opacity: 1, y: 0 }} exit={reduced ? undefined : { opacity: 0, y: '-0.35em' }} transition={{ duration: 0.4, ease }}>
                {a.word}.
              </motion.span>
            </AnimatePresence>
          </h2>
          <div className="mt-6 min-h-[80px] max-w-md">
            <AnimatePresence mode="wait">
              <motion.p key={a.line} className="text-[16px] md:text-[17px] leading-relaxed" style={{ color: '#33384A' }}
                initial={reduced ? false : { opacity: 0 }} animate={{ opacity: 1 }} exit={reduced ? undefined : { opacity: 0 }} transition={{ duration: 0.4 }}>
                {a.line}
              </motion.p>
            </AnimatePresence>
          </div>
        </div>

        {/* right — per-category sliding before/after */}
        <div style={{ filter: 'drop-shadow(0 40px 80px -30px rgba(10,16,32,0.35))' }}>
          <AnimatePresence mode="wait">
            <motion.div key={a.word} initial={reduced ? false : { opacity: 0, scale: 0.99 }} animate={{ opacity: 1, scale: 1 }} exit={reduced ? undefined : { opacity: 0 }} transition={{ duration: 0.35, ease }}>
              <BeforeAfter before={a.img} after={a.img} beforeFilter={RAW} beforeLabel="Original" afterLabel="Enhanced" noSweep />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}
