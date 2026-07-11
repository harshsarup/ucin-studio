/**
 * cashfreeCheckout — the custom-branded UCIN checkout, a faithful reproduction of the
 * approved artifact (scratchpad/ucin-checkout.html): plum brand sidebar, method rail with
 * icons, order summary, trust rows, and UPI / Cards / Net Banking / Wallets panes — plus a
 * dark theme. Framework-agnostic: injects a self-contained modal into <body>, mounts the
 * real Cashfree Elements card fields, and resolves a Promise on the outcome.
 *
 * Reused across every surface (studio web/desktop, ucin.in, app.ucin.in). Callers gate it
 * behind CUSTOM_CHECKOUT and keep the hosted `cashfree.checkout()` as the fallback, so an
 * unverified Elements path can never break the live gateway.
 *
 * All markup + CSS are ported 1:1 from the approved artifact, scoped under #ucinpay-root so
 * the generic class names (.brand/.pay/.control/…) can't collide with host-app styles. The
 * two deviations from the static artifact are deliberate and unavoidable:
 *   • card <input>s → Cashfree Elements iframes (PCI); they render inside the same .control.
 *   • the decorative QR is only shown if a REAL Cashfree UPI QR is obtained (never a fake one).
 *
 * ⚠️ NOT yet verified against a live payment. Every Cashfree API call is flagged `VERIFY:`.
 */

const SDK_SRC = 'https://sdk.cashfree.com/js/v3/cashfree.js'

export interface CheckoutOpts {
  mode: 'sandbox' | 'production'
  paymentSessionId: string
  amountInr: number
  merchant?: string                              // sidebar title, default "UCIN Studio"
  subtitle?: string                              // under the title, e.g. "Creative studio · pay per job"
  note?: string                                  // the green badge, e.g. "Fixed — never billed above"
  email?: string                                 // contact bar; omitted → bar hidden
  lines?: { label: string; value: string }[]     // order-summary rows; omitted → card hidden
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
const esc = (s: string) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c] as string))

// Accepted card-network marks (informational, as every checkout shows). Each SVG carries its
// own white tile so it stays legible in the dark theme.
const NET_LOGOS = [
  `<svg class="netlogo" viewBox="0 0 44 24" role="img" aria-label="Visa"><rect width="44" height="24" rx="4" fill="#fff" stroke="#E3E5EA"/><text x="22" y="16.5" text-anchor="middle" font-family="Arial,Helvetica,sans-serif" font-weight="700" font-style="italic" font-size="12" letter-spacing=".4" fill="#1A1F71">VISA</text></svg>`,
  `<svg class="netlogo" viewBox="0 0 44 24" role="img" aria-label="Mastercard"><rect width="44" height="24" rx="4" fill="#fff" stroke="#E3E5EA"/><circle cx="18" cy="12" r="6.6" fill="#EB001B"/><circle cx="26" cy="12" r="6.6" fill="#F79E1B"/><path d="M22 6.9a6.6 6.6 0 0 0 0 10.2 6.6 6.6 0 0 0 0-10.2Z" fill="#FF5F00"/></svg>`,
  `<svg class="netlogo" viewBox="0 0 50 24" role="img" aria-label="RuPay"><rect width="50" height="24" rx="4" fill="#fff" stroke="#E3E5EA"/><text x="25" y="16.5" text-anchor="middle" font-family="Arial,Helvetica,sans-serif" font-weight="800" font-size="11"><tspan fill="#1D3E70">Ru</tspan><tspan fill="#E8792A">Pay</tspan></text></svg>`,
  `<svg class="netlogo" viewBox="0 0 44 24" role="img" aria-label="American Express"><rect width="44" height="24" rx="4" fill="#016FD0"/><text x="22" y="15.5" text-anchor="middle" font-family="Arial,Helvetica,sans-serif" font-weight="800" font-size="8" letter-spacing=".3" fill="#fff">AMEX</text></svg>`,
].join('')

/** Cashfree Elements input styling, matched to the checkout theme (reads the scoped CSS vars). */
function elementStyle(root: HTMLElement) {
  const cs = getComputedStyle(root)
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
    host.id = 'ucinpay-host'
    // mirror the host app's theme choice onto our scoped root, so the dark tokens apply
    const appTheme = document.documentElement.getAttribute('data-theme')
    host.innerHTML = MARKUP(opts, appTheme)
    document.body.appendChild(host)
    injectStyleOnce()

    const root = host.querySelector('#ucinpay-root') as HTMLElement
    const $ = (sel: string) => root.querySelector(sel) as HTMLElement
    const $$ = (sel: string) => Array.from(root.querySelectorAll(sel)) as HTMLElement[]

    // close / backdrop / Esc
    $('.ucinpay-close')?.addEventListener('click', () => done('cancelled'))
    $('#ucinpay-bg')?.addEventListener('click', () => done('cancelled'))
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') { window.removeEventListener('keydown', onKey); done('cancelled') } }
    window.addEventListener('keydown', onKey)

    // method rail switching
    $$('.ritem').forEach((it) => it.addEventListener('click', () => {
      $$('.ritem').forEach((x) => x.classList.remove('on'))
      it.classList.add('on')
      const id = it.getAttribute('data-pane')
      $$('.pane').forEach((p) => p.classList.toggle('on', p.id === id))
    }))
    // net-banking / wallet single-select
    $$('.grid2, .wlist').forEach((grp) => grp.addEventListener('click', (e) => {
      const b = (e.target as HTMLElement).closest('.opt, .wopt') as HTMLElement | null
      if (!b) return
      Array.from(grp.querySelectorAll('.opt, .wopt')).forEach((x) => x.classList.remove('sel'))
      b.classList.add('sel')
    }))

    // ── Card via Cashfree Elements (mounted into the artifact's .control boxes) ──
    const style = elementStyle(root)
    let cardNumber: any
    let elementsOk = false
    try {
      cardNumber = cashfree.create('cardNumber', { style })
      const cardExpiry = cashfree.create('cardExpiry', { style })
      const cardCvv = cashfree.create('cardCvv', { style })
      const cardHolder = cashfree.create('cardHolder', { style })
      cardNumber.mount('#cc-number'); cardExpiry.mount('#cc-expiry'); cardCvv.mount('#cc-cvv'); cardHolder.mount('#cc-holder')
      // focus ring on the surrounding .control (Elements are cross-origin, so focus-within won't fire)
      const ring = (el: any, sel: string) => {
        try { el.on('focus', () => $(sel)?.classList.add('foc')); el.on('blur', () => $(sel)?.classList.remove('foc')) } catch { /* event name differs */ }
      }
      ring(cardNumber, '#cc-number'); ring(cardExpiry, '#cc-expiry'); ring(cardCvv, '#cc-cvv'); ring(cardHolder, '#cc-holder')
      elementsOk = true
    } catch {
      // Elements unavailable → caller's hosted fallback handles cards. Hide the card pane's inputs.
      const cw = $('#cards .fields'); if (cw) cw.innerHTML = '<p class="soon">Card entry is loading… if it doesn’t appear, use UPI or reopen checkout.</p>'
    }

    const busy = (btn: HTMLButtonElement, on: boolean, label: string) => { btn.disabled = on; btn.textContent = on ? 'Processing…' : label }

    // Card pay
    const payCard = $('#cards .paybtn') as HTMLButtonElement
    payCard?.addEventListener('click', async () => {
      if (!elementsOk) return
      const label = 'Pay ' + rupee(opts.amountInr)
      busy(payCard, true, label)
      try {
        // VERIFY: Cashfree links the four sub-elements to `cardNumber`; confirm passing it works.
        const res = await cashfree.pay({ paymentMethod: cardNumber, paymentSessionId: opts.paymentSessionId })
        if (res && res.error) { busy(payCard, false, label); return }
        done('success')
      } catch { busy(payCard, false, label) }
    })

    // UPI collect (VPA)
    const payUpi = $('.verify') as HTMLButtonElement
    payUpi?.addEventListener('click', async () => {
      const vpa = ($('#upi .control input') as HTMLInputElement).value.trim()
      if (!vpa) return
      busy(payUpi, true, 'Verify & pay')
      try {
        // VERIFY: Cashfree v3 UPI-collect shape.
        const res = await cashfree.pay({ paymentMethod: { upi: { channel: 'collect', upi_id: vpa } }, paymentSessionId: opts.paymentSessionId })
        if (res && res.error) { busy(payUpi, false, 'Verify & pay'); return }
        done('success')
      } catch { busy(payUpi, false, 'Verify & pay') }
    })

    // Real UPI QR (never a fake one): try to fetch a genuine Cashfree QR; hide the card if unavailable.
    void renderRealUpiQr(cashfree, opts, $)

    // Net Banking + Wallets — keep the approved inline selection UI, complete via the hosted
    // Cashfree modal (reliable) rather than guessing per-bank/per-wallet payloads.
    // VERIFY: these can be made fully inline later with cashfree.pay({ paymentMethod:{ netbanking|app } }).
    ;['#nb .paybtn', '#wallet .paybtn'].forEach((sel) => {
      const b = $(sel) as HTMLButtonElement
      b?.addEventListener('click', async () => {
        const label = b.textContent || 'Pay'
        busy(b, true, label)
        try {
          const res = await cashfree.checkout({ paymentSessionId: opts.paymentSessionId, redirectTarget: '_modal' })
          if (res && res.error) { busy(b, false, label); return }
          done('success')
        } catch { busy(b, false, label) }
      })
    })
  })
}

/** Attempt a genuine Cashfree UPI QR. On any uncertainty we hide the QR card and let the
 *  UPI-ID collect flow stand alone — we never present a non-functional QR in a live modal. */
async function renderRealUpiQr(cashfree: any, opts: CheckoutOpts, $: (s: string) => HTMLElement) {
  const wrap = $('#upi .qrcard')
  const hide = () => { const qw = $('#upi .qrwrap'); if (qw) qw.classList.add('noqr') }
  try {
    // VERIFY: exact API for a scannable UPI QR (returns an image/data-URL). If it doesn't
    // match, we fall through to hide() so no decorative/fake QR is ever shown.
    const res = await cashfree.pay({ paymentMethod: { upi: { channel: 'qrcode' } }, paymentSessionId: opts.paymentSessionId })
    const url = res?.data?.payload?.qrcode || res?.data?.url || res?.qrcode
    if (typeof url === 'string' && url) {
      wrap.innerHTML = `<img alt="UPI QR" src="${esc(url)}" style="width:130px;height:130px;image-rendering:pixelated;border-radius:2px">`
    } else { hide() }
  } catch { hide() }
}

// ── markup (ported 1:1 from the approved artifact) ───────────────────────────
function MARKUP(o: CheckoutOpts, theme: string | null): string {
  const merchant = esc(o.merchant || 'UCIN Studio')
  const subtitle = o.subtitle ? esc(o.subtitle) : ''
  const note = o.note ? esc(o.note) : ''
  const email = o.email ? esc(o.email) : ''
  const amt = rupee(o.amountInr)
  const lines = o.lines && o.lines.length
    ? `<div class="bcard">${o.lines.map((l) => `<div class="r"><span class="k">${esc(l.label)}</span><span class="v">${esc(l.value)}</span></div>`).join('')}</div>`
    : ''
  const themeAttr = theme ? ` data-theme="${esc(theme)}"` : ''
  return `
  <div id="ucinpay-bg"></div>
  <div id="ucinpay-root"${themeAttr}>
    <div class="checkout" role="dialog" aria-label="${merchant} payment">
      <button class="ucinpay-close" aria-label="Close">&times;</button>
      <aside class="brand">
        <div class="blogo" aria-hidden="true">
          <svg width="25" height="25" viewBox="0 0 40 40" fill="none">
            <path d="M10 12v10a10 10 0 0 0 20 0V12" stroke="#fff" stroke-width="2.6" stroke-linecap="round" fill="none"/>
            <circle cx="20" cy="28" r="2.1" fill="#fff"/><circle cx="12" cy="20" r="1.6" fill="#fff" opacity=".85"/>
            <circle cx="28" cy="20" r="1.6" fill="#fff" opacity=".85"/>
            <line x1="12" y1="20" x2="20" y2="28" stroke="#fff" stroke-width="1.1" opacity=".6"/>
            <line x1="28" y1="20" x2="20" y2="28" stroke="#fff" stroke-width="1.1" opacity=".6"/>
          </svg>
        </div>
        <div class="bname">${merchant}</div>
        ${subtitle ? `<div class="bfor">${subtitle}</div>` : ''}
        <div class="bamt">${amt}</div>
        ${note ? `<span class="bfix"><svg class="i" viewBox="0 0 24 24"><path d="m5 13 4 4L19 7"/></svg>${note}</span>` : ''}
        ${lines}
        <div class="bspacer"></div>
        <div class="btrust">
          <div class="t"><svg class="i" viewBox="0 0 24 24"><rect width="18" height="11" x="3" y="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg><span><b>End-to-end encrypted</b></span></div>
          <div class="t"><svg class="i" viewBox="0 0 24 24"><circle cx="12" cy="10" r="3"/><path d="M12 2a8 8 0 0 0-8 8c0 5.4 8 12 8 12s8-6.6 8-12a8 8 0 0 0-8-8Z"/></svg><span>Stored &amp; processed <b>only in India</b></span></div>
        </div>
        <div class="bsecure"><svg class="i" viewBox="0 0 24 24"><rect width="18" height="11" x="3" y="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>Secured by <b>Cashfree</b></div>
      </aside>

      <section class="pay">
        ${email ? `<div class="contact">
          <svg class="i" viewBox="0 0 24 24"><rect width="18" height="14" x="3" y="5" rx="2"/><path d="m3 7 9 6 9-6"/></svg>
          <span class="em">${email}</span></div>` : ''}
        <div class="body">
          <nav class="rail" aria-label="Payment methods">
            <div class="rlabel">Pay using</div>
            <button class="ritem on" data-pane="upi"><svg class="i" viewBox="0 0 24 24"><rect width="5" height="5" x="3" y="3" rx="1"/><rect width="5" height="5" x="16" y="3" rx="1"/><rect width="5" height="5" x="3" y="16" rx="1"/><path d="M21 16h-3a2 2 0 0 0-2 2v3"/><path d="M21 21v.01"/><path d="M12 7v3a2 2 0 0 1-2 2H7"/><path d="M3 12h.01"/><path d="M12 3h.01"/><path d="M12 16v.01"/><path d="M16 12h1"/><path d="M21 12v.01"/><path d="M12 21v-1"/></svg>UPI / QR<span class="tag">Fast</span></button>
            <button class="ritem" data-pane="cards"><svg class="i" viewBox="0 0 24 24"><rect width="20" height="14" x="2" y="5" rx="2"/><path d="M2 10h20"/></svg>Cards</button>
            <button class="ritem" data-pane="nb"><svg class="i" viewBox="0 0 24 24"><line x1="3" y1="22" x2="21" y2="22"/><line x1="6" y1="18" x2="6" y2="11"/><line x1="10" y1="18" x2="10" y2="11"/><line x1="14" y1="18" x2="14" y2="11"/><line x1="18" y1="18" x2="18" y2="11"/><polygon points="12 2 20 7 4 7"/></svg>Net Banking</button>
            <button class="ritem" data-pane="wallet"><svg class="i" viewBox="0 0 24 24"><path d="M20 12V8H6a2 2 0 0 1-2-2c0-1.1.9-2 2-2h12v4"/><path d="M4 6v12c0 1.1.9 2 2 2h14v-4"/><path d="M18 12a2 2 0 0 0 0 4h4v-4Z"/></svg>Wallets</button>
          </nav>

          <div class="content">
            <div class="pane on" id="upi">
              <div class="chead"><h3>UPI / QR</h3></div>
              <div class="fields">
                <div class="qrwrap">
                  <div class="qrcard"><div class="qrload">Loading QR…</div></div>
                  <div class="qrside"><div class="t">Scan &amp; pay ${amt}</div><div class="s">Open <b>GPay, PhonePe, Paytm</b> or any UPI app and scan this code.</div></div>
                </div>
                <div class="orline">or enter UPI ID</div>
                <div class="upiid"><div class="control"><input placeholder="yourname@upi" aria-label="UPI ID"></div><button class="verify" type="button">Verify &amp; pay</button></div>
              </div>
            </div>

            <div class="pane" id="cards">
              <div class="chead"><h3>Card details</h3><span class="nets">${NET_LOGOS}</span></div>
              <div class="fields">
                <div class="field"><label>Card number</label><div class="control" id="cc-number"></div></div>
                <div class="row2">
                  <div class="field"><label>Expiry</label><div class="control" id="cc-expiry"></div></div>
                  <div class="field"><label>CVV</label><div class="control" id="cc-cvv"></div></div>
                </div>
                <div class="field"><label>Name on card</label><div class="control" id="cc-holder"></div></div>
              </div>
              <button class="paybtn" type="button"><svg class="i" viewBox="0 0 24 24"><rect width="18" height="11" x="3" y="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>Pay ${amt}</button>
            </div>

            <div class="pane" id="nb">
              <div class="chead"><h3>Net Banking</h3></div>
              <div class="fields handoff">
                <svg class="i hoicon" viewBox="0 0 24 24"><line x1="3" y1="22" x2="21" y2="22"/><line x1="6" y1="18" x2="6" y2="11"/><line x1="10" y1="18" x2="10" y2="11"/><line x1="14" y1="18" x2="14" y2="11"/><line x1="18" y1="18" x2="18" y2="11"/><polygon points="12 2 20 7 4 7"/></svg>
                <div class="hotitle">All major banks supported</div>
                <div class="hosub">HDFC, ICICI, SBI, Axis, Kotak &amp; 50+ more — continue to Cashfree's secure selector, where every bank appears with its official logo.</div>
              </div>
              <button class="paybtn" type="button">Continue with Net Banking</button>
            </div>

            <div class="pane" id="wallet">
              <div class="chead"><h3>Wallets</h3></div>
              <div class="fields handoff">
                <svg class="i hoicon" viewBox="0 0 24 24"><path d="M20 12V8H6a2 2 0 0 1-2-2c0-1.1.9-2 2-2h12v4"/><path d="M4 6v12c0 1.1.9 2 2 2h14v-4"/><path d="M18 12a2 2 0 0 0 0 4h4v-4Z"/></svg>
                <div class="hotitle">Paytm, PhonePe, Amazon Pay &amp; more</div>
                <div class="hosub">Continue to Cashfree's secure wallet selector, where each wallet appears with its official logo.</div>
              </div>
              <button class="paybtn" type="button">Continue with Wallets</button>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>`
}

// ── styles (ported 1:1 from the approved artifact, scoped under #ucinpay-root) ──
let styled = false
function injectStyleOnce() {
  if (styled) return; styled = true
  const s = document.createElement('style')
  s.textContent = `
  #ucinpay-root{
    --surface:#FFF;--sunk:#F5F6F8;--border:#E3E5EA;--fg:#0D0F14;--fg-muted:#3A3F4A;--fg-subtle:#5A6070;--fg-faint:#9096A0;
    --accent:#5B3DAF;--accent-ink:#4A2F94;--accent-contrast:#FFF;--tint:#F2EFFB;--glow:rgba(91,61,175,.15);--danger:#C0392B;
    --brand-a:#634AC0;--brand-b:#3E2782;--on:#FFF;--on-70:rgba(255,255,255,.70);--on-45:rgba(255,255,255,.46);--on-line:rgba(255,255,255,.15);
    --sans:system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
    --mono:ui-monospace,"SF Mono","Cascadia Code","JetBrains Mono",Menlo,Consolas,monospace;
    --shadow:0 0 0 1px rgba(13,15,20,.04),0 14px 34px -14px rgba(13,15,20,.20),0 54px 70px -56px rgba(62,39,130,.45);
    position:fixed;inset:0;z-index:2147483001;display:flex;align-items:center;justify-content:center;padding:24px 16px;
    font-family:var(--sans);color:var(--fg);letter-spacing:-.01em;-webkit-font-smoothing:antialiased;
  }
  @media (prefers-color-scheme:dark){ #ucinpay-root:not([data-theme="light"]){
    --surface:#141519;--sunk:#0D0E11;--border:#272930;--fg:#EDEFF3;--fg-muted:#C4C8D2;--fg-subtle:#9096A2;--fg-faint:#666C77;
    --accent:#AC94F1;--accent-ink:#C6B6F7;--accent-contrast:#0D0A1A;--tint:#1A1730;--glow:rgba(140,110,244,.24);
    --brand-a:#553AA6;--brand-b:#2C1B54;--shadow:0 0 0 1px rgba(255,255,255,.045),0 20px 46px -16px rgba(0,0,0,.66),0 64px 84px -60px rgba(140,110,244,.42);
  }}
  #ucinpay-root[data-theme="dark"]{
    --surface:#141519;--sunk:#0D0E11;--border:#272930;--fg:#EDEFF3;--fg-muted:#C4C8D2;--fg-subtle:#9096A2;--fg-faint:#666C77;
    --accent:#AC94F1;--accent-ink:#C6B6F7;--accent-contrast:#0D0A1A;--tint:#1A1730;--glow:rgba(140,110,244,.24);
    --brand-a:#553AA6;--brand-b:#2C1B54;--shadow:0 0 0 1px rgba(255,255,255,.045),0 20px 46px -16px rgba(0,0,0,.66),0 64px 84px -60px rgba(140,110,244,.42);
  }
  #ucinpay-bg{position:fixed;inset:0;background:rgba(13,15,20,.55);backdrop-filter:blur(2px);z-index:2147483000;animation:ucinpayf .18s ease}
  @keyframes ucinpayf{from{opacity:0}}
  #ucinpay-root *{box-sizing:border-box}
  #ucinpay-root svg.i{width:18px;height:18px;stroke:currentColor;fill:none;stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round;flex-shrink:0}
  #ucinpay-root .checkout{position:relative;width:100%;max-width:780px;background:var(--surface);border-radius:16px;box-shadow:var(--shadow);overflow:hidden;display:flex;animation:ucinpayu .2s ease}
  @keyframes ucinpayu{from{opacity:0;transform:translateY(8px)}}
  #ucinpay-root .ucinpay-close{position:absolute;top:12px;right:14px;z-index:3;border:0;background:transparent;color:var(--fg-faint);font-size:22px;line-height:1;cursor:pointer}
  #ucinpay-root .brand{width:280px;flex-shrink:0;padding:24px;color:var(--on);background:linear-gradient(157deg,var(--brand-a),var(--brand-b));display:flex;flex-direction:column}
  #ucinpay-root .blogo{width:40px;height:40px;border-radius:11px;background:rgba(255,255,255,.14);border:1px solid var(--on-line);display:grid;place-items:center}
  #ucinpay-root .bname{margin-top:14px;font-size:14.5px;font-weight:640}
  #ucinpay-root .bfor{font-size:11px;color:var(--on-70);margin-top:3px}
  #ucinpay-root .bamt{margin-top:24px;font-size:36px;font-weight:680;letter-spacing:-1.6px;line-height:1;font-variant-numeric:tabular-nums}
  #ucinpay-root .bfix{margin-top:10px;display:inline-flex;align-items:center;gap:6px;font-size:10px;font-weight:650;color:var(--on);background:rgba(255,255,255,.13);border:1px solid var(--on-line);padding:5px 9px;border-radius:7px;align-self:flex-start}
  #ucinpay-root .bfix svg.i{width:11px;height:11px;stroke-width:2.6}
  #ucinpay-root .bcard{margin-top:20px;border:1px solid var(--on-line);border-radius:11px;overflow:hidden}
  #ucinpay-root .bcard .r{display:flex;align-items:center;justify-content:space-between;font-size:12px;padding:10px 12px}
  #ucinpay-root .bcard .r + .r{border-top:1px solid var(--on-line)}
  #ucinpay-root .bcard .k{color:var(--on-70)} #ucinpay-root .bcard .v{font-weight:600;font-variant-numeric:tabular-nums}
  #ucinpay-root .bspacer{flex:1;min-height:20px}
  #ucinpay-root .btrust{display:flex;flex-direction:column;gap:10px}
  #ucinpay-root .btrust .t{display:flex;align-items:center;gap:9px;font-size:11.5px;color:var(--on-70)}
  #ucinpay-root .btrust .t b{color:var(--on);font-weight:600}
  #ucinpay-root .btrust svg.i{width:15px;height:15px;color:var(--on);opacity:.9}
  #ucinpay-root .bsecure{margin-top:16px;padding-top:14px;border-top:1px solid var(--on-line);font-size:10px;color:var(--on-45);display:flex;align-items:center;gap:6px}
  #ucinpay-root .bsecure svg.i{width:12px;height:12px;color:var(--on-45)} #ucinpay-root .bsecure b{color:var(--on-70);font-weight:600}
  #ucinpay-root .pay{flex:1;min-width:0;display:flex;flex-direction:column}
  #ucinpay-root .contact{display:flex;align-items:center;gap:9px;padding:13px 18px;border-bottom:1px solid var(--border);font-size:12.5px;color:var(--fg-subtle)}
  #ucinpay-root .contact svg.i{width:15px;height:15px;color:var(--fg-faint)}
  #ucinpay-root .contact .em{color:var(--fg);font-weight:550}
  #ucinpay-root .body{flex:1;display:flex;min-height:398px}
  #ucinpay-root .rail{width:156px;flex-shrink:0;border-right:1px solid var(--border);padding:12px 8px;display:flex;flex-direction:column;gap:2px;background:var(--sunk)}
  #ucinpay-root .rlabel{font-size:9.5px;font-weight:700;letter-spacing:.09em;text-transform:uppercase;color:var(--fg-faint);padding:6px 10px 8px}
  #ucinpay-root .ritem{display:flex;align-items:center;gap:11px;padding:11px;border:0;background:transparent;border-radius:9px;cursor:pointer;font-family:inherit;font-size:13px;font-weight:550;color:var(--fg-subtle);text-align:left;position:relative;transition:background .14s,color .14s}
  #ucinpay-root .ritem:hover{background:rgba(0,0,0,.03);color:var(--fg)}
  #ucinpay-root[data-theme="dark"] .ritem:hover{background:rgba(255,255,255,.04)}
  #ucinpay-root .ritem.on{background:var(--surface);color:var(--accent);font-weight:640;box-shadow:0 1px 2px rgba(13,15,20,.07)}
  #ucinpay-root .ritem.on::before{content:"";position:absolute;left:-8px;top:10px;bottom:10px;width:3px;border-radius:0 3px 3px 0;background:var(--accent)}
  #ucinpay-root .ritem .tag{margin-left:auto;font-size:8px;font-weight:700;letter-spacing:.03em;text-transform:uppercase;color:#fff;background:var(--accent);padding:2px 5px;border-radius:4px}
  #ucinpay-root .content{flex:1;min-width:0;padding:22px 22px 24px;display:flex;flex-direction:column}
  #ucinpay-root .chead{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:18px;min-height:22px}
  #ucinpay-root .chead h3{margin:0;font-size:15px;font-weight:660;letter-spacing:-.2px}
  #ucinpay-root .nets{display:flex;align-items:center;gap:6px}
  #ucinpay-root .netlogo{height:21px;width:auto;display:block}
  #ucinpay-root .pane{display:none;flex:1;flex-direction:column} #ucinpay-root .pane.on{display:flex}
  #ucinpay-root .fields{flex:1}
  #ucinpay-root .field{margin-bottom:13px} #ucinpay-root .field:last-of-type{margin-bottom:0}
  #ucinpay-root .field label{display:block;font-size:10px;font-weight:650;text-transform:uppercase;letter-spacing:.07em;color:var(--fg-subtle);margin-bottom:7px}
  #ucinpay-root .row2{display:grid;grid-template-columns:1fr 1fr;gap:12px}
  #ucinpay-root .control{display:flex;align-items:center;gap:8px;height:44px;background:var(--sunk);border:1.5px solid var(--border);border-radius:10px;padding:0 12px;transition:border-color .15s,box-shadow .15s,background .15s}
  #ucinpay-root .control.foc,#ucinpay-root .control:focus-within{border-color:var(--accent);box-shadow:0 0 0 3.5px var(--glow);background:var(--surface)}
  #ucinpay-root .control input{flex:1;border:0;outline:0;background:transparent;color:var(--fg);font-family:var(--mono);font-size:13.5px;letter-spacing:.01em;min-width:0;height:100%}
  #ucinpay-root .control input::placeholder{color:var(--fg-faint)}
  #ucinpay-root .control[id^="cc-"]{display:block;padding:0 12px}
  #ucinpay-root .control[id^="cc-"] > *{height:100%}
  #ucinpay-root .paybtn{width:100%;margin-top:18px;height:46px;display:flex;align-items:center;justify-content:center;gap:8px;border:0;border-radius:11px;cursor:pointer;background:var(--accent);color:var(--accent-contrast);font-family:inherit;font-size:14px;font-weight:640;letter-spacing:-.1px;transition:filter .14s,transform .08s}
  #ucinpay-root .paybtn:hover{filter:brightness(1.05)} #ucinpay-root .paybtn:active{transform:translateY(1px)} #ucinpay-root .paybtn:disabled{opacity:.65;cursor:default} #ucinpay-root .paybtn svg.i{width:15px;height:15px}
  #ucinpay-root .qrwrap{display:flex;gap:20px;align-items:center}
  #ucinpay-root .qrwrap.noqr .qrcard{display:none}
  #ucinpay-root .qrcard{position:relative;width:158px;height:158px;flex-shrink:0;background:#fff;border:1px solid #E3E5EA;border-radius:14px;display:grid;place-items:center;box-shadow:0 10px 24px -14px rgba(13,15,20,.28)}
  #ucinpay-root .qrload{font-size:11px;color:#9096A0}
  #ucinpay-root .qrside{min-width:0} #ucinpay-root .qrside .t{font-size:15px;font-weight:640;letter-spacing:-.2px} #ucinpay-root .qrside .s{font-size:12px;color:var(--fg-subtle);margin-top:8px;line-height:1.6} #ucinpay-root .qrside .s b{color:var(--fg);font-weight:600}
  #ucinpay-root .orline{display:flex;align-items:center;gap:12px;color:var(--fg-faint);font-size:10px;text-transform:uppercase;letter-spacing:.08em;margin:20px 0 13px} #ucinpay-root .orline::before,#ucinpay-root .orline::after{content:"";flex:1;height:1px;background:var(--border)}
  #ucinpay-root .upiid{display:flex;flex-direction:column;gap:11px} #ucinpay-root .upiid .control{width:100%}
  #ucinpay-root .verify{width:100%;height:46px;display:inline-flex;align-items:center;justify-content:center;border:0;border-radius:11px;cursor:pointer;font-family:inherit;font-weight:640;background:var(--accent);color:var(--accent-contrast);font-size:14px;padding:0 16px;white-space:nowrap;transition:filter .14s,transform .08s} #ucinpay-root .verify:hover{filter:brightness(1.05)} #ucinpay-root .verify:active{transform:translateY(1px)} #ucinpay-root .verify:disabled{opacity:.65}
  #ucinpay-root .grid2{display:grid;grid-template-columns:1fr 1fr;gap:9px}
  #ucinpay-root .opt{font-family:inherit;font-size:12.5px;font-weight:550;color:var(--fg-muted);background:var(--sunk);border:1.5px solid var(--border);border-radius:10px;padding:0 13px;height:46px;display:flex;align-items:center;cursor:pointer;text-align:left;transition:border-color .14s,background .14s}
  #ucinpay-root .opt.sel{border-color:var(--accent);background:var(--tint);color:var(--accent-ink)}
  #ucinpay-root .wlist{display:flex;flex-direction:column;gap:9px}
  #ucinpay-root .wopt{display:flex;align-items:center;justify-content:space-between;height:48px;padding:0 15px;background:var(--sunk);border:1.5px solid var(--border);border-radius:10px;font-size:13px;font-weight:550;cursor:pointer;color:var(--fg)} #ucinpay-root .wopt.sel{border-color:var(--accent);background:var(--tint)}
  #ucinpay-root .wdot{width:15px;height:15px;border-radius:50%;border:2px solid var(--border);display:grid;place-items:center} #ucinpay-root .wopt.sel .wdot{border-color:var(--accent)} #ucinpay-root .wopt.sel .wdot::after{content:"";width:7px;height:7px;border-radius:50%;background:var(--accent)}
  #ucinpay-root .soon{font-size:12.5px;color:var(--fg-subtle)}
  #ucinpay-root .handoff{display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;gap:11px;padding:22px 8px}
  #ucinpay-root svg.hoicon{width:34px;height:34px;color:var(--accent);stroke-width:1.6}
  #ucinpay-root .hotitle{font-size:14px;font-weight:660}
  #ucinpay-root .hosub{font-size:12px;color:var(--fg-subtle);line-height:1.6;max-width:300px}
  @media (prefers-reduced-motion:reduce){#ucinpay-root *{transition:none!important}}
  @media (max-width:720px){
    #ucinpay-root .checkout{flex-direction:column;max-width:420px}
    #ucinpay-root .brand{width:auto;padding:20px} #ucinpay-root .bamt{margin-top:16px;font-size:31px} #ucinpay-root .bspacer,#ucinpay-root .btrust,#ucinpay-root .bsecure{display:none}
    #ucinpay-root .body{flex-direction:column;min-height:0}
    #ucinpay-root .rail{width:auto;flex-direction:row;overflow-x:auto;border-right:0;border-bottom:1px solid var(--border);gap:4px;padding:9px 12px}
    #ucinpay-root .rlabel{display:none} #ucinpay-root .ritem{flex-direction:column;gap:5px;font-size:10.5px;padding:8px 12px;white-space:nowrap} #ucinpay-root .ritem.on::before{display:none} #ucinpay-root .ritem .tag{display:none}
    #ucinpay-root .qrwrap{flex-direction:column;align-items:center;text-align:center}
  }
  `
  document.head.appendChild(s)
}
