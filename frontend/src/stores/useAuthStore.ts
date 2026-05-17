import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { User, LoginResponse } from '../types/auth.types';

interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  _hasHydrated: boolean;
  setHasHydrated: (v: boolean) => void;
  login: (response: LoginResponse) => void;
  logout: () => void;
  setAccessToken: (token: string) => void;
  clearMustChangePassword: () => void;
  updateUser: (updates: Partial<User>) => void;
}

const useAuthStore = create<AuthState>()(
  devtools(
    persist(
      (set) => ({
        user: null,
        accessToken: null,
        isAuthenticated: false,
        _hasHydrated: false,
        setHasHydrated: (v: boolean) => set({ _hasHydrated: v }),

        login: (response) =>
          set(
            { user: response.user, accessToken: response.accessToken, isAuthenticated: true },
            false,
            'auth/login'
          ),

        logout: () => {
          localStorage.removeItem('refreshToken');
          set({ user: null, accessToken: null, isAuthenticated: false }, false, 'auth/logout');
        },

        setAccessToken: (token) =>
          set({ accessToken: token }, false, 'auth/setAccessToken'),

        clearMustChangePassword: () =>
          set(
            (state) => ({
              user: state.user ? { ...state.user, mustChangePassword: false } : null,
            }),
            false,
            'auth/clearMustChangePassword'
          ),

        updateUser: (updates) =>
          set(
            (state) => ({
              user: state.user ? { ...state.user, ...updates } : null,
            }),
            false,
            'auth/updateUser'
          ),
      }),
      {
        name: 'clms-auth',
        partialize: (state) => ({
          user: state.user,
          accessToken: state.accessToken,
          isAuthenticated: state.isAuthenticated,
        }),
        onRehydrateStorage: () => (state) => {
          state?.setHasHydrated(true)
        },
      }
    ),
    { name: 'auth' }
  )
);

export default useAuthStore;
