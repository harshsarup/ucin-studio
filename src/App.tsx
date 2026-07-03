import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Landing } from '@/pages/Landing'

// Landing is the primary entry (eager). Everything else is code-split so the
// marketing page doesn't ship the app's crypto/pipeline or the other routes.
const AppPage = lazy(() => import('@/pages/AppPage').then((m) => ({ default: m.AppPage })))
const Login = lazy(() => import('@/pages/Login').then((m) => ({ default: m.Login })))
const Team = lazy(() => import('@/pages/Team').then((m) => ({ default: m.Team })))
const DesktopDownload = lazy(() => import('@/pages/DesktopDownload').then((m) => ({ default: m.DesktopDownload })))
const Contact = lazy(() => import('@/pages/Contact').then((m) => ({ default: m.Contact })))
const Privacy = lazy(() => import('@/pages/Privacy').then((m) => ({ default: m.Privacy })))
const Terms = lazy(() => import('@/pages/Terms').then((m) => ({ default: m.Terms })))

export default function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<div className="min-h-screen bg-canvas" />}>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/app" element={<AppPage />} />
          <Route path="/team" element={<Team />} />
          <Route path="/download" element={<DesktopDownload />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}
