import axiosInstance from './axiosInstance';
import { LoginRequest, LoginResponse, Role } from '../types/auth.types';
import { ApiResponse } from '@/types/api.types';

interface BackendLoginResponse {
  accessToken: string;
  refreshToken: string;
  userId: string;
  email: string;
  fullName: string;
  roles: string[];
  mustChangePassword?: boolean;
}

export async function login(req: LoginRequest): Promise<LoginResponse> {
  const res = await axiosInstance.post<ApiResponse<BackendLoginResponse>>('/auth/login', req);
  const d = res.data.data;
  return {
    accessToken: d.accessToken,
    refreshToken: d.refreshToken,
    user: {
      id: d.userId,
      email: d.email,
      fullName: d.fullName,
      roles: d.roles as Role[],
      mustChangePassword: d.mustChangePassword,
    },
  };
}

export async function refresh(token: string): Promise<{ accessToken: string }> {
  const res = await axiosInstance.post<ApiResponse<{ accessToken: string }>>(
    '/auth/refresh',
    { refreshToken: token }
  );
  return res.data.data;
}

export async function changePassword(oldPassword: string, newPassword: string): Promise<void> {
  await axiosInstance.post('/auth/change-password', { oldPassword, newPassword });
}

export async function logout(): Promise<void> {
  await axiosInstance.post('/auth/logout');
  localStorage.removeItem('refreshToken');
}
