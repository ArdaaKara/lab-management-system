export type Role = 'ADMIN' | 'TEACHER' | 'TECHNICIAN';

export interface User {
  id: string;
  username: string;
  email: string;
  roles: Role[];
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}
