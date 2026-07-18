import { Reveal } from '@/components/Reveal'
import { SecurityViz } from '@/components/SecurityViz'
import { Lock, KeyRound, MapPin, FileSignature } from 'lucide-react'

// Claims audited 2026-07-18 against the real architecture — each is defensible
// today. What is NOT claimed (deliberately): hardware-enclave / decrypt-in-VRAM
// confidential compute. That attestation isn't live yet; do not add it here or
// in marketing until it is (see OUTCOME_SLA_SPEC / security posture doc).
const POINTS = [
  { icon: Lock, title: 'Encrypted on your device', desc: 'AES-256-GCM before anything is uploaded — the network only ever receives ciphertext, never your files in the clear.' },
  { icon: KeyRound, title: 'A unique key per job', desc: 'Your full-resolution originals stay on your device; only encrypted proxies are sent for processing.' },
  { icon: MapPin, title: 'India-resident', desc: 'Stored and processed in India (Mumbai). Inputs are wiped after delivery.' },
  { icon: FileSignature, title: 'Private processing', desc: 'Add the Private option for dedicated, single-tenant hardware and white-label delivery.' },
]

/** Security section — how the network protects client work, with a flow visual. */
export function Security() {
  return (
    <section id="security" className="py-24 md:py-32 bg-canvas">
      <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
        <Reveal>
          <div className="eyebrow mb-5">Security</div>
          <h2 className="display" style={{ fontSize: 'clamp(2rem, 4.6vw, 3.6rem)' }}>
            Your originals never <span className="text-grad">leave your machine.</span>
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-fg-muted max-w-md">
            Your work is encrypted on your device before it&apos;s ever uploaded — the network
            only ever receives encrypted proxies, never your full-resolution originals — processed
            on India-resident hardware and wiped after delivery.
          </p>
          <div className="mt-8 grid sm:grid-cols-2 gap-x-8 gap-y-6">
            {POINTS.map((p) => (
              <div key={p.title} className="flex gap-3">
                <p.icon size={18} className="mt-0.5 shrink-0 text-accent" />
                <div>
                  <div className="text-[15px] font-semibold text-fg">{p.title}</div>
                  <div className="mt-1 text-[13.5px] leading-relaxed text-fg-subtle">{p.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <SecurityViz />
        </Reveal>
      </div>
    </section>
  )
}
