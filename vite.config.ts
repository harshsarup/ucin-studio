import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'node:url'

// Dev proxies the creator API path-prefixes to the local Control Plane so the
// marketing site can read live pricing from /customer/config and sign in via
// /auth/* with no CORS hassle. The customer + auth API is `main:app` on :8001
// (port :8000 is the separate Exchange Control Plane, which has no /auth or
// /customer). Override with UCIN_CP_URL when the backend runs elsewhere.
// In production set VITE_API_BASE = https://api.ucin.in (client calls it directly).
const BACKEND = process.env.UCIN_CP_URL ?? 'http://localhost:8001'
const proxy = Object.fromEntries(
  ['/customer', '/auth', '/health'].map((p) => [p, { target: BACKEND, changeOrigin: true }]),
)

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },
  server: { port: 5174, proxy },
  build: { outDir: 'dist', sourcemap: false },
})
