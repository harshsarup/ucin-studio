import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Landing } from '@/pages/Landing'
import { AppPage } from '@/pages/AppPage'
import { Login } from '@/pages/Login'
import { Team } from '@/pages/Team'
import { DesktopDownload } from '@/pages/DesktopDownload'
import { Contact } from '@/pages/Contact'
import { Privacy } from '@/pages/Privacy'
import { Terms } from '@/pages/Terms'

export default function App() {
  return (
    <BrowserRouter>
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
    </BrowserRouter>
  )
}
