import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { Role } from '@/types/auth.types'

export function useRoleGuard(allowedRoles: Role[]): boolean {
  const { isAuthenticated, hasRole } = useAuth()
  const navigate = useNavigate()

  const canAccess = isAuthenticated && allowedRoles.some(r => hasRole(r))

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { replace: true })
    } else if (!canAccess) {
      navigate('/unauthorized', { replace: true })
    }
  }, [isAuthenticated, canAccess, navigate])

  return canAccess
}
