
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'sonner'
import Login from './pages/auth/Login'
import Dashboard from './pages/dashboards/Dashboard'
import ProtectedRoute from './components/ProtectedRoutes'
import MainLayout from './layouts/MainLayout'
import UsersPage from './pages/users/Users'

function App() {
  return (
    <BrowserRouter>
     <Toaster position="top-right" richColors />
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route element={<ProtectedRoute />}>
          <Route element={<MainLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/users" element={<UsersPage />} />
          </Route>
        </Route>

        <Route path="/" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
