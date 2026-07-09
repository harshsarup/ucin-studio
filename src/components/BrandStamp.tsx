import { useEffect, useMemo, useRef, useState, type CSSProperties } from 'react'
import { Download, ImagePlus, X, ChevronLeft, ChevronRight } from 'lucide-react'
import type { ResultArtifact } from '@/api/pipeline'
import {
  ANCHORS, loadWebBrand, saveWebBrand, logoFileToDataUrl,
  stampFromUrl, downloadBlob,
  type WatermarkSpec, type WatermarkAnchor,
} from '@/lib/watermark'

/** CSS placement mirroring the canvas stamp for the given anchor. Insets differ
 *  per axis: the spec is relative to the image's short edge, CSS %s to each axis. */
function anchorCss(anchor: WatermarkAnchor, hInsetPct: number, vInsetPct: number): CSSProperties {
  const css: CSSProperties = { position: 'absolute' }
  if (anchor.endsWith('left')) css.left = `${hInsetPct}%`
  else if (anchor.endsWith('right')) css.right = `${hInsetPct}%`
  else { css.left = '50%'; css.transform = 'translateX(-50%)' }
  if (anchor.startsWith('top')) css.top = `${vInsetPct}%`
  else if (anchor.startsWith('bottom')) css.bottom = `${vInsetPct}%`
  else {
    css.top = '50%'
    css.transform = css.transform ? 'translate(-50%,-50%)' : 'translateY(-50%)'
  }
  return css
}

const IMG_NAME = /\.(jpe?g|png|webp|avif|gif)$/i

/**
 * BrandStamp — deliver browser results under the studio's own mark. The logo +
 * spec persist in this browser; every unit is relative to each image's short
 * edge, so one setting composes identically across the whole result set.
 * Stamping runs in-page (Canvas) — the logo never leaves the browser.
 */
export function BrandStamp({ artifacts }: { artifacts: ResultArtifact[] }) {
  const images = useMemo(
    () => artifacts.filter((a) => a.kind === 'image' || IMG_NAME.test(a.filename)),
    [artifacts],
  )

  const brand0 = useRef(loadWebBrand()).current
  const [logoDataUrl, setLogoDataUrl] = useState<string | null>(brand0.logoDataUrl)
  const [stamp, setStamp] = useState<WatermarkSpec>(brand0.stamp)
  const [open, setOpen] = useState(false)
  const [previewIdx, setPreviewIdx] = useState(0)
  const [previewAspect, setPreviewAspect] = useState(1.5)
  const [busy, setBusy] = useState(false)
  const [progress, setProgress] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    saveWebBrand({ logoDataUrl, stamp })
  }, [logoDataUrl, stamp])

  useEffect(() => {
    setPreviewIdx(0)
  }, [images])

  if (images.length === 0) return null

  const setS = <K extends keyof WatermarkSpec>(k: K, v: WatermarkSpec[K]): void =>
    setStamp((s) => ({ ...s, [k]: v }))

  const pickLogo = async (file: File | undefined): Promise<void> => {
    if (!file) return
    setError('')
    try {
      setLogoDataUrl(await logoFileToDataUrl(file))
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not read the logo.')
    }
  }

  const stampAndDownload = async (targets: ResultArtifact[]): Promise<void> => {
    if (!logoDataUrl) return
    setBusy(true); setError('')
    try {
      for (let i = 0; i < targets.length; i++) {
        const a = targets[i]
        setProgress(targets.length > 1 ? `${i + 1}/${targets.length} · ${a.filename}` : a.filename)
        const blob = await stampFromUrl(a.download_url, logoDataUrl, stamp)
        const ext = blob.type === 'image/png' ? 'png' : 'jpg'
        downloadBlob(blob, `${a.filename.replace(/\.[^.]+$/, '')}-branded.${ext}`)
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Stamping failed.')
    } finally {
      setBusy(false); setProgress('')
    }
  }

  const preview = images[Math.min(previewIdx, images.length - 1)]
  const shortOverW = previewAspect >= 1 ? 1 / previewAspect : 1
  const shortOverH = previewAspect >= 1 ? 1 : previewAspect
  const logoWidthPct = stamp.sizePct * shortOverW * 100
  const hInsetPct = stamp.marginPct * shortOverW * 100
  const vInsetPct = stamp.marginPct * shortOverH * 100

  return (
    <div className="rounded-lg border border-canvas-border px-3 py-3">
      <button onClick={() => setOpen((o) => !o)} className="flex w-full items-center justify-between gap-2 text-left">
        <span className="text-[13px] font-semibold text-fg">Deliver with your logo</span>
        <span className="text-[12px] text-fg-faint">{open ? 'Hide' : logoDataUrl ? 'Open' : 'Set up'}</span>
      </button>

      {open && (
        <div className="mt-3 space-y-3">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <label className="btn-line cursor-pointer text-[13px]">
              <input
                type="file"
                accept="image/png,image/jpeg,image/webp"
                className="hidden"
                onChange={(e) => void pickLogo(e.target.files?.[0])}
              />
              <ImagePlus size={14} /> {logoDataUrl ? 'Change logo' : 'Add your logo'}
            </label>
            {logoDataUrl && (
              <span className="flex items-center gap-2">
                <img src={logoDataUrl} alt="" className="h-7 max-w-[120px] object-contain" />
                <button onClick={() => setLogoDataUrl(null)} className="text-fg-faint hover:text-fg" aria-label="Remove logo"><X size={13} /></button>
              </span>
            )}
            {!logoDataUrl && <span className="text-[12px] text-fg-faint">PNG with transparency works best. It never leaves this browser.</span>}
          </div>

          {logoDataUrl && (
            <>
              <div className="grid grid-cols-[auto_1fr] gap-4">
                {/* Anchor grid */}
                <div>
                  <div className="mb-1 text-[11px] text-fg-faint">Position</div>
                  <div className="grid w-fit grid-cols-3 gap-1">
                    {ANCHORS.map((a) => (
                      <button
                        key={a}
                        onClick={() => setS('anchor', a)}
                        title={a.replace('-', ' ')}
                        aria-label={a.replace('-', ' ')}
                        className="h-7 w-7 rounded border transition-colors"
                        style={stamp.anchor === a
                          ? { borderColor: 'var(--accent)', background: 'var(--tint)' }
                          : { borderColor: 'var(--border)' }}
                      >
                        <span
                          className="mx-auto block h-1.5 w-1.5 rounded-full"
                          style={{ background: stamp.anchor === a ? 'var(--accent)' : 'var(--border)' }}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Size / opacity / margin — relative to each image's short edge */}
                <div className="space-y-2">
                  <div>
                    <div className="flex items-center justify-between text-[11px] text-fg-faint">
                      <span>Size</span><span>{Math.round(stamp.sizePct * 100)}%</span>
                    </div>
                    <input type="range" min={3} max={60} value={Math.round(stamp.sizePct * 100)}
                      onChange={(e) => setS('sizePct', Number(e.target.value) / 100)} className="w-full" />
                  </div>
                  <div>
                    <div className="flex items-center justify-between text-[11px] text-fg-faint">
                      <span>Opacity</span><span>{Math.round(stamp.opacity * 100)}%</span>
                    </div>
                    <input type="range" min={5} max={100} value={Math.round(stamp.opacity * 100)}
                      onChange={(e) => setS('opacity', Number(e.target.value) / 100)} className="w-full" />
                  </div>
                  <div>
                    <div className="flex items-center justify-between text-[11px] text-fg-faint">
                      <span>Margin</span><span>{(stamp.marginPct * 100).toFixed(1)}%</span>
                    </div>
                    <input type="range" min={0} max={100} value={Math.round(stamp.marginPct * 500)}
                      onChange={(e) => setS('marginPct', Number(e.target.value) / 500)} className="w-full" />
                  </div>
                </div>
              </div>

              {/* Live preview at the artifact's true aspect */}
              <div>
                <div className="mb-1 flex items-center justify-between text-[11px] text-fg-faint">
                  <span>Preview — {preview.filename}</span>
                  {images.length > 1 && (
                    <span className="flex items-center gap-1">
                      <button onClick={() => setPreviewIdx((i) => (i - 1 + images.length) % images.length)}
                        className="rounded p-0.5 hover:text-fg" aria-label="Previous result"><ChevronLeft size={13} /></button>
                      <button onClick={() => setPreviewIdx((i) => (i + 1) % images.length)}
                        className="rounded p-0.5 hover:text-fg" aria-label="Next result"><ChevronRight size={13} /></button>
                    </span>
                  )}
                </div>
                <div
                  className="relative mx-auto max-h-64 overflow-hidden rounded-lg border border-canvas-border bg-canvas-sunk"
                  style={{ aspectRatio: String(previewAspect) }}
                >
                  <img
                    src={preview.download_url}
                    alt=""
                    onLoad={(e) => {
                      const img = e.currentTarget
                      if (img.naturalWidth && img.naturalHeight) setPreviewAspect(img.naturalWidth / img.naturalHeight)
                    }}
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                  <img
                    src={logoDataUrl}
                    alt=""
                    style={{ ...anchorCss(stamp.anchor, hInsetPct, vInsetPct), width: `${logoWidthPct}%`, opacity: stamp.opacity }}
                  />
                </div>
                <p className="mt-1 text-[10.5px] text-fg-faint">
                  Sizes scale with each image, so the mark sits identically on portraits, landscapes, and any resolution.
                </p>
              </div>

              {error && <p className="text-[12px]" style={{ color: '#c0362c' }}>{error}</p>}

              <div className="flex flex-wrap items-center gap-2">
                <button onClick={() => void stampAndDownload(images)} disabled={busy} className="btn-primary text-[13px]">
                  <Download size={14} /> {busy ? `Stamping ${progress}…` : `Download all branded (${images.length})`}
                </button>
                <button onClick={() => void stampAndDownload([preview])} disabled={busy} className="btn-line text-[13px]">
                  This one only
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  )
}
