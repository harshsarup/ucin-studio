/**
 * UCIN Studio — creative product catalog & vocabulary (web port).
 *
 * Mirror of ucin_creator_studio/src/shared/catalog.ts so the browser app and the
 * desktop agent quote identically. Keep the two in sync (rates, presets, speed).
 * Framework-agnostic; `Tier` is declared locally (no cross-repo dependency).
 */

export type Tier = 'priority' | 'core' | 'flex'

// ── Verticals: one object, labelled for the user's world ──────────────────────

export type Vertical = 'photo' | 'agency' | 'ecom' | 'creator'

export interface VerticalLabels {
  label: string
  object: string
  objectPlural: string
  newCta: string
}

export const VERTICALS: Record<Vertical, VerticalLabels> = {
  photo:      { label: 'Photographer / Studio', object: 'Shoot',    objectPlural: 'Shoots',    newCta: 'New shoot' },
  agency:     { label: 'Agency',                 object: 'Campaign', objectPlural: 'Campaigns', newCta: 'New campaign' },
  ecom:       { label: 'Brands',                 object: 'Collection', objectPlural: 'Collections', newCta: 'New collection' },
  creator:    { label: 'Creator',                object: 'Project',  objectPlural: 'Projects',  newCta: 'New project' },
}

export const VERTICAL_ORDER: Vertical[] = ['photo', 'agency', 'ecom', 'creator']

// ── Task catalog: each maps to a backend action_id + flat Flex rate ───────────

export type TaskId =
  | 'cull' | 'grade' | 'enhance' | 'remove-bg'
  | 'retouch' | 'generate' | 'transcribe'

export interface TaskDef {
  id: TaskId
  label: string
  unit: string
  flatRateInr: number
  actionId: string
  blurb: string
}

export const TASKS: Record<TaskId, TaskDef> = {
  cull:        { id: 'cull',        label: 'Cull',                  unit: 'frame', flatRateInr: 0.75, actionId: 'cull',          blurb: 'Pick the keepers — drop blinks, blur & dupes' },
  grade:       { id: 'grade',       label: 'Grade in your style',   unit: 'photo', flatRateInr: 10,   actionId: 'grade',         blurb: 'Your signature look, applied to every shot' },
  enhance:     { id: 'enhance',     label: 'Enhance / upscale',     unit: 'photo', flatRateInr: 8,    actionId: 'upscale',       blurb: 'Sharper, cleaner, print-ready' },
  'remove-bg': { id: 'remove-bg',   label: 'Remove background',     unit: 'image', flatRateInr: 4,    actionId: 'remove-bg',     blurb: 'Clean cut-outs for the whole set' },
  retouch:     { id: 'retouch',     label: 'Retouch',               unit: 'photo', flatRateInr: 30,   actionId: 'retouch',       blurb: 'Skin, blemishes & cleanup at volume' },
  generate:    { id: 'generate',    label: 'Generate',              unit: 'image', flatRateInr: 10,   actionId: 'text-to-image', blurb: 'New on-brand visuals from a prompt' },
  transcribe:  { id: 'transcribe',  label: 'Subtitle / transcribe', unit: 'clip',  flatRateInr: 6,    actionId: 'transcribe',    blurb: 'Captions & transcripts, 90+ languages' },
}

export const TASK_ORDER: TaskId[] = [
  'cull', 'grade', 'enhance', 'remove-bg', 'retouch', 'generate', 'transcribe',
]

// ── Speed = the SLA the customer builds ───────────────────────────────────────

export interface SpeedTier {
  id: Tier
  label: string
  promise: string
  multiplier: number
  baseFeeInr: number
}

export const SPEED_TIERS: SpeedTier[] = [
  { id: 'flex',     label: 'Overnight', promise: 'Ready by tomorrow morning', multiplier: 1.0, baseFeeInr: 35 },
  { id: 'core',     label: 'Same day',  promise: 'Ready by this evening',     multiplier: 1.8, baseFeeInr: 75 },
  { id: 'priority', label: 'Express',   promise: 'Ready within the hour',     multiplier: 3.0, baseFeeInr: 150 },
]

export function speedTier(id: Tier): SpeedTier {
  return SPEED_TIERS.find((s) => s.id === id) ?? SPEED_TIERS[0]
}

// ── Outcome SLA constants (OUTCOME_SLA_SPEC.md) ───────────────────────────────
// MIRRORS ucin_network_factory/models.py SLA_* and ucin_creator_studio
// catalog.ts — guarded by the 3-way catalog-sync drift test. The pricing-parity
// rule: derive the enhance ITEM COUNT first (Math.round(E_INC × delivered)),
// then price count × rate — never delivered × rate × E_INC. Math.round's
// half-up matches the server's _js_round exactly.

/** Expected enhance/upscale incidence on the delivered set, per vertical. */
export const SLA_ENHANCE_INCIDENCE: Partial<Record<Vertical, number>> = { photo: 0.30 }
/** Delivered-size tolerance band (±%): culling is judgment, not arithmetic. */
export const SLA_DELIVERED_TOLERANCE_PCT = 10
/** Band presets for the delivered dial (fraction of input count). */
export const SLA_DELIVERED_BANDS = [0.12, 0.16, 0.25] as const

// ── Presets ───────────────────────────────────────────────────────────────────

export interface PresetTask {
  taskId: TaskId
  defaultShare: number
}

export interface Preset {
  id: string
  vertical: Vertical
  label: string
  blurb: string
  tasks: PresetTask[]
  /** Outcome-dial pre-fills (photo verticals): delivered gallery as a fraction
   *  of input, and heroes as a fraction of DELIVERED (so it scales with the
   *  gallery). Absent → the builder keeps per-step defaultShare behavior. */
  deliveredShare?: number
  heroShare?: number
}

export const PRESETS: Preset[] = [
  // Photographer / Studio
  { id: 'wedding-full', vertical: 'photo', label: 'Full wedding', blurb: 'Cull, grade in your style, enhance & retouch the heroes',
    tasks: [ { taskId: 'cull', defaultShare: 1 }, { taskId: 'grade', defaultShare: 0.35 }, { taskId: 'enhance', defaultShare: 0.05 }, { taskId: 'retouch', defaultShare: 0.05 } ],
    deliveredShare: 0.16, heroShare: 0.04 },
  { id: 'portraits', vertical: 'photo', label: 'Portrait session', blurb: 'Cull, grade & retouch every keeper',
    tasks: [ { taskId: 'cull', defaultShare: 1 }, { taskId: 'grade', defaultShare: 0.4 }, { taskId: 'retouch', defaultShare: 0.4 } ],
    deliveredShare: 0.25, heroShare: 1 },
  { id: 'event-highlights', vertical: 'photo', label: 'Event highlights', blurb: 'Cull the take, grade the keepers',
    tasks: [ { taskId: 'cull', defaultShare: 1 }, { taskId: 'grade', defaultShare: 0.3 } ],
    deliveredShare: 0.16, heroShare: 0 },
  { id: 'sneak-peek', vertical: 'photo', label: 'Sneak peek', blurb: 'A fast, graded teaser set',
    tasks: [ { taskId: 'cull', defaultShare: 1 }, { taskId: 'grade', defaultShare: 0.05 } ],
    deliveredShare: 0.05, heroShare: 0 },
  // Brands (id: ecom)
  { id: 'catalog', vertical: 'ecom', label: 'Product catalog', blurb: 'Cut out & standardise the whole catalog',
    tasks: [ { taskId: 'remove-bg', defaultShare: 1 }, { taskId: 'enhance', defaultShare: 1 } ] },
  { id: 'ghost-mannequin', vertical: 'ecom', label: 'Ghost mannequin', blurb: 'Invisible-mannequin apparel, cut out & cleaned up',
    tasks: [ { taskId: 'remove-bg', defaultShare: 1 }, { taskId: 'retouch', defaultShare: 1 } ] },
  { id: 'lifestyle', vertical: 'ecom', label: 'Lifestyle set', blurb: 'Drop products into on-brand scenes & polish',
    tasks: [ { taskId: 'generate', defaultShare: 1 }, { taskId: 'retouch', defaultShare: 0.5 } ] },
  { id: 'brand-social', vertical: 'ecom', label: 'Social drop', blurb: 'On-brand social visuals, generated & graded',
    tasks: [ { taskId: 'generate', defaultShare: 1 }, { taskId: 'grade', defaultShare: 1 } ] },
  // Agency
  { id: 'campaign', vertical: 'agency', label: 'Campaign', blurb: 'Generate on-brand variants & retouch',
    tasks: [ { taskId: 'generate', defaultShare: 1 }, { taskId: 'retouch', defaultShare: 1 } ] },
  { id: 'brand-refresh', vertical: 'agency', label: 'Brand refresh', blurb: 'One consistent look across an existing set',
    tasks: [ { taskId: 'grade', defaultShare: 1 }, { taskId: 'retouch', defaultShare: 0.3 } ] },
  { id: 'ad-variants', vertical: 'agency', label: 'Ad variants', blurb: 'Many on-brand variations from one concept',
    tasks: [ { taskId: 'generate', defaultShare: 1 } ] },
  // Creator
  { id: 'social', vertical: 'creator', label: 'Social pack', blurb: 'Grade, generate & subtitle for every channel',
    tasks: [ { taskId: 'grade', defaultShare: 1 }, { taskId: 'generate', defaultShare: 0.3 }, { taskId: 'transcribe', defaultShare: 0.2 } ] },
  { id: 'reels', vertical: 'creator', label: 'Reel pack', blurb: 'Grade your reels & burn in styled subtitles',
    tasks: [ { taskId: 'grade', defaultShare: 1 }, { taskId: 'transcribe', defaultShare: 1 } ] },
  { id: 'thumbnails', vertical: 'creator', label: 'Thumbnail batch', blurb: 'Click-worthy thumbnails from a prompt',
    tasks: [ { taskId: 'generate', defaultShare: 1 } ] },
]

export function presetsFor(vertical: Vertical): Preset[] {
  return PRESETS.filter((p) => p.vertical === vertical)
}

export function defaultCounts(preset: Preset, totalItems: number): Record<TaskId, number> {
  const out = {} as Record<TaskId, number>
  for (const t of preset.tasks) {
    out[t.taskId] = Math.max(0, Math.round(totalItems * t.defaultShare))
  }
  return out
}

// ── Outcome dials → step counts (OUTCOME_SLA_SPEC.md) ─────────────────────────

/** The 3 numbers the customer actually knows. Everything else derives. */
export interface OutcomeDials {
  inputCount: number
  deliveredTarget: number
  heroCount: number
}

/** Does this preset use the outcome-dial model? (photo verticals, pre-filled
 *  via deliveredShare/heroShare). Others keep the per-step defaultShare flow. */
export function usesDials(preset: Preset | undefined): boolean {
  return preset?.deliveredShare != null
}

/** Below this input size, percentage culling is meaningless (round(1×16%)=0
 *  would deliver ZERO photos) — small shoots default to finishing everything,
 *  and the UI hides the percentage bands entirely. */
export const SLA_SMALL_SHOOT_MAX = 100

/** Pre-fill the dials from the preset's outcome shape. Small shoots finish
 *  every frame; large ones target the preset's industry-standard share. */
export function defaultDials(preset: Preset, inputCount: number): OutcomeDials {
  const delivered = inputCount <= SLA_SMALL_SHOOT_MAX
    ? inputCount
    : Math.max(1, Math.round(inputCount * (preset.deliveredShare ?? 0.16)))
  return {
    inputCount,
    deliveredTarget: delivered,
    heroCount: Math.min(delivered, Math.max(0, Math.round(delivered * (preset.heroShare ?? 0)))),
  }
}

/** The delivered-dial band chips, with MEANING — the customer shouldn't need
 *  to know culling ratios; the preset default is marked recommended. */
export const SLA_BAND_LABELS: Record<number, string> = {
  0.12: 'Tight edit',
  0.16: 'Standard delivery',
  0.25: 'Generous',
}

/**
 * The dial → step-count derivation (parity twin of the server's
 * _dials_to_batch_plan): cull runs on everything, grade on the delivered set,
 * enhance is need-based at expected incidence (count derived FIRST, half-up),
 * retouch on the heroes. Only steps the preset includes are emitted.
 */
export function dialsToLines(dials: OutcomeDials, preset: Preset): { taskId: TaskId; count: number }[] {
  const eInc = SLA_ENHANCE_INCIDENCE[preset.vertical] ?? 0.30
  const counts: Partial<Record<TaskId, number>> = {
    cull: dials.inputCount,
    grade: dials.deliveredTarget,
    enhance: Math.round(eInc * dials.deliveredTarget),
    retouch: dials.heroCount,
  }
  return preset.tasks
    .map((t) => ({ taskId: t.taskId, count: counts[t.taskId] ?? Math.round(dials.inputCount * t.defaultShare) }))
    .filter((l) => l.count > 0)
}

/** The outcome quote — the same fixed-price math (quoteEvent) over dial-derived
 *  lines, so client quote == server contract == Σ batch bills. */
export function slaQuote(dials: OutcomeDials, preset: Preset, speedId: Tier, toggles: EventToggles): EventQuote {
  return quoteEvent(dialsToLines(dials, preset), speedId, toggles)
}

// ── Recommended models: specialised per workspace (curated) ───────────────────

export interface StudioModel {
  id: string
  name: string
  vertical: Vertical
  /** The step this model powers, if any. */
  taskId?: TaskId
  blurb: string
  /** State-of-the-art base/architecture this is built on (for credibility). */
  base?: string
}

export const MODELS: StudioModel[] = [
  // ── Photographer / Studio ──────────────────────────────────────────────────
  { id: 'event-cull',         name: 'Smart Event Cull',    vertical: 'photo',  taskId: 'cull',     base: 'UCIN Cull',          blurb: 'Keeps sharp, eyes-open, best-of-burst frames; drops blinks, blur & dupes' },
  { id: 'wed-timeless',       name: 'Timeless Wedding',    vertical: 'photo',  taskId: 'grade',    base: 'Style LoRA',         blurb: 'Warm, classic film-inspired colour for weddings' },
  { id: 'editorial-portrait', name: 'Editorial Portrait',  vertical: 'photo',  taskId: 'grade',    base: 'Style LoRA',         blurb: 'Clean, magazine-style colour & tone' },
  { id: 'moody-cinematic',    name: 'Moody Cinematic',     vertical: 'photo',  taskId: 'grade',    base: 'Style LoRA',         blurb: 'Deep, filmic teal-orange contrast' },
  { id: 'true-bw',            name: 'True Black & White',  vertical: 'photo',  taskId: 'grade',    base: 'Style LoRA',         blurb: 'Rich, intentional monochrome conversion' },
  { id: 'natural-skin',       name: 'Natural Skin Retouch', vertical: 'photo', taskId: 'retouch',  base: 'Freq-sep + GFPGAN', blurb: 'Subtle, realistic skin — keeps texture' },
  { id: 'hd-restore',         name: 'HD Upscale + Face Restore', vertical: 'photo', taskId: 'enhance', base: 'Real-ESRGAN + GFPGAN', blurb: '4× sharper, faces restored, print-ready' },
  { id: 'your-style-photo',   name: 'Your Trained Style',  vertical: 'photo',  taskId: 'grade',    base: 'Your data',          blurb: 'Trained on your own edits — sharpens every shoot' },

  // ── Agency ─────────────────────────────────────────────────────────────────
  { id: 'brand-generate',     name: 'Brand Generate',      vertical: 'agency', taskId: 'generate', base: 'FLUX.1 [schnell]',             blurb: 'On-brand visuals & variants from your prompts' },
  { id: 'product-scene',      name: 'Product in Scene',    vertical: 'agency', taskId: 'generate', base: 'SDXL + ControlNet',  blurb: 'Drop products into any lifestyle scene' },
  { id: 'campaign-grade',     name: 'Campaign Grade',      vertical: 'agency', taskId: 'grade',    base: 'Style LoRA',         blurb: 'One consistent look across the whole set' },
  { id: 'ad-retouch',         name: 'Ad-Ready Retouch',    vertical: 'agency', taskId: 'retouch',  base: 'Freq-sep + inpaint',  blurb: 'Crisp product & talent cleanup' },
  { id: 'hero-upscale',       name: 'Hero Upscale',        vertical: 'agency', taskId: 'enhance',  base: 'Real-ESRGAN',        blurb: 'Billboard-grade upscaling for hero assets' },
  { id: 'your-style-agency',  name: 'Your Brand Look',     vertical: 'agency', taskId: 'grade',    base: 'Your data',          blurb: 'Train once on your brand, apply everywhere' },

  // ── Brands (id: ecom) ────────────────────────────────────────────────────────
  { id: 'clean-white',        name: 'Clean White',         vertical: 'ecom',   taskId: 'remove-bg', base: 'U²-Net',          blurb: 'Pure-white marketplace backgrounds' },
  { id: 'transparent-cutout', name: 'Transparent Cut-out', vertical: 'ecom',   taskId: 'remove-bg', base: 'U²-Net',          blurb: 'Hair-level transparent PNGs' },
  { id: 'ghost-mannequin',    name: 'Ghost Mannequin',     vertical: 'ecom',   taskId: 'remove-bg', base: 'U²-Net + matting', blurb: 'Invisible-mannequin apparel shots' },
  { id: 'catalog-standard',   name: 'Catalog Standardize', vertical: 'ecom',   taskId: 'enhance',   base: 'UCIN Pipeline',     blurb: 'Uniform size, light & crop across the catalog' },
  { id: 'shadow-reflect',     name: 'Shadow & Reflection', vertical: 'ecom',   taskId: 'generate',  base: 'SDXL',              blurb: 'Natural shadows for floating products' },
  { id: 'lifestyle-scene',    name: 'Lifestyle Scene',     vertical: 'ecom',   taskId: 'generate',  base: 'SDXL + ControlNet', blurb: 'Place products in on-brand lifestyle scenes' },
  { id: 'on-model',           name: 'On-Model Try-On',     vertical: 'ecom',   taskId: 'generate',  base: 'SDXL + ControlNet', blurb: 'Show apparel on a photoreal model' },
  { id: 'your-style-ecom',    name: 'Your Brand Look',     vertical: 'ecom',   taskId: 'enhance',   base: 'Your data',         blurb: 'Match your brand’s exact look, every time' },

  // ── Creator ────────────────────────────────────────────────────────────────
  { id: 'social-pop',         name: 'Social Pop',          vertical: 'creator', taskId: 'grade',     base: 'Style LoRA',        blurb: 'Punchy, scroll-stopping colour' },
  { id: 'cinematic-lut',      name: 'Cinematic LUT',       vertical: 'creator', taskId: 'grade',     base: 'Style LoRA',        blurb: 'Film-style colour for reels' },
  { id: 'thumb-generate',     name: 'Thumbnail Generate',  vertical: 'creator', taskId: 'generate',  base: 'FLUX.1 [schnell]',            blurb: 'Click-worthy thumbnails from a prompt' },
  { id: 'styled-subs',        name: 'Styled Subtitles',    vertical: 'creator', taskId: 'transcribe', base: 'Whisper',          blurb: 'Readable, branded captions — 90+ languages' },
  { id: 'creator-brand',      name: 'Your Brand Look',     vertical: 'creator', taskId: 'grade',     base: 'Your data',         blurb: 'Train once, apply everywhere' },
]

export function modelsFor(vertical: Vertical): StudioModel[] {
  return MODELS.filter((m) => m.vertical === vertical)
}

// ── SLA value-toggles: priced extras the customer adds at quote time ──────────

export type ToggleId = 'privacy' | 'guarantee' | 'whitelabel'

export interface EventToggles {
  privacy: boolean
  guarantee: boolean
  whitelabel: boolean
}

export const NO_TOGGLES: EventToggles = { privacy: false, guarantee: false, whitelabel: false }

export interface ToggleDef {
  id: ToggleId
  label: string
  blurb: string
  kind: 'pct' | 'flat'
  /** pct → fraction of the (items × speed) subtotal; flat → INR added once. */
  amount: number
}

export const TOGGLES: ToggleDef[] = [
  { id: 'privacy',    label: 'Private & dedicated',  blurb: 'Single-tenant, isolated processing — for confidential work', kind: 'pct',  amount: 0.40 },
  { id: 'guarantee',  label: 'Guaranteed deadline',  blurb: 'On your deadline, or it’s credited back',                    kind: 'pct',  amount: 0.15 },
  { id: 'whitelabel', label: 'White-label delivery', blurb: 'Deliver as a branded client gallery',                        kind: 'flat', amount: 299 },
]

/** One-time dedicated CC-H100 provisioning fee, added once when privacy is on —
 *  keeps even small confidential jobs margin-positive. */
export const CONFIDENTIAL_SETUP_INR = 500

// ── Quote: client-side preview, identical to the backend's number ─────────────

export interface QuoteLine {
  taskId: TaskId
  label: string
  unit: string
  count: number
  rate: number
  lineTotal: number
}

export interface ToggleLine {
  id: ToggleId
  label: string
  amountInr: number
}

export interface EventQuote {
  lines: QuoteLine[]
  baseFeeInr: number
  itemsSubtotalInr: number
  multiplier: number
  speedSubtotalInr: number
  toggleLines: ToggleLine[]
  totalInr: number
  speed: SpeedTier
}

const round2 = (n: number): number => Math.round(n * 100) / 100

/** total = baseFee[speed] + Σ(count × flatRate) × multiplier[speed] + SLA toggles. */
export function quoteEvent(
  lines: { taskId: TaskId; count: number }[],
  speedId: Tier,
  toggles: EventToggles = NO_TOGGLES,
): EventQuote {
  const speed = speedTier(speedId)
  const quoteLines: QuoteLine[] = lines
    .filter((l) => l.count > 0)
    .map((l) => {
      const def = TASKS[l.taskId]
      return {
        taskId: l.taskId,
        label: def.label,
        unit: def.unit,
        count: l.count,
        rate: def.flatRateInr,
        lineTotal: round2(l.count * def.flatRateInr),
      }
    })
  const itemsSubtotal = round2(quoteLines.reduce((s, l) => s + l.lineTotal, 0))
  const speedSubtotal = round2(itemsSubtotal * speed.multiplier)

  const toggleLines: ToggleLine[] = []
  for (const t of TOGGLES) {
    if (!toggles[t.id]) continue
    let amt = t.kind === 'pct' ? round2(speedSubtotal * t.amount) : t.amount
    if (t.id === 'privacy') amt = round2(amt + CONFIDENTIAL_SETUP_INR) // dedicated CC-H100 setup (once)
    toggleLines.push({ id: t.id, label: t.label, amountInr: amt })
  }
  const togglesTotal = round2(toggleLines.reduce((s, t) => s + t.amountInr, 0))
  const total = round2(speed.baseFeeInr + speedSubtotal + togglesTotal)

  return {
    lines: quoteLines,
    baseFeeInr: speed.baseFeeInr,
    itemsSubtotalInr: itemsSubtotal,
    multiplier: speed.multiplier,
    speedSubtotalInr: speedSubtotal,
    toggleLines,
    totalInr: total,
    speed,
  }
}
