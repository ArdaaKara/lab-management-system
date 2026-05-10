import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { User, LoginResponse } from '../../../types/auth.types';

interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  login: (response: LoginResponse) => void;
  logout: () => void;
  setAccessToken: (token: string) => void;
}

export const useAuthStore = create<AuthState>()(
  devtools(
    (set) => ({
      user: null,
      accessToken: null,
      isAuthenticated: false,

      login: (response: LoginResponse) => {
        localStorage.setItem('refreshToken', response.refreshToken);
        set(
          () => ({
            user: response.user,
            accessToken: response.accessToken,
            isAuthenticated: true,
          }),
          false,
          'auth/login'
        );
      },

      logout: () => {
        localStorage.removeItem('refreshToken');
        set(
          () => ({
            user: null,
            accessToken: null,
            isAuthenticated: false,
          }),
          false,
          'auth/logout'
        );
      },

      setAccessToken: (token: string) => {
        set(
          (state) => ({ ...state, accessToken: token }),
          false,
          'auth/setAccessToken'
        );
      },
    }),
    { name: 'auth' }
  )
);

export default useAuthStore;
