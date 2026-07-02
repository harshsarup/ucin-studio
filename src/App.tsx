import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Landing } from '@/pages/Landing'
import { AppPage } from '@/pages/AppPage'
import { Login } from '@/pages/Login'
import { Team } from '@/pages/Team'
import { DesktopDownload } from '@/pages/DesktopDownload'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/app" element={<AppPage />} />
        <Route path="/team" element={<Team />} />
        <Route path="/download" element={<DesktopDownload />} />
      </Routes>
    </BrowserRouter>
  )
}
