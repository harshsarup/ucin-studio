import { ArrowLeft } from 'lucide-react'
import { Logo } from '@/components/Logo'
import { Footer } from '@/components/Footer'

/**
 * Privacy summary. NOTE: this is a plain-language summary, not a substitute for
 * counsel-reviewed legal copy — swap the body for your reviewed policy before a
 * formal launch. Content is grounded in claims already made across the site.
 */
export function Privacy() {
  return (
    <div className="min-h-screen bg-canvas">
      <header className="border-b" style={{ borderColor: 'var(--border)' }}>
        <div className="max-w-3xl mx-auto flex h-16 items-center justify-between px-6">
          <a href="/" aria-label="UCIN Studio"><Logo /></a>
          <a href="/" className="flex items-center gap-1.5 text-[14px] font-medium text-fg-subtle hover:text-fg">
            <ArrowLeft size={15} /> Back to site
          </a>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-14">
        <div className="eyebrow mb-4">Legal</div>
        <h1 className="display" style={{ fontSize: 'clamp(2rem, 4.5vw, 3rem)' }}>Privacy</h1>
        <p className="mt-3 text-[13px] text-fg-faint">Last updated 2 July 2026</p>

        <div className="mt-6 rounded-xl border px-4 py-3 text-[13.5px] text-fg-subtle" style={{ borderColor: 'var(--tint-border)', background: 'var(--tint)' }}>
          This is a plain-language summary of how UCIN Studio handles your data. For the full policy,
          email <a href="mailto:hello@ucin.in" className="font-medium text-accent hover:underline">hello@ucin.in</a>.
        </div>

        <div className="mt-10 space-y-8 text-[15px] leading-relaxed text-fg-muted">
          <section>
            <h2 className="text-[17px] font-semibold text-fg mb-2">Your work stays yours</h2>
            <p>Files you process are encrypted on your device with AES-256 before anything is uploaded — your encryption keys never leave your machine, and with the desktop app your full-resolution originals never leave your drive at all. The network only ever handles encrypted ciphertext, in isolation, and it is wiped on delivery.</p>
          </section>
          <section>
            <h2 className="text-[17px] font-semibold text-fg mb-2">What we collect</h2>
            <p>Account details (name, email) to run your account; job metadata (task type, counts, timings) to quote and deliver work and to bill accurately; and basic product analytics to improve the service. We do not sell your data, and we do not use your creative work to train shared models.</p>
          </section>
          <section>
            <h2 className="text-[17px] font-semibold text-fg mb-2">Where it lives</h2>
            <p>Data is processed and stored in-region (India-resident) on UCIN’s SLA-backed compute network. Staged inputs are transient and expire automatically after processing.</p>
          </section>
          <section>
            <h2 className="text-[17px] font-semibold text-fg mb-2">Third parties</h2>
            <p>We rely on infrastructure providers for compute and object storage, and a payment processor for billing. They process data only to provide their service to us, under their own terms.</p>
          </section>
          <section>
            <h2 className="text-[17px] font-semibold text-fg mb-2">Your choices</h2>
            <p>You can request access to, correction of, or deletion of your account data at any time by emailing <a href="mailto:hello@ucin.in" className="font-medium text-accent hover:underline">hello@ucin.in</a>.</p>
          </section>
        </div>

      </main>
      <Footer />
    </div>
  )
}
