import { Reveal } from '@/components/Reveal'
import { SecurityViz } from '@/components/SecurityViz'
import { Lock, KeyRound, MapPin, FileSignature } from 'lucide-react'

// NOTE: confirm each claim matches the real architecture before shipping.
const POINTS = [
  { icon: Lock, title: 'Encrypted on your device', desc: 'AES-256 before anything leaves — only encrypted ciphertext is ever uploaded.' },
  { icon: KeyRound, title: 'Your keys stay with you', desc: 'Encryption keys never leave your machine — your originals stay on your drive.' },
  { icon: MapPin, title: 'India-resident data', desc: 'Processed and stored in-region, in isolation, and wiped on delivery.' },
  { icon: FileSignature, title: 'NDA-ready', desc: 'Confidentiality and white-label built in — for your most sensitive clients.' },
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
            Work is encrypted on your device before it&apos;s ever uploaded. The network runs on
            ciphertext it processes in isolation — then wipes on delivery.
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
