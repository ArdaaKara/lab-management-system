import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosError } from 'axios';
import useAuthStore from '../stores/useAuthStore';

const axiosInstance: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

// Single-flight guard: eşzamanlı 401 → refresh yarışını önler
let refreshPromise: Promise<void> | null = null;

axiosInstance.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    if (error.response?.status !== 401) throw error;

    const config = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // Login 401 = yanlış şifre — refresh deneme, caller'a bırak
    if (config.url?.includes('/auth/login')) throw error;

    // Refresh 401 veya retry sonrası tekrar 401 → logout
    if (config.url?.includes('/auth/refresh') || config._retry) {
      useAuthStore.getState().logout();
      window.location.href = '/login';
      throw error;
    }

    config._retry = true;

    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) {
      useAuthStore.getState().logout();
      window.location.href = '/login';
      throw error;
    }

    if (!refreshPromise) {
      refreshPromise = axios
        .post(`${import.meta.env.VITE_API_BASE_URL}/auth/refresh`, { refreshToken })
        .then(({ data }) => {
          const payload = data.data;
          useAuthStore.getState().setAccessToken(payload.accessToken);
          localStorage.setItem('refreshToken', payload.refreshToken);
        })
        .catch((refreshError) => {
          useAuthStore.getState().logout();
          window.location.href = '/login';
          throw refreshError;
        })
        .finally(() => {
          refreshPromise = null;
        });
    }

    await refreshPromise;
    return axiosInstance(config);
  }
);

export default axiosInstance;
