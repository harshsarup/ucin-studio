import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { HeroDemo } from '@/components/HeroDemo'
import { MeshGradient } from '@/components/MeshGradient'
import { Marquee } from '@/components/Marquee'
import type { Theme } from '@/lib/themes'

const ease = [0.16, 1, 0.3, 1] as const
const SLATE = '#0A1020'
const SUB = '#3D4358'

/**
 * Hero — Stripe-style: an animated mesh gradient with a diagonal cut, crisp dark
 * type, and the product UI floating over the seam. Vibrant but precise.
 */
export function Hero({ palette }: { palette: Theme }) {
  return (
    <section id="top" className="relative" style={{ color: SLATE }}>
      {/* animated mesh gradient band with the signature diagonal */}
      <div className="absolute inset-x-0 top-0 h-[860px] overflow-hidden" style={{ clipPath: 'polygon(0 0, 100% 0, 100% 86%, 0 100%)' }}>
        <MeshGradient base={palette.base} colors={palette.colors} />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 pt-28 pb-24">
        <div className="grid lg:grid-cols-[1fr_1.05fr] gap-12 lg:gap-16 items-center">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.85, ease }}>
            <div className="inline-block mb-5 text-[13px] font-extrabold uppercase tracking-[0.2em]" style={{ color: '#4A2F94' }}>
              Creative production, uncapped:
            </div>
            <h1 style={{ fontFamily: "'Bricolage Grotesque', Inter, sans-serif", fontWeight: 700, letterSpacing: '-0.025em', lineHeight: 1.0, fontSize: 'clamp(2.7rem, 6.2vw, 5.2rem)', color: SLATE }}>
              Because art should never be held back.
            </h1>
            <p className="mt-6 text-[16px] md:text-[17px] max-w-md" style={{ color: '#141824', lineHeight: 1.55 }}>
              The production layer behind ambitious studios, agencies and creators — take on more,
              deliver at any scale, and never compromise your craft.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <a href="/app?signup=1" className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-[15px] font-semibold text-white" style={{ background: palette.accent, boxShadow: `0 14px 30px -10px ${palette.accent}` }}>
                Start creating <ArrowRight size={17} />
              </a>
              <a href="/app" className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-[15px] font-semibold" style={{ background: 'rgba(255,255,255,0.75)', backdropFilter: 'blur(6px)', color: SLATE, boxShadow: '0 8px 22px -12px rgba(10,16,32,0.4)' }}>
                Build a quote
              </a>
            </div>
            <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-2 text-[13px] font-medium" style={{ color: SUB }}>
              <span>Secure</span><span aria-hidden>·</span><span>India-resident</span><span aria-hidden>·</span><span>Never billed above the quote</span>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 26 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.2, ease }} className="relative">
            <HeroDemo />
          </motion.div>
        </div>
      </div>

      <Marquee />
    </section>
  )
}
