
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'

import Login from './pages/auth/Login'
import Dashboard from './pages/dashboards/Dashboard'
import ProtectedRoute from './components/ProtectedRoutes'
import MainLayout from './layouts/MainLayout'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route element={<ProtectedRoute />}>
          <Route element={<MainLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
          </Route>
        </Route>

        <Route path="/" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
