import { motion } from 'framer-motion'
import { Check } from 'lucide-react'
import type { SubmitProgress } from '@/lib/browserSubmit'

/**
 * SubmitJourney — the interactive live-progress stepper shown while a browser job
 * submits and runs: Encrypt → Upload → Quote → Audit → Deploy → Seal → Process.
 * Done steps fill + check, the active step pulses and captions what's happening
 * (with an N/M counter for the file-level phases), the rail fills to real progress.
 * Reads the SubmitProgress the submit pipeline emits, so it advances live.
 */
const STEPS: { id: SubmitProgress['phase']; label: string }[] = [
  { id: 'encrypting', label: 'Encrypt' },
  { id: 'uploading', label: 'Upload' },
  { id: 'estimating', label: 'Quote' },
  { id: 'auditing', label: 'Audit' },
  { id: 'deploying', label: 'Deploy' },
  { id: 'sealing', label: 'Seal' },
  { id: 'running', label: 'Process' },
]

const LABELS: Record<SubmitProgress['phase'], string> = {
  encrypting: 'Encrypting on your device', uploading: 'Uploading ciphertext',
  estimating: 'Pricing your job', auditing: 'Security check', deploying: 'Deploying to the network',
  sealing: 'Sealing keys', running: 'Processing on the GPU', done: 'Delivered', error: 'Stopped',
}

export function SubmitJourney({ progress }: { progress: SubmitProgress }) {
  const done = progress.phase === 'done'
  const error = progress.phase === 'error'
  const curIdx = done ? STEPS.length : STEPS.findIndex((s) => s.id === progress.phase)
  const frac = done ? 1 : Math.max(0, curIdx) / (STEPS.length - 1)

  return (
    <div className="rounded-xl border border-canvas-border bg-canvas-surface p-3">
      <div className="relative flex items-start justify-between">
        <div className="absolute left-[7.14%] right-[7.14%] top-[9px] h-0.5 rounded bg-canvas-border" />
        <motion.div
          className="absolute left-[7.14%] top-[9px] h-0.5 rounded"
          style={{ background: error ? 'var(--danger, #dc2626)' : 'var(--accent)' }}
          initial={false}
          animate={{ width: `${frac * 85.71}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />
        {STEPS.map((s, i) => {
          const isDone = done || i < curIdx
          const isActive = !done && !error && i === curIdx
          return (
            <div key={s.id} className="relative z-10 flex w-[14.28%] flex-col items-center gap-1" title={LABELS[s.id]}>
              <motion.div
                initial={false}
                animate={{ scale: isActive ? [1, 1.18, 1] : 1 }}
                transition={isActive ? { repeat: Infinity, duration: 1.6, ease: 'easeInOut' } : { duration: 0.2 }}
                className="flex h-5 w-5 items-center justify-center rounded-full border-2"
                style={{
                  borderColor: isDone || isActive ? 'var(--accent)' : 'var(--canvas-border, #d4d4d8)',
                  background: isDone ? 'var(--accent)' : 'var(--canvas-surface, #fff)',
                  color: '#fff',
                }}
              >
                {isDone ? <Check size={11} strokeWidth={3} />
                  : isActive ? <span className="h-1.5 w-1.5 rounded-full" style={{ background: 'var(--accent)' }} /> : null}
              </motion.div>
              <span className={`text-center text-[9.5px] leading-tight ${isActive ? 'font-medium text-fg' : isDone ? 'text-fg-subtle' : 'text-fg-faint'}`}>
                {s.label}
              </span>
            </div>
          )
        })}
      </div>

      <div className="mt-2 flex items-center gap-2 text-[12px]">
        {!done && !error && <span className="h-1.5 w-1.5 animate-pulse rounded-full" style={{ background: 'var(--accent)' }} />}
        <span className={`font-medium ${error ? 'text-red-500' : 'text-fg'}`}>{LABELS[progress.phase]}</span>
        {progress.message && <span className="truncate text-fg-faint">· {progress.message}</span>}
        {progress.total > 1 && <span className="mono ml-auto shrink-0 text-fg-faint">{progress.done}/{progress.total}</span>}
      </div>
    </div>
  )
}
