# Sample images for the UCIN Studio marketing site

The site ships with **placeholder photos** (from picsum.photos) so it looks real
immediately. To make it a 10/10, replace them with **real before/after pairs and
generated samples** — ideally produced by running images **through the UCIN
platform itself** (dogfooding = the most authentic proof you can show).

## Where to put them

Drop the files in **this folder** (`ucin_studio/public/samples/`), then open
`src/lib/samples.ts` and change the URLs from the `ph(...)` placeholders to the
local paths, e.g. `'/samples/upscale-before.jpg'`.

## Files to provide

| Filename | What it is | How to make it |
|---|---|---|
| `upscale-before.jpg`  | a low-res photo (e.g. 800×600) | any of your shoots, or a free stock photo |
| `upscale-after.jpg`   | the same photo upscaled 4× | **run `upscale-before.jpg` through UCIN's Upscale task** |
| `rembg-before.jpg`    | a product/portrait shot | your work, or stock |
| `rembg-after.png`     | same image, background removed | **run it through UCIN's Remove-background task** |
| `style-before.jpg`    | an unedited frame | your work |
| `style-after.jpg`     | same frame with a Brand-Style applied | **train a Brand-Style, then apply it** |
| `gen-1.jpg` … `gen-6.jpg` | 6 generated visuals | **run UCIN's Generate-visuals task** from prompts |

## Sourcing "before" images for testing

- Your own portfolio / past client work (best — real and on-brand).
- Free stock: Unsplash, Pexels (download a few low-res exports to upscale).

Aim for **landscape ~4:3** for the before/after sliders and **square** for the
generated gallery. Keep each file under ~400 KB so the page stays fast.
