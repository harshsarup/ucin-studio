import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Landing } from '@/pages/Landing'
import { AppPage } from '@/pages/AppPage'
import { Login } from '@/pages/Login'
import { Team } from '@/pages/Team'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/app" element={<AppPage />} />
        <Route path="/team" element={<Team />} />
      </Routes>
    </BrowserRouter>
  )
}
