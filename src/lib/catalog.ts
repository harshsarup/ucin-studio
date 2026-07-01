/**
 * UCIN Studio — creative product catalog & vocabulary (web port).
 *
 * Mirror of ucin_creator_studio/src/shared/catalog.ts so the browser app and the
 * desktop agent quote identically. Keep the two in sync (rates, presets, speed).
 * Framework-agnostic; `Tier` is declared locally (no cross-repo dependency).
 */

export type Tier = 'priority' | 'core' | 'flex'

// ── Verticals: one object, labelled for the user's world ──────────────────────

export type Vertical = 'photo' | 'agency' | 'ecom' | 'realestate' | 'creator'

export interface VerticalLabels {
  label: string
  object: string
  objectPlural: string
  newCta: string
}

export const VERTICALS: Record<Vertical, VerticalLabels> = {
  photo:      { label: 'Photographer / Studio', object: 'Shoot',    objectPlural: 'Shoots',    newCta: 'New shoot' },
  agency:     { label: 'Agency',                 object: 'Campaign', objectPlural: 'Campaigns', newCta: 'New campaign' },
  ecom:       { label: 'E-commerce',             object: 'Catalog',  objectPlural: 'Catalogs',  newCta: 'New catalog' },
  realestate: { label: 'Real estate',            object: 'Listing',  objectPlural: 'Listings',  newCta: 'New listing' },
  creator:    { label: 'Creator',                object: 'Project',  objectPlural: 'Projects',  newCta: 'New project' },
}

export const VERTICAL_ORDER: Vertical[] = ['photo', 'agency', 'ecom', 'creator']

// ── Task catalog: each maps to a backend action_id + flat Flex rate ───────────

export type TaskId =
  | 'cull' | 'grade' | 'enhance' | 'remove-bg'
  | 'retouch' | 'generate' | 'staging' | 'transcribe'

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
  staging:     { id: 'staging',     label: 'Virtual staging',       unit: 'room',  flatRateInr: 249,  actionId: 'staging',       blurb: 'Furnish empty rooms, photoreal' },
  transcribe:  { id: 'transcribe',  label: 'Subtitle / transcribe', unit: 'clip',  flatRateInr: 6,    actionId: 'transcribe',    blurb: 'Captions & transcripts, 90+ languages' },
}

export const TASK_ORDER: TaskId[] = [
  'cull', 'grade', 'enhance', 'remove-bg', 'retouch', 'generate', 'staging', 'transcribe',
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
}

export const PRESETS: Preset[] = [
  { id: 'wedding-full', vertical: 'photo', label: 'Full wedding', blurb: 'Cull, grade in your style, enhance & retouch the heroes',
    tasks: [ { taskId: 'cull', defaultShare: 1 }, { taskId: 'grade', defaultShare: 0.35 }, { taskId: 'enhance', defaultShare: 0.05 }, { taskId: 'retouch', defaultShare: 0.05 } ] },
  { id: 'sneak-peek', vertical: 'photo', label: 'Sneak peek', blurb: 'A fast, graded teaser set',
    tasks: [ { taskId: 'cull', defaultShare: 1 }, { taskId: 'grade', defaultShare: 0.05 } ] },
  { id: 'catalog', vertical: 'ecom', label: 'Catalog', blurb: 'Cut out & standardise the whole catalog',
    tasks: [ { taskId: 'remove-bg', defaultShare: 1 }, { taskId: 'enhance', defaultShare: 1 } ] },
  { id: 'listing', vertical: 'realestate', label: 'Listing', blurb: 'Enhance, then virtually stage the empty rooms',
    tasks: [ { taskId: 'enhance', defaultShare: 1 }, { taskId: 'staging', defaultShare: 0.4 } ] },
  { id: 'campaign', vertical: 'agency', label: 'Campaign', blurb: 'Generate on-brand variants & retouch',
    tasks: [ { taskId: 'generate', defaultShare: 1 }, { taskId: 'retouch', defaultShare: 1 } ] },
  { id: 'social', vertical: 'creator', label: 'Social pack', blurb: 'Grade, generate & subtitle for every channel',
    tasks: [ { taskId: 'grade', defaultShare: 1 }, { taskId: 'generate', defaultShare: 0.3 }, { taskId: 'transcribe', defaultShare: 0.2 } ] },
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

  // ── E-commerce ─────────────────────────────────────────────────────────────
  { id: 'clean-white',        name: 'Clean White',         vertical: 'ecom',   taskId: 'remove-bg', base: 'U²-Net',          blurb: 'Pure-white marketplace backgrounds' },
  { id: 'transparent-cutout', name: 'Transparent Cut-out', vertical: 'ecom',   taskId: 'remove-bg', base: 'U²-Net',          blurb: 'Hair-level transparent PNGs' },
  { id: 'ghost-mannequin',    name: 'Ghost Mannequin',     vertical: 'ecom',   taskId: 'remove-bg', base: 'U²-Net + matting', blurb: 'Invisible-mannequin apparel shots' },
  { id: 'catalog-standard',   name: 'Catalog Standardize', vertical: 'ecom',   taskId: 'enhance',   base: 'UCIN Pipeline',     blurb: 'Uniform size, light & crop across the catalog' },
  { id: 'shadow-reflect',     name: 'Shadow & Reflection', vertical: 'ecom',   taskId: 'generate',  base: 'SDXL',              blurb: 'Natural shadows for floating products' },
  { id: 'your-style-ecom',    name: 'Your Catalog Look',   vertical: 'ecom',   taskId: 'enhance',   base: 'Your data',         blurb: 'Match your store’s exact look, every time' },

  // ── Real estate ────────────────────────────────────────────────────────────
  { id: 'bright-airy',        name: 'Bright & Airy',       vertical: 'realestate', taskId: 'enhance', base: 'UCIN Pipeline',    blurb: 'Bright, true-to-life interiors' },
  { id: 'hdr-blend',          name: 'HDR Window Blend',    vertical: 'realestate', taskId: 'enhance', base: 'Exposure-fusion',  blurb: 'Balanced windows & interiors in one frame' },
  { id: 'twilight-sky',       name: 'Twilight Sky',        vertical: 'realestate', taskId: 'enhance', base: 'SDXL inpaint',     blurb: 'Dramatic dusk sky replacement' },
  { id: 'staged-modern',      name: 'Virtual Staging — Modern', vertical: 'realestate', taskId: 'staging', base: 'SDXL + depth',  blurb: 'Photoreal contemporary furniture' },
  { id: 'staged-scandi',      name: 'Virtual Staging — Scandi', vertical: 'realestate', taskId: 'staging', base: 'SDXL + depth',  blurb: 'Light, minimal staging' },
  { id: 'declutter',          name: 'Declutter / Removal', vertical: 'realestate', taskId: 'retouch', base: 'LaMa inpaint',     blurb: 'Remove clutter & personal items' },

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
