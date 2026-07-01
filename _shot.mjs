// Temp dev tool: full-page screenshot with scroll-reveals triggered.
// usage: node _shot.mjs <url> <outPath>
import puppeteer from 'puppeteer-core'

const url = process.argv[2] || 'http://localhost:4173/'
const out = process.argv[3] || 'shot.png'
const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'

const b = await puppeteer.launch({
  executablePath: CHROME,
  headless: 'new',
  args: ['--no-sandbox', '--hide-scrollbars'],
})
const p = await b.newPage()
await p.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 })
await p.goto(url, { waitUntil: 'load', timeout: 30000 })
await new Promise((r) => setTimeout(r, 1200))

// drive Lenis via wheel events so IntersectionObserver reveals fire
await p.mouse.move(720, 450)
const height = await p.evaluate(() => document.body.scrollHeight)
for (let y = 0; y < height; y += 500) {
  await p.mouse.wheel({ deltaY: 500 })
  await new Promise((r) => setTimeout(r, 130))
}
await new Promise((r) => setTimeout(r, 1000))
await p.evaluate(() => window.scrollTo(0, 0))
await new Promise((r) => setTimeout(r, 600))

await p.screenshot({ path: out, fullPage: true })
await b.close()
console.log('shot:', out)
