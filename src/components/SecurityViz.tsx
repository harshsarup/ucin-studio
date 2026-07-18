import { motion, useReducedMotion } from 'framer-motion'
import { HardDrive, KeyRound, Cpu, Lock } from 'lucide-react'

/**
 * Security flow: originals + keys stay on the device; only encrypted ciphertext
 * travels to the network, which processes in isolation and wipes on delivery.
 * NOTE: verify the exact claims match the real architecture before shipping.
 */
export function SecurityViz() {
  const reduced = useReducedMotion()
  return (
    <div className="relative mx-auto w-full max-w-md">
      <div className="pointer-events-none absolute inset-0" style={{ background: 'radial-gradient(closest-side, rgba(124,79,255,0.13), transparent 72%)' }} />

      <div className="relative z-10 flex items-stretch gap-2">
        {/* your device */}
        <div className="flex-1 rounded-2xl border bg-canvas-card p-4 text-center" style={{ borderColor: 'var(--border)', boxShadow: '0 24px 55px -28px var(--shadow)' }}>
          <span className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl" style={{ background: 'var(--tint)' }}><HardDrive size={18} className="text-accent" /></span>
          <div className="mt-2.5 text-[13px] font-semibold text-fg">Your device</div>
          <div className="mt-2 inline-flex items-center gap-1.5 mono text-[9px] uppercase tracking-[0.1em] text-fg-subtle"><KeyRound size={11} className="text-accent" /> Originals stay here</div>
          <div className="mt-1 mono text-[9px] uppercase tracking-[0.1em] text-fg-faint">Originals never leave</div>
        </div>

        {/* encrypted transit */}
        <div className="relative flex w-16 shrink-0 flex-col items-center justify-center">
          <div className="absolute top-1/2 left-1 right-1 border-t border-dashed" style={{ borderColor: 'var(--tint-border)' }} />
          <motion.span
            className="relative flex h-7 w-7 items-center justify-center rounded-md text-white"
            style={{ background: 'linear-gradient(135deg, #7C4FFF, #A855F7)', boxShadow: '0 8px 18px -8px rgba(124,79,255,0.7)' }}
            initial={{ x: -22, opacity: 0 }}
            animate={reduced ? { x: 0, opacity: 1 } : { x: [-22, 22], opacity: [0, 1, 1, 0] }}
            transition={reduced ? { duration: 0 } : { duration: 2.6, repeat: Infinity, ease: 'easeInOut' }}
          >
            <Lock size={13} />
          </motion.span>
          <span className="absolute -bottom-1 mono text-[8px] uppercase tracking-[0.1em] text-fg-faint">ciphertext</span>
        </div>

        {/* network */}
        <div className="flex-1 rounded-2xl border bg-canvas-card p-4 text-center" style={{ borderColor: 'var(--border)', boxShadow: '0 24px 55px -28px var(--shadow)' }}>
          <span className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl" style={{ background: 'var(--tint)' }}><Cpu size={18} className="text-accent" /></span>
          <div className="mt-2.5 text-[13px] font-semibold text-fg">UCIN network</div>
          <div className="mt-2 inline-flex items-center gap-1.5 mono text-[9px] uppercase tracking-[0.1em] text-fg-subtle"><Lock size={11} className="text-accent" /> Encrypted only</div>
          <div className="mt-1 mono text-[9px] uppercase tracking-[0.1em] text-fg-faint">Isolated · wiped on delivery</div>
        </div>
      </div>

      <div className="relative z-10 mt-5 text-center">
        <div className="mono text-[11px] uppercase tracking-[0.14em] text-fg-subtle">Encrypted before it ever leaves</div>
        <div className="mono text-[10px] uppercase tracking-[0.12em] text-fg-faint mt-1.5">Your full-res originals never leave your device</div>
      </div>
    </div>
  )
}
