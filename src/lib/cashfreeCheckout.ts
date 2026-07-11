/**
 * cashfreeCheckout — the custom-branded UCIN checkout (the approved artifact design),
 * powered by Cashfree Elements. Framework-agnostic: it injects a self-contained modal
 * into <body>, mounts Cashfree card/UPI Elements, and resolves a Promise on the outcome.
 *
 * Reused across every surface (studio web/desktop, ucin.in, app.ucin.in). Callers gate it
 * behind CUSTOM_CHECKOUT and keep the hosted `cashfree.checkout()` as the fallback, so an
 * unverified Elements path can never break the live gateway.
 *
 * ⚠️ NOT yet verified against a live payment — sandbox-test before enabling in production.
 * The two spots that need a live sandbox check are flagged INLINE with `VERIFY:`.
 */

const SDK_SRC = 'https://sdk.cashfree.com/js/v3/cashfree.js'

export interface CheckoutOpts {
  mode: 'sandbox' | 'production'
  paymentSessionId: string
  amountInr: number
  merchant?: string          // default "UCIN Studio"
  jobLine?: string           // e.g. "Cull · 1 frame · Overnight delivery"
  email?: string
}
export type CheckoutResult = 'success' | 'cancelled' | 'failed'

let sdkPromise: Promise<void> | null = null
function loadSdk(): Promise<void> {
  if ((window as any).Cashfree) return Promise.resolve()
  if (sdkPromise) return sdkPromise
  sdkPromise = new Promise((resolve, reject) => {
    const s = document.createElement('script')
    s.src = SDK_SRC
    s.onload = () => resolve()
    s.onerror = () => reject(new Error('Could not load the Cashfree checkout SDK'))
    document.head.appendChild(s)
  })
  return sdkPromise
}

const rupee = (n: number) => '₹' + n.toFixed(2)

/** Cashfree Elements input styling, matched to the checkout theme (reads CSS vars off :root). */
function elementStyle() {
  const cs = getComputedStyle(document.documentElement)
  const v = (k: string, f: string) => (cs.getPropertyValue(k).trim() || f)
  return {
    base: {
      color: v('--fg', '#0D0F14'),
      fontSize: '13.5px',
      fontFamily: 'ui-monospace, "SF Mono", Menlo, Consolas, monospace',
      letterSpacing: '.01em',
      '::placeholder': { color: v('--fg-faint', '#9096A0') },
    },
    invalid: { color: v('--danger', '#C0392B') },
  }
}

export function openCashfreeCheckout(opts: CheckoutOpts): Promise<CheckoutResult> {
  return new Promise(async (resolve) => {
    let settled = false
    const done = (r: CheckoutResult) => { if (settled) return; settled = true; teardown(); resolve(r) }

    let host: HTMLDivElement | null = null
    function teardown() { if (host && host.parentNode) host.parentNode.removeChild(host) }

    try {
      await loadSdk()
    } catch {
      done('failed'); return
    }
    const CF = (window as any).Cashfree
    const cashfree = CF({ mode: opts.mode })

    host = document.createElement('div')
    host.innerHTML = MARKUP(opts)
    document.body.appendChild(host)
    injectStyleOnce()

    const $ = (sel: string) => host!.querySelector(sel) as HTMLElement
    const $$ = (sel: string) => Array.from(host!.querySelectorAll(sel)) as HTMLElement[]

    // close / backdrop
    $('.cfx-close')?.addEventListener('click', () => done('cancelled'))
    $('.cfx-backdrop')?.addEventListener('click', () => done('cancelled'))

    // method rail switching
    $$('.cfx-ritem').forEach((it) => it.addEventListener('click', () => {
      $$('.cfx-ritem').forEach((x) => x.classList.remove('on'))
      it.classList.add('on')
      const id = it.getAttribute('data-pane')
      $$('.cfx-pane').forEach((p) => p.classList.toggle('on', p.id === 'cfx-' + id))
    }))

    // ── Card via Cashfree Elements ────────────────────────────────────────────
    const style = elementStyle()
    let cardNumber: any, cardExpiry: any, cardCvv: any, cardHolder: any
    try {
      cardNumber = cashfree.create('cardNumber', { style })
      cardExpiry = cashfree.create('cardExpiry', { style })
      cardCvv = cashfree.create('cardCvv', { style })
      cardHolder = cashfree.create('cardHolder', { style })
      cardNumber.mount('#cfx-cc-number')
      cardExpiry.mount('#cfx-cc-expiry')
      cardCvv.mount('#cfx-cc-cvv')
      cardHolder.mount('#cfx-cc-holder')
    } catch {
      /* Elements unavailable → the caller's hosted fallback should be used instead */
    }

    const setBusy = (btn: HTMLButtonElement, on: boolean, label: string) => {
      btn.disabled = on; btn.textContent = on ? 'Processing…' : label
    }

    const payCard = $('.cfx-pay-card') as HTMLButtonElement
    payCard?.addEventListener('click', async () => {
      setBusy(payCard, true, 'Pay ' + rupee(opts.amountInr))
      try {
        // VERIFY: `paymentMethod` should reference the card component group; Cashfree links the
        // four sub-elements to `cardNumber`. Confirm in sandbox that passing cardNumber works.
        const res = await cashfree.pay({ paymentMethod: cardNumber, paymentSessionId: opts.paymentSessionId })
        if (res && res.error) { setBusy(payCard, false, 'Pay ' + rupee(opts.amountInr)); return }
        done('success')
      } catch { setBusy(payCard, false, 'Pay ' + rupee(opts.amountInr)) }
    })

    // ── UPI collect (VPA) via Cashfree ────────────────────────────────────────
    const payUpi = $('.cfx-pay-upi') as HTMLButtonElement
    payUpi?.addEventListener('click', async () => {
      const vpa = ($('.cfx-upi-input') as HTMLInputElement).value.trim()
      if (!vpa) return
      setBusy(payUpi, true, 'Verify & pay')
      try {
        // VERIFY: exact UPI-collect shape for cashfree.pay — Cashfree v3 uses
        // { paymentMethod: { upi: { channel: 'collect', upi_id: vpa } }, paymentSessionId }.
        const res = await cashfree.pay({
          paymentMethod: { upi: { channel: 'collect', upi_id: vpa } },
          paymentSessionId: opts.paymentSessionId,
        })
        if (res && res.error) { setBusy(payUpi, false, 'Verify & pay'); return }
        done('success')
      } catch { setBusy(payUpi, false, 'Verify & pay') }
    })
  })
}

// ── markup + styles (ported from the approved artifact) ──────────────────────
function MARKUP(o: CheckoutOpts): string {
  const merchant = o.merchant || 'UCIN Studio'
  const job = o.jobLine || ''
  const email = o.email || ''
  const amt = rupee(o.amountInr)
  return `
  <div class="cfx-backdrop"></div>
  <div class="cfx" role="dialog" aria-label="Payment">
    <button class="cfx-close" aria-label="Close">&times;</button>
    <aside class="cfx-brand">
      <div class="cfx-logo">
        <svg width="25" height="25" viewBox="0 0 40 40" fill="none">
          <path d="M10 12v10a10 10 0 0 0 20 0V12" stroke="#fff" stroke-width="2.6" stroke-linecap="round"/>
          <circle cx="20" cy="28" r="2.1" fill="#fff"/><circle cx="12" cy="20" r="1.6" fill="#fff" opacity=".85"/>
          <circle cx="28" cy="20" r="1.6" fill="#fff" opacity=".85"/>
          <line x1="12" y1="20" x2="20" y2="28" stroke="#fff" stroke-width="1.1" opacity=".6"/>
          <line x1="28" y1="20" x2="20" y2="28" stroke="#fff" stroke-width="1.1" opacity=".6"/>
        </svg>
      </div>
      <div class="cfx-name">${merchant}</div>
      <div class="cfx-amt">${amt}</div>
      <span class="cfx-fix">Fixed — never billed above</span>
      ${job ? `<div class="cfx-job">${job}</div>` : ''}
      <div class="cfx-spacer"></div>
      <div class="cfx-secure">Secured by <b>Cashfree</b> · End-to-end encrypted</div>
    </aside>
    <section class="cfx-pay">
      ${email ? `<div class="cfx-contact">${email}</div>` : ''}
      <div class="cfx-body">
        <nav class="cfx-rail">
          <button class="cfx-ritem on" data-pane="upi">UPI / QR</button>
          <button class="cfx-ritem" data-pane="cards">Cards</button>
          <button class="cfx-ritem" data-pane="nb">Net Banking</button>
          <button class="cfx-ritem" data-pane="wallet">Wallets</button>
        </nav>
        <div class="cfx-content">
          <div class="cfx-pane on" id="cfx-upi">
            <h3>UPI</h3>
            <label>UPI ID</label>
            <div class="cfx-row"><input class="cfx-upi-input" placeholder="yourname@upi" aria-label="UPI ID"><button class="cfx-pay-upi cfx-btn">Verify &amp; pay</button></div>
          </div>
          <div class="cfx-pane" id="cfx-cards">
            <h3>Card details</h3>
            <label>Card number</label><div class="cfx-el" id="cfx-cc-number"></div>
            <div class="cfx-2"><div><label>Expiry</label><div class="cfx-el" id="cfx-cc-expiry"></div></div><div><label>CVV</label><div class="cfx-el" id="cfx-cc-cvv"></div></div></div>
            <label>Name on card</label><div class="cfx-el" id="cfx-cc-holder"></div>
            <button class="cfx-pay-card cfx-btn cfx-full">Pay ${amt}</button>
          </div>
          <div class="cfx-pane" id="cfx-nb"><h3>Net Banking</h3><p class="cfx-soon">Continue on the next screen to pick your bank.</p></div>
          <div class="cfx-pane" id="cfx-wallet"><h3>Wallets</h3><p class="cfx-soon">Continue on the next screen to pick your wallet.</p></div>
        </div>
      </div>
    </section>
  </div>`
}

let styled = false
function injectStyleOnce() {
  if (styled) return; styled = true
  const s = document.createElement('style')
  s.textContent = `
  .cfx-backdrop{position:fixed;inset:0;background:rgba(13,15,20,.55);backdrop-filter:blur(2px);z-index:9998;animation:cfxf .18s ease}
  .cfx{position:fixed;inset:0;margin:auto;z-index:9999;width:min(760px,94vw);max-height:92vh;display:flex;background:var(--surface,#fff);border-radius:16px;box-shadow:0 30px 80px -30px rgba(13,15,20,.5);overflow:hidden;font-family:var(--sans,system-ui,sans-serif);color:var(--fg,#0D0F14);animation:cfxu .2s ease}
  @keyframes cfxf{from{opacity:0}}@keyframes cfxu{from{opacity:0;transform:translateY(8px)}}
  .cfx-close{position:absolute;top:12px;right:14px;z-index:2;border:0;background:transparent;color:var(--fg-faint,#9096A0);font-size:22px;line-height:1;cursor:pointer}
  .cfx-brand{width:264px;flex-shrink:0;padding:24px;color:#fff;background:linear-gradient(157deg,#634AC0,#3E2782);display:flex;flex-direction:column}
  .cfx-logo{width:40px;height:40px;border-radius:11px;background:rgba(255,255,255,.14);border:1px solid rgba(255,255,255,.15);display:grid;place-items:center}
  .cfx-name{margin-top:14px;font-size:14.5px;font-weight:640}
  .cfx-amt{margin-top:22px;font-size:34px;font-weight:680;letter-spacing:-1.4px;font-variant-numeric:tabular-nums}
  .cfx-fix{margin-top:10px;align-self:flex-start;font-size:10px;font-weight:650;background:rgba(255,255,255,.13);border:1px solid rgba(255,255,255,.15);padding:5px 9px;border-radius:7px}
  .cfx-job{margin-top:14px;font-size:12px;color:rgba(255,255,255,.72)}
  .cfx-spacer{flex:1;min-height:16px}
  .cfx-secure{font-size:10.5px;color:rgba(255,255,255,.5)}.cfx-secure b{color:rgba(255,255,255,.75)}
  .cfx-pay{flex:1;min-width:0;display:flex;flex-direction:column}
  .cfx-contact{padding:13px 18px;border-bottom:1px solid var(--border,#E3E5EA);font-size:12.5px;color:var(--fg,#0D0F14);font-weight:550}
  .cfx-body{flex:1;display:flex;min-height:340px}
  .cfx-rail{width:150px;flex-shrink:0;border-right:1px solid var(--border,#E3E5EA);background:var(--sunk,#F5F6F8);padding:12px 8px;display:flex;flex-direction:column;gap:2px}
  .cfx-ritem{text-align:left;border:0;background:transparent;border-radius:9px;padding:11px 12px;font:inherit;font-size:13px;font-weight:550;color:var(--fg-subtle,#5A6070);cursor:pointer}
  .cfx-ritem.on{background:var(--surface,#fff);color:var(--accent,#5B3DAF);font-weight:640;box-shadow:0 1px 2px rgba(13,15,20,.07)}
  .cfx-content{flex:1;min-width:0;padding:22px;overflow:auto}
  .cfx-content h3{margin:0 0 16px;font-size:15px;font-weight:660}
  .cfx-content label{display:block;font-size:10px;font-weight:650;text-transform:uppercase;letter-spacing:.06em;color:var(--fg-subtle,#5A6070);margin:0 0 7px}
  .cfx-el,.cfx-upi-input{height:44px;background:var(--sunk,#F5F6F8);border:1.5px solid var(--border,#E3E5EA);border-radius:10px;padding:0 12px;display:flex;align-items:center;margin-bottom:13px}
  .cfx-upi-input{flex:1;font:inherit;font-family:var(--mono,ui-monospace,monospace);font-size:13.5px;outline:0;color:var(--fg,#0D0F14);margin-bottom:0}
  .cfx-upi-input:focus,.cfx-el:focus-within{border-color:var(--accent,#5B3DAF);box-shadow:0 0 0 3.5px var(--glow,rgba(91,61,175,.15))}
  .cfx-2{display:grid;grid-template-columns:1fr 1fr;gap:12px}
  .cfx-row{display:flex;gap:9px}
  .cfx-btn{height:44px;border:0;border-radius:10px;background:var(--accent,#5B3DAF);color:#fff;font:inherit;font-weight:640;font-size:13px;padding:0 16px;cursor:pointer;white-space:nowrap}
  .cfx-btn:hover{filter:brightness(1.05)} .cfx-btn:disabled{opacity:.65;cursor:default}
  .cfx-full{width:100%;margin-top:6px}
  .cfx-pane{display:none}.cfx-pane.on{display:block}
  .cfx-soon{font-size:12.5px;color:var(--fg-subtle,#5A6070)}
  @media(max-width:720px){.cfx{flex-direction:column}.cfx-brand{width:auto}.cfx-body{flex-direction:column}.cfx-rail{width:auto;flex-direction:row;overflow-x:auto;border-right:0;border-bottom:1px solid var(--border,#E3E5EA)}}
  `
  document.head.appendChild(s)
}
