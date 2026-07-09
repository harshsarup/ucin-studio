/**
 * Headless render smoke — proves every route actually MOUNTS in a real Chrome,
 * with zero console errors and zero uncaught exceptions, against the production
 * build. HTTP 200s alone can't catch a blank React tree; this can.
 *
 * Usage: npm run build && npx vite preview --port 4173 &  then:
 *        node scripts/smoke.mjs [baseUrl]
 * Exits non-zero on any failure.
 */
import puppeteer from 'puppeteer-core'
import { existsSync } from 'node:fs'

const BASE = process.argv[2] ?? 'http://localhost:4173'
const CHROME_PATHS = [
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
  `${process.env.LOCALAPPDATA}/Google/Chrome/Application/chrome.exe`,
  '/usr/bin/google-chrome',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
]
const executablePath = CHROME_PATHS.find((p) => existsSync(p))
if (!executablePath) {
  console.error('FAIL  no Chrome executable found')
  process.exit(1)
}

// Each route + a marker string that must appear in the rendered DOM (proves the
// right component mounted, not just any HTML).
const ROUTES = [
  ['/',         /UCIN|production/i],
  ['/app',      /quote|workspace|photographer/i],
  ['/login',    /sign in|google/i],
  ['/team',     /team/i],
  ['/download', /desktop|install/i],
  ['/contact',  /contact|message/i],
  ['/privacy',  /privacy/i],
  ['/terms',    /terms/i],
  ['/no-such-page', /UCIN|production/i], // catch-all → landing
]

const browser = await puppeteer.launch({ executablePath, headless: true })
let failures = 0
try {
  const page = await browser.newPage()
  const errors = []
  page.on('console', (m) => { if (m.type() === 'error') errors.push(`console.error: ${m.text()}`) })
  page.on('pageerror', (e) => errors.push(`pageerror: ${e.message}`))

  for (const [route, marker] of ROUTES) {
    errors.length = 0
    const res = await page.goto(BASE + route, { waitUntil: 'networkidle0', timeout: 30_000 })
    // Give lazy routes a beat to hydrate.
    await new Promise((r) => setTimeout(r, 400))
    const text = await page.evaluate(() => document.body.innerText)
    const rootChildren = await page.evaluate(() => document.getElementById('root')?.childElementCount ?? 0)

    const problems = []
    if (!res || res.status() >= 400) problems.push(`http ${res?.status()}`)
    if (rootChildren === 0) problems.push('empty #root — React did not mount')
    if (!marker.test(text)) problems.push(`marker ${marker} not found in rendered text`)
    // Network errors for the API being offline are expected in a local smoke —
    // only fail on script/render errors.
    const hard = errors.filter((e) => !/net::|Failed to load resource|ERR_CONNECTION/i.test(e))
    if (hard.length) problems.push(...hard)

    if (problems.length) {
      failures++
      console.error(`FAIL  ${route}\n      ${problems.join('\n      ')}`)
    } else {
      console.log(`PASS  ${route} (${text.length} chars rendered)`)
    }
  }
} finally {
  await browser.close()
}

if (failures) {
  console.error(`\n${failures} route(s) failed the render smoke`)
  process.exit(1)
}
console.log('\nALL ROUTES RENDER CLEAN')
