import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { ArrowLeft, ArrowRight, CheckCircle2, Mail } from 'lucide-react'
import { Logo } from '@/components/Logo'
import { Footer } from '@/components/Footer'
import { sendContact } from '@/api/contact'

const inputCls =
  'w-full rounded-lg border border-canvas-border bg-canvas-surface px-3 py-2.5 text-[15px] text-fg outline-none focus:border-accent'

const TOPICS: Record<string, { eyebrow: string; heading: string; blurb: string }> = {
  studio: {
    eyebrow: 'For studios & agencies',
    heading: 'Talk to our studio team',
    blurb: 'Tell us about your studio and volume — we’ll set up a shared workspace, SLAs, confidentiality and a named point of contact.',
  },
  enterprise: {
    eyebrow: 'Enterprise',
    heading: 'Talk to us',
    blurb: 'Dedicated capacity, custom SLAs, a Brand-Style library across teams and confidential processing. Tell us what you need.',
  },
  general: {
    eyebrow: 'Contact',
    heading: 'Get in touch',
    blurb: 'Questions about UCIN Studio? Send us a note and we’ll get back to you.',
  },
}

export function Contact() {
  const [params] = useSearchParams()
  const topicKey = params.get('topic') ?? 'general'
  const t = TOPICS[topicKey] ?? TOPICS.general

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [company, setCompany] = useState('')
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')
  const [err, setErr] = useState('')

  const valid = name.trim() && /.+@.+\..+/.test(email) && message.trim()

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!valid) return
    setStatus('sending'); setErr('')
    try {
      await sendContact({ name: name.trim(), email: email.trim(), company: company.trim() || undefined, message: message.trim(), topic: topicKey })
      setStatus('sent')
    } catch (e2) {
      setStatus('error')
      setErr(e2 instanceof Error ? e2.message : 'Could not send — please email hello@ucin.in')
    }
  }

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

      <main className="max-w-xl mx-auto px-6 py-14">
        <div className="eyebrow mb-4">{t.eyebrow}</div>
        <h1 className="display" style={{ fontSize: 'clamp(2rem, 4.5vw, 3rem)' }}>{t.heading}</h1>
        <p className="mt-5 text-lg leading-relaxed text-fg-muted">{t.blurb}</p>

        {status === 'sent' ? (
          <div className="mt-10 rounded-2xl border p-6" style={{ borderColor: 'var(--tint-border)', background: 'var(--tint)' }}>
            <div className="flex items-center gap-2 text-[16px] font-semibold text-fg"><CheckCircle2 size={18} className="text-accent" /> Thanks — we’ve got it.</div>
            <p className="mt-2 text-[14px] text-fg-subtle">We’ll reply to <span className="font-medium text-fg">{email}</span> shortly. In the meantime you can <a href="/app" className="font-medium text-accent hover:underline">build a quote</a>.</p>
          </div>
        ) : (
          <form onSubmit={submit} className="mt-10 space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[13px] font-medium text-fg">Name</label>
                <input className={`${inputCls} mt-1.5`} value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" />
              </div>
              <div>
                <label className="text-[13px] font-medium text-fg">Email</label>
                <input type="email" className={`${inputCls} mt-1.5`} value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@studio.com" />
              </div>
            </div>
            <div>
              <label className="text-[13px] font-medium text-fg">Studio / company <span className="text-fg-faint">(optional)</span></label>
              <input className={`${inputCls} mt-1.5`} value={company} onChange={(e) => setCompany(e.target.value)} placeholder="Studio name" />
            </div>
            <div>
              <label className="text-[13px] font-medium text-fg">How can we help?</label>
              <textarea className={`${inputCls} mt-1.5 min-h-[120px] resize-y`} value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Tell us about your work, volume and timelines." />
            </div>

            {status === 'error' && <p className="text-[13px]" style={{ color: '#c0362c' }}>{err}</p>}

            <button type="submit" disabled={!valid || status === 'sending'} className={`btn-primary ${!valid || status === 'sending' ? 'opacity-60' : ''}`}>
              {status === 'sending' ? 'Sending…' : 'Send message'} <ArrowRight size={15} />
            </button>
            <p className="flex items-center gap-1.5 text-[13px] text-fg-faint">
              <Mail size={13} /> Prefer email? <a href="mailto:hello@ucin.in" className="font-medium text-accent hover:underline">hello@ucin.in</a>
            </p>
          </form>
        )}
      </main>
      <Footer />
    </div>
  )
}
