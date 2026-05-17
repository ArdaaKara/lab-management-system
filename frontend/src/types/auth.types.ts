export type Role = 'ADMIN' | 'TEACHER' | 'TECHNICIAN';

export interface User {
  id: string;
  email: string;
  fullName: string;
  username?: string;
  roles: Role[];
  mustChangePassword?: boolean;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}
