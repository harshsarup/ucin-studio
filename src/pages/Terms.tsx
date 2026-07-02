import { ArrowLeft } from 'lucide-react'
import { Logo } from '@/components/Logo'
import { Footer } from '@/components/Footer'

/**
 * Terms summary. NOTE: plain-language summary, not counsel-reviewed legal copy —
 * replace with your reviewed terms before a formal launch. Grounded in the
 * pricing/ownership claims already made across the site.
 */
export function Terms() {
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
        <h1 className="display" style={{ fontSize: 'clamp(2rem, 4.5vw, 3rem)' }}>Terms</h1>
        <p className="mt-3 text-[13px] text-fg-faint">Last updated 2 July 2026</p>

        <div className="mt-6 rounded-xl border px-4 py-3 text-[13.5px] text-fg-subtle" style={{ borderColor: 'var(--tint-border)', background: 'var(--tint)' }}>
          This is a plain-language summary of the terms for using UCIN Studio. For the full agreement,
          email <a href="mailto:hello@ucin.in" className="font-medium text-accent hover:underline">hello@ucin.in</a>.
        </div>

        <div className="mt-10 space-y-8 text-[15px] leading-relaxed text-fg-muted">
          <section>
            <h2 className="text-[17px] font-semibold text-fg mb-2">The service</h2>
            <p>UCIN Studio is a per-event creative production layer on UCIN’s SLA-backed compute network. You submit work, we return finished results. You’re responsible for keeping your account credentials secure.</p>
          </section>
          <section>
            <h2 className="text-[17px] font-semibold text-fg mb-2">Pricing &amp; billing</h2>
            <p>You pay per event, at the fixed price quoted before work begins — you are never billed above the quote. There are no subscriptions and no monthly minimums. Quotes are shown in full before you commit.</p>
          </section>
          <section>
            <h2 className="text-[17px] font-semibold text-fg mb-2">Your content &amp; outputs</h2>
            <p>You retain full ownership of the work you submit and of the finished results we return. You grant us only the limited, temporary permission needed to process and deliver your job. We don’t use your work to train shared models.</p>
          </section>
          <section>
            <h2 className="text-[17px] font-semibold text-fg mb-2">Acceptable use</h2>
            <p>Don’t submit unlawful content or work you don’t have the rights to, and don’t attempt to disrupt or reverse-engineer the service. We may decline or halt jobs that violate these terms.</p>
          </section>
          <section>
            <h2 className="text-[17px] font-semibold text-fg mb-2">Availability &amp; liability</h2>
            <p>Speed tiers carry the SLA shown at quote time. Otherwise the service is provided “as is”, and our liability is limited to the amount you paid for the affected job. We may update these terms; material changes will be posted here.</p>
          </section>
          <section>
            <h2 className="text-[17px] font-semibold text-fg mb-2">Contact</h2>
            <p>Questions about these terms? Email <a href="mailto:hello@ucin.in" className="font-medium text-accent hover:underline">hello@ucin.in</a>.</p>
          </section>
        </div>

      </main>
      <Footer />
    </div>
  )
}
