import useAuthStore from '../stores/useAuthStore';
import { Role, User } from '../types/auth.types';

export function useAuth() {
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  const hasRole = (role: Role): boolean => {
    if (!user) return false;
    return user.roles.includes(role);
  };

  return {
    user,
    isAuthenticated,
    hasRole,
    isAdmin: hasRole('ADMIN'),
    isTeacher: hasRole('TEACHER'),
    isTechnician: hasRole('TECHNICIAN'),
  };
}
