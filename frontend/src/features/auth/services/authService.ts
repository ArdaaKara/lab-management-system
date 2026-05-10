import axiosInstance from '../../../api/axiosInstance';
import { LoginRequest, LoginResponse } from '../../../types/auth.types';
import { ApiResponse } from '../../../types/common';

export const login = async (req: LoginRequest): Promise<LoginResponse> => {
  const response = await axiosInstance.post<ApiResponse<LoginResponse>>('/auth/login', req);
  return response.data.data;
};

export const refresh = async (token: string): Promise<{ accessToken: string }> => {
  const response = await axiosInstance.post<ApiResponse<{ accessToken: string }>>('/auth/refresh', {
    refreshToken: token,
  });
  return response.data.data;
};

export const logout = async (): Promise<void> => {
  try {
    await axiosInstance.post('/auth/logout');
  } finally {
    localStorage.removeItem('refreshToken');
  }
};
