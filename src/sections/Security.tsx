import { Reveal } from '@/components/Reveal'
import { SecurityViz } from '@/components/SecurityViz'
import { Lock, KeyRound, MapPin, FileSignature } from 'lucide-react'

// Claims audited 2026-07-18 against the real architecture (webcrypto.ts +
// attestation.py) — each is backed by shipped code:
//   • AES-256-GCM per-blob, one key per job, ciphertext-only uploads (webcrypto.ts)
//   • the AES key only ever leaves RSA-OAEP-wrapped for the GPU enclave; the
//     control plane stores only the enclave's PUBLIC half (models.EnclaveKey)
//   • Private tier = real NVIDIA CC-mode hardware attestation: the data key is
//     NOT released until a fresh, NVIDIA-signed attestation verifies the GPU
//     (attestation.require_fresh_attestation → 409); customer gets a signed cert.
const POINTS = [
  { icon: Lock, title: 'Encrypted on your device', desc: 'AES-256-GCM before anything is uploaded — the network only ever receives ciphertext, never your files in the clear.' },
  { icon: KeyRound, title: 'Your key stays yours', desc: 'One key per job, minted on your device. It only ever leaves RSA-wrapped for the GPU that runs the work — we hold no copy that can unwrap your files.' },
  { icon: MapPin, title: 'India-resident', desc: 'Stored and processed in India (Mumbai). Inputs are wiped after delivery.' },
  { icon: FileSignature, title: 'Confidential compute', desc: 'Add Private and your job runs inside an NVIDIA-attested hardware enclave — the data-centre operator can’t read it, verified before your key is released, with a signed certificate.' },
]

/** Security section — how the network protects client work, with a flow visual. */
export function Security() {
  return (
    <section id="security" className="py-24 md:py-32 bg-canvas">
      <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
        <Reveal>
          <div className="eyebrow mb-5">Security</div>
          <h2 className="display" style={{ fontSize: 'clamp(2rem, 4.6vw, 3.6rem)' }}>
            The network only ever <span className="text-grad">sees ciphertext.</span>
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-fg-muted max-w-md">
            Your files are encrypted on your device with AES-256 before anything is uploaded —
            the key stays yours, processing runs on India-resident hardware, and inputs are wiped
            after delivery. Choose Private and the work runs inside an NVIDIA-attested hardware
            enclave the operator can&apos;t read.
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
