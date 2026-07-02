import { useState, type ReactNode } from 'react'
import {
  ArrowLeft, Terminal, ShieldCheck, FolderOpen, LogIn, Cpu, Sparkles,
  Download, ExternalLink, CheckCircle2, Boxes,
} from 'lucide-react'
import { Logo } from '@/components/Logo'
import { Footer } from '@/components/Footer'

const INSTALL_CMD = 'npx @ucin-studio/desktop@latest'

/** Reusable copy-to-clipboard command block. */
function CommandBlock({ cmd }: { cmd: string }) {
  const [copied, setCopied] = useState(false)
  const copy = () => {
    navigator.clipboard?.writeText(cmd)
      .then(() => { setCopied(true); setTimeout(() => setCopied(false), 1800) })
      .catch(() => {})
  }
  return (
    <div className="flex items-center justify-between gap-3 rounded-xl border px-4 py-3" style={{ borderColor: 'var(--border)', background: 'var(--sunk)' }}>
      <code className="mono flex items-center gap-2 text-[14px] text-fg">
        <Terminal size={15} className="text-accent shrink-0" /> {cmd}
      </code>
      <button type="button" onClick={copy} className="mono shrink-0 text-[11px] uppercase tracking-[0.12em] hover:opacity-70" style={{ color: copied ? 'var(--accent)' : 'var(--fg-faint)' }}>
        {copied ? 'copied ✓' : 'copy'}
      </button>
    </div>
  )
}

function Step({ n, icon: Icon, title, children }: { n: number; icon: typeof Terminal; title: string; children: ReactNode }) {
  return (
    <div className="flex gap-4">
      <div className="flex flex-col items-center">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[14px] font-semibold" style={{ background: 'var(--tint)', color: 'var(--accent-ink)' }}>{n}</span>
      </div>
      <div className="pb-8 flex-1">
        <div className="flex items-center gap-2 text-[16px] font-semibold text-fg"><Icon size={16} className="text-accent" /> {title}</div>
        <div className="mt-2 text-[14px] leading-relaxed text-fg-subtle space-y-2">{children}</div>
      </div>
    </div>
  )
}

const FEATURES = [
  { icon: FolderOpen, title: 'Watches your catalog', desc: 'Point it at your Lightroom / photo folder — it detects new shoots and prepares them automatically.' },
  { icon: ShieldCheck, title: 'Encrypted on your device', desc: 'AES-256 on-device; your keys never leave your machine and your originals never leave your drive.' },
  { icon: Sparkles, title: 'Train your own style', desc: 'Your edits train a private style model — or import any Hugging Face model into the Model Vault.' },
  { icon: Cpu, title: 'Runs on the network', desc: 'The whole pipeline runs on UCIN’s compute; results sync back to your machine when they’re done.' },
]

/** Complete step-by-step guide to installing the UCIN Creator Studio desktop app. */
export function DesktopDownload() {
  return (
    <div className="min-h-screen bg-canvas">
      {/* minimal header */}
      <header className="border-b" style={{ borderColor: 'var(--border)' }}>
        <div className="max-w-4xl mx-auto flex h-16 items-center justify-between px-6">
          <a href="/" aria-label="UCIN Studio"><Logo /></a>
          <a href="/app" className="flex items-center gap-1.5 text-[14px] font-medium text-fg-subtle hover:text-fg">
            <ArrowLeft size={15} /> Back to the app
          </a>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-14">
        <div className="eyebrow mb-4">Desktop app · Install guide</div>
        <h1 className="display" style={{ fontSize: 'clamp(2.2rem, 5vw, 3.4rem)' }}>
          Install UCIN Creator Studio
        </h1>
        <p className="mt-5 max-w-2xl text-lg leading-relaxed text-fg-muted">
          The desktop app is the fastest, cheapest way to run large or multi-step jobs — it uploads only
          tiny proxies and applies edits to your local originals, so your full-resolution files never
          leave your machine. No installer, no admin rights: one command.
        </p>

        <div className="mt-8">
          <CommandBlock cmd={INSTALL_CMD} />
          <p className="mt-2 text-[13px] text-fg-faint">Works on macOS 12+ and Windows 10+.</p>
        </div>

        {/* Requirements */}
        <div className="mt-12 rounded-2xl border p-6" style={{ borderColor: 'var(--border)', background: 'var(--surface)' }}>
          <div className="flex items-center gap-2 text-[15px] font-semibold text-fg"><Boxes size={16} className="text-accent" /> Before you start</div>
          <ul className="mt-3 space-y-2 text-[14px] text-fg-subtle">
            <li className="flex items-start gap-2">
              <CheckCircle2 size={15} className="mt-0.5 shrink-0 text-accent" />
              <span><span className="font-medium text-fg">Node.js 18 or newer.</span> The command uses <code className="mono text-[13px]">npx</code>, which ships with Node. Don’t have it?{' '}
                <a href="https://nodejs.org/en/download" target="_blank" rel="noopener noreferrer" className="font-medium text-accent hover:underline">Download the LTS installer <ExternalLink size={12} className="inline" /></a>.
              </span>
            </li>
            <li className="flex items-start gap-2"><CheckCircle2 size={15} className="mt-0.5 shrink-0 text-accent" /><span>A <span className="font-medium text-fg">UCIN Studio account</span> — the same one you use here.</span></li>
            <li className="flex items-start gap-2"><CheckCircle2 size={15} className="mt-0.5 shrink-0 text-accent" /><span>Your photos in a local folder (e.g. your Lightroom catalog).</span></li>
          </ul>
        </div>

        {/* Steps */}
        <h2 className="display mt-14 mb-8" style={{ fontSize: 'clamp(1.6rem, 3vw, 2.2rem)' }}>Step by step</h2>
        <div>
          <Step n={1} icon={Download} title="Install Node.js (skip if you have it)">
            <p>Grab the <span className="font-medium text-fg">LTS</span> build from{' '}
              <a href="https://nodejs.org/en/download" target="_blank" rel="noopener noreferrer" className="font-medium text-accent hover:underline">nodejs.org <ExternalLink size={12} className="inline" /></a>{' '}
              and run the installer. To check you have it, run <code className="mono text-[13px]">node -v</code> — it should print v18 or higher.</p>
          </Step>
          <Step n={2} icon={Terminal} title="Open your terminal">
            <p><span className="font-medium text-fg">macOS:</span> open <span className="font-medium text-fg">Terminal</span> (⌘-Space → “Terminal”). <span className="font-medium text-fg">Windows:</span> open <span className="font-medium text-fg">PowerShell</span> (Start → “PowerShell”).</p>
          </Step>
          <Step n={3} icon={Terminal} title="Run one command">
            <p>Paste this and press Enter. It downloads and launches the app — no installer, no admin rights:</p>
            <div className="mt-1"><CommandBlock cmd={INSTALL_CMD} /></div>
            <p className="text-[13px] text-fg-faint">On macOS the first launch may ask you to confirm opening an app downloaded from the internet — click <span className="font-medium">Open</span>.</p>
          </Step>
          <Step n={4} icon={LogIn} title="Sign in">
            <p>Sign in with your UCIN Studio account. Your styles, saved workflows and trained models are on your account, so they show up right away.</p>
          </Step>
          <Step n={5} icon={FolderOpen} title="Point it at your catalog">
            <p>Choose the folder your photos live in. The app watches it for new shoots and prepares them automatically — you don’t have to import anything by hand.</p>
          </Step>
          <Step n={6} icon={Cpu} title="Walk away">
            <p>It encrypts on your device, runs the pipeline on the network, and syncs the finished results back — while your originals never leave your machine.</p>
          </Step>
        </div>

        {/* What you get */}
        <h2 className="display mt-10 mb-6" style={{ fontSize: 'clamp(1.6rem, 3vw, 2.2rem)' }}>What the app does</h2>
        <div className="grid sm:grid-cols-2 gap-x-8 gap-y-6">
          {FEATURES.map((f) => (
            <div key={f.title} className="flex gap-3">
              <f.icon size={18} className="mt-0.5 shrink-0 text-accent" />
              <div>
                <div className="text-[15px] font-semibold text-fg">{f.title}</div>
                <div className="mt-1 text-[13.5px] leading-relaxed text-fg-subtle">{f.desc}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Troubleshooting */}
        <h2 className="display mt-14 mb-6" style={{ fontSize: 'clamp(1.6rem, 3vw, 2.2rem)' }}>Troubleshooting</h2>
        <div className="space-y-4 text-[14px] leading-relaxed text-fg-subtle">
          <div>
            <div className="font-semibold text-fg">“command not found: npx” (or “npx is not recognized”)</div>
            <p className="mt-1">Node.js isn’t installed (or the terminal was open before you installed it). Install Node from{' '}
              <a href="https://nodejs.org/en/download" target="_blank" rel="noopener noreferrer" className="font-medium text-accent hover:underline">nodejs.org</a>, then open a fresh terminal and run the command again.</p>
          </div>
          <div>
            <div className="font-semibold text-fg">macOS blocks the app</div>
            <p className="mt-1">If macOS says the app can’t be opened, go to <span className="font-medium text-fg">System Settings → Privacy &amp; Security</span> and click <span className="font-medium text-fg">Open Anyway</span>.</p>
          </div>
          <div>
            <div className="font-semibold text-fg">Updating</div>
            <p className="mt-1">Run the same command again — <code className="mono text-[13px]">@latest</code> always fetches the newest version.</p>
          </div>
        </div>

        <div className="mt-14 flex flex-wrap gap-3">
          <a href="/app" className="btn-primary">Back to the app</a>
          <a href="/#pricing" className="btn-line">See pricing</a>
        </div>
      </main>
      <Footer />
    </div>
  )
}
