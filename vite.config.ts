import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'node:url'

// Dev proxies the creator API path-prefixes to the local Control Plane so the
// marketing site can read live pricing from /customer/config with no CORS hassle.
// In production set VITE_API_BASE = https://api.ucin.in (client calls it directly).
const BACKEND = process.env.UCIN_CP_URL ?? 'http://localhost:8000'
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
