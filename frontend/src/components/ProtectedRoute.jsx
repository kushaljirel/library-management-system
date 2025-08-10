// Guarded route component that checks for valid JWT and optional admin role.

import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { isTokenValid, getUserInfo, removeToken } from '../utils/auth.js'

export default function ProtectedRoute({ adminOnly = false }) {
  const location = useLocation()
  const valid = isTokenValid()
  if (!valid) {
    removeToken()
    return <Navigate to="/login" replace state={{ from: location }} />
  }
  const user = getUserInfo()
  if (adminOnly && user?.role !== 'admin') {
    return <Navigate to="/dashboard" replace />
  }
  return <Outlet />
}


