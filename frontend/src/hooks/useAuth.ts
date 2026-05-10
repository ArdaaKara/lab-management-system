import useAuthStore from '../features/auth/store/useAuthStore';
import { Role } from '../types/auth.types';

export function useAuth() {
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  const hasRole = (role: Role): boolean => {
    return user?.roles.includes(role) ?? false;
  };

  const isAdmin = hasRole('ADMIN');
  const isTeacher = hasRole('TEACHER');
  const isTechnician = hasRole('TECHNICIAN');

  return {
    user,
    isAuthenticated,
    hasRole,
    isAdmin,
    isTeacher,
    isTechnician,
  };
}


