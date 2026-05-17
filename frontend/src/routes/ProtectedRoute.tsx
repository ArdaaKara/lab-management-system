import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import useAuthStore from '@/stores/useAuthStore'
import { Role } from '@/types/auth.types'

interface ProtectedRouteProps {
  allowedRoles?: Role[]
}

export default function ProtectedRoute({ allowedRoles }: ProtectedRouteProps) {
  const hasHydrated = useAuthStore(state => state._hasHydrated)
  const user = useAuthStore(state => state.user)
  const { isAuthenticated, hasRole } = useAuth()
  const { pathname } = useLocation()

  if (!hasHydrated) return null

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  // Force password change before accessing any other route
  if (user?.mustChangePassword && pathname !== '/change-password') {
    return <Navigate to="/change-password" replace />
  }

  if (allowedRoles && !allowedRoles.some(r => hasRole(r))) {
    return <Navigate to="/unauthorized" replace />
  }

  return <Outlet />
}
