import { useEffect, useState } from 'react'
import { useReducedMotion } from 'framer-motion'

/**
 * Animated CLI — types the npx command, streams the install, and launches.
 * Highlights the "no installer, just npx" story. Loops; reduced-motion settles.
 */
const CMD = 'npx @ucin-studio/desktop@latest'
const LINES: { t: string; c: string }[] = [
  { t: 'added 1 package in 2.1s', c: '#7d8590' },
  { t: '↓  Fetching UCIN Creator Studio…', c: '#7d8590' },
  { t: '⚙  Preparing local runtime…', c: '#7d8590' },
  { t: '✓  Launching — no installer, no security warnings', c: '#3fb950' },
  { t: '●  Signed in · watching /Pictures/2026', c: '#a88ff0' },
]

export function CliInstall() {
  const reduced = useReducedMotion()
  const [typed, setTyped] = useState(reduced ? CMD.length : 0)
  const [lines, setLines] = useState(reduced ? LINES.length : 0)

  useEffect(() => {
    if (reduced) return
    if (typed < CMD.length) {
      const id = setTimeout(() => setTyped((n) => n + 1), 44)
      return () => clearTimeout(id)
    }
    if (lines < LINES.length) {
      const id = setTimeout(() => setLines((n) => n + 1), 650)
      return () => clearTimeout(id)
    }
    const id = setTimeout(() => { setTyped(0); setLines(0) }, 3800)
    return () => clearTimeout(id)
  }, [typed, lines, reduced])

  const cmdDone = typed >= CMD.length

  return (
    <div className="rounded-xl overflow-hidden" style={{ background: '#0D1117', border: '1px solid #20262d', boxShadow: '0 30px 60px -24px rgba(10,16,32,0.55)' }}>
      <div className="flex items-center gap-2 px-4 py-2.5" style={{ borderBottom: '1px solid #20262d' }}>
        <span className="flex gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full" style={{ background: '#ff5f57' }} />
          <span className="h-2.5 w-2.5 rounded-full" style={{ background: '#febc2e' }} />
          <span className="h-2.5 w-2.5 rounded-full" style={{ background: '#28c840' }} />
        </span>
        <span className="mono text-[11px] ml-2" style={{ color: '#7d8590' }}>zsh — ~/studio</span>
      </div>
      <div className="p-4 mono text-[12.5px] leading-relaxed min-h-[168px]">
        <div style={{ color: '#e6edf3' }}>
          <span style={{ color: '#3fb950' }}>$</span> {CMD.slice(0, typed)}
          {!reduced && !cmdDone && <span className="inline-block w-[7px] h-[14px] align-[-2px]" style={{ background: '#e6edf3' }} />}
        </div>
        {LINES.slice(0, lines).map((l, i) => (
          <div key={i} style={{ color: l.c }} className="mt-1.5">{l.t}</div>
        ))}
      </div>
    </div>
  )
}
