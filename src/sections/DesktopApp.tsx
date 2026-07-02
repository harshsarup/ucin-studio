import { useState } from 'react'
import { Reveal } from '@/components/Reveal'
import { CliInstall } from '@/components/CliInstall'
import {
  ShieldCheck, Sparkles, Activity, Folder, Terminal,
  LayoutDashboard, Plus, Briefcase, Star, Box, ArrowRight,
} from 'lucide-react'

const NAV = [
  { icon: LayoutDashboard, label: 'Dashboard' },
  { icon: Plus, label: 'New event' },
  { icon: Folder, label: 'Watched folders', active: true },
  { icon: Briefcase, label: 'Jobs' },
  { icon: Star, label: 'Review' },
  { icon: Box, label: 'Model vault' },
]

const FEATURES = [
  { icon: Folder, title: 'Watches your catalog', desc: 'Point it at your Lightroom folder — it detects new shoots and extracts tiny proxies automatically.' },
  { icon: ShieldCheck, title: 'Secure on your device', desc: 'AES-256 encryption on-device; your keys never leave your machine. Only ciphertext is ever uploaded.' },
  { icon: Sparkles, title: 'Train your own style', desc: 'Your edits train a private style model in the Model Vault — or import any Hugging Face model.' },
  { icon: Activity, title: 'Real telemetry', desc: 'Live progress and price straight from the network — never a synthetic spinner.' },
]

/**
 * Desktop app promo — leads with the no-installer `npx` install (animated CLI),
 * then the app it launches into. Local catalog watching, on-device encryption,
 * style training, the "local supercomputer" bridge.
 */
const INSTALL_CMD = 'npx @ucin-studio/desktop@latest'

export function DesktopApp() {
  const [copied, setCopied] = useState(false)
  const copyInstall = () => {
    navigator.clipboard?.writeText(INSTALL_CMD)
      .then(() => { setCopied(true); setTimeout(() => setCopied(false), 1800) })
      .catch(() => {})
  }
  return (
    <section id="desktop" className="relative overflow-hidden bg-canvas">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[540px]" style={{ background: 'radial-gradient(55% 60% at 72% 0%, var(--glow), transparent 72%)' }} />
      <div className="relative max-w-7xl mx-auto px-6 py-28 md:py-36 grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
        {/* copy */}
        <div>
          <Reveal><div className="eyebrow mb-5">The desktop app</div></Reveal>
          <Reveal delay={0.05}>
            <h2 className="display" style={{ fontSize: 'clamp(2.2rem, 5vw, 4rem)' }}>Point it at your catalog. Walk away.</h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-6 text-lg leading-relaxed text-fg-muted max-w-md">
              UCIN Creator Studio turns your laptop into a supercomputer — it watches your local
              library, encrypts on-device, and runs the whole pipeline on the network while your
              originals never leave your machine.
            </p>
          </Reveal>

          <Reveal delay={0.13} className="mt-5">
            <a href="/download" className="link-arrow">Read the installation guide <ArrowRight size={15} /></a>
          </Reveal>

          {/* install callout — no installer, just npx */}
          <Reveal delay={0.16}>
            <div className="mt-7 rounded-xl border overflow-hidden" style={{ borderColor: 'var(--border)' }}>
              <div className="flex items-center justify-between gap-3 px-4 py-3" style={{ background: 'var(--sunk)' }}>
                <code className="mono text-[13.5px] text-fg flex items-center gap-2">
                  <Terminal size={14} className="text-accent" /> {INSTALL_CMD}
                </code>
                <button type="button" onClick={copyInstall} className="mono text-[10px] uppercase tracking-[0.12em] shrink-0 hover:opacity-70" style={{ color: copied ? 'var(--accent)' : 'var(--fg-faint)' }}>
                  {copied ? 'copied ✓' : 'copy'}
                </button>
              </div>
              <div className="px-4 py-2.5 text-[12.5px] text-fg-subtle border-t" style={{ borderColor: 'var(--border)' }}>
                No installer. Just one command — macOS &amp; Windows.
              </div>
            </div>
          </Reveal>

          <div className="mt-7 grid sm:grid-cols-2 gap-x-8 gap-y-5">
            {FEATURES.map((f, i) => (
              <Reveal key={f.title} delay={0.2 + i * 0.06}>
                <div className="flex gap-3">
                  <f.icon size={18} className="mt-0.5 shrink-0 text-accent" />
                  <div>
                    <div className="text-[15px] font-semibold text-fg">{f.title}</div>
                    <div className="mt-1 text-[13.5px] leading-relaxed text-fg-subtle">{f.desc}</div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>

        {/* right — install, then the app it opens */}
        <Reveal delay={0.15}>
          <CliInstall />
          <div className="mt-4 rounded-xl border overflow-hidden" style={{ borderColor: 'var(--border)', boxShadow: '0 24px 60px -28px var(--shadow)' }}>
            <div className="flex items-center gap-2 border-b px-4 py-2.5" style={{ borderColor: 'var(--border)' }}>
              <span className="flex gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full" style={{ background: '#ff5f57' }} />
                <span className="h-2.5 w-2.5 rounded-full" style={{ background: '#febc2e' }} />
                <span className="h-2.5 w-2.5 rounded-full" style={{ background: '#28c840' }} />
              </span>
              <span className="mono text-[11px] tracking-wide text-fg-faint ml-2">UCIN Creator Studio</span>
            </div>
            <div className="grid grid-cols-[140px_1fr]">
              <div className="border-r p-2.5 space-y-0.5" style={{ borderColor: 'var(--border)' }}>
                {NAV.map((n) => (
                  <div key={n.label} className="flex items-center gap-2 rounded-md px-2.5 py-1.5 text-[12px]"
                    style={n.active ? { background: 'var(--tint)', color: 'var(--fg)' } : { color: 'var(--fg-subtle)' }}>
                    <n.icon size={13} /> {n.label}
                  </div>
                ))}
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between">
                  <span className="text-[13px] font-semibold text-fg">Watched · /Pictures/2026</span>
                  <span className="inline-flex items-center gap-1.5 mono text-[10px] uppercase tracking-wide" style={{ color: 'var(--accent)' }}>
                    <ShieldCheck size={12} /> Secure
                  </span>
                </div>
                <div className="mt-3 rounded-lg border p-3" style={{ borderColor: 'var(--border)', background: 'var(--surface)' }}>
                  <div className="flex items-center justify-between text-[12px]">
                    <span className="text-fg">Wedding — Dec 3 · 1,842 frames</span>
                    <span className="mono text-fg-faint">64%</span>
                  </div>
                  <div className="mt-2 h-1.5 w-full rounded-full" style={{ background: 'var(--sunk)' }}>
                    <div className="h-full rounded-full" style={{ width: '64%', background: 'var(--accent)' }} />
                  </div>
                  <div className="mt-2 mono text-[10px] text-fg-faint">Encrypting &amp; uploading proxies</div>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
