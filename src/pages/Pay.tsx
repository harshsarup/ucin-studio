import { useEffect, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { openCashfreeCheckout } from '@/lib/cashfreeCheckout'

/**
 * /pay — a headless host for the shared, custom-branded Cashfree checkout
 * (lib/cashfreeCheckout.ts). It exists so surfaces that can't run Cashfree
 * Elements in-page — notably the desktop app, whose renderer is a file:// origin
 * where Elements iframes are unproven — can open THIS route in a window and get
 * the exact same branded modal over an https origin.
 *
 * Contract (query params):
 *   session   — Cashfree payment_session_id   (required)
 *   env       — 'sandbox' | 'production'       (required)
 *   amt       — amount in INR                  (required, for display)
 *   job       — job id                         (optional, display only)
 *   merchant, subtitle, note — optional sidebar copy overrides
 *
 * On completion it navigates to a sentinel URL the desktop's checkout window
 * intercepts (studioCheckout.ts): success → https://ucin.pay/success, otherwise
 * https://ucin.pay/cancel. In a plain browser those sentinels simply don't
 * resolve — harmless, because this route is only meaningfully used by the app
 * window that watches for them.
 */
const SUCCESS = 'https://ucin.pay/success'
const CANCEL = 'https://ucin.pay/cancel'

export function Pay() {
  const [params] = useSearchParams()
  const [error, setError] = useState<string | null>(null)
  // StrictMode double-invokes effects in dev; guard so we never open two modals.
  const started = useRef(false)

  useEffect(() => {
    if (started.current) return
    started.current = true

    const session = params.get('session') ?? ''
    const env = (params.get('env') === 'production' ? 'production' : 'sandbox') as 'sandbox' | 'production'
    const amt = Number(params.get('amt') ?? '0')

    if (!session || !amt || amt <= 0) {
      setError('This payment link is missing its order details.')
      return
    }

    void openCashfreeCheckout({
      mode: env,
      paymentSessionId: session,
      amountInr: amt,
      merchant: params.get('merchant') || 'UCIN Studio',
      subtitle: params.get('subtitle') || 'Creative studio · pay per job',
      note: params.get('note') || 'Fixed — never billed above',
    })
      .then((r) => {
        window.location.href = r === 'success' ? SUCCESS : CANCEL
      })
      .catch(() => {
        window.location.href = CANCEL
      })
  }, [params])

  return (
    <div className="min-h-screen flex items-center justify-center bg-canvas text-fg-subtle text-sm">
      {error ?? 'Opening secure payment…'}
    </div>
  )
}
