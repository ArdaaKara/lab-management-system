import axiosInstance from './axiosInstance'
import type { ApiResponse } from '../types/api.types'

export interface UserRecord {
  id: string
  fullName: string
  email: string
  isActive: boolean
  roles: string[]
  createdAt: string
}

export interface UserCreateRequest {
  fullName: string
  email: string
  password: string
  roleNames: string[]
}

export interface UserUpdateRequest {
  fullName?: string
  isActive?: boolean
  roleNames?: string[]
}

export async function getAllUsers(): Promise<UserRecord[]> {
  const res = await axiosInstance.get<ApiResponse<UserRecord[]>>('/users')
  return res.data.data
}

export async function createUser(data: UserCreateRequest): Promise<UserRecord> {
  const res = await axiosInstance.post<ApiResponse<UserRecord>>('/users', data)
  return res.data.data
}

export async function updateUser(userId: string, data: UserUpdateRequest): Promise<UserRecord> {
  const res = await axiosInstance.put<ApiResponse<UserRecord>>(`/users/${userId}`, data)
  return res.data.data
}

export async function toggleUserActive(userId: string, isActive: boolean): Promise<UserRecord> {
  const res = await axiosInstance.put<ApiResponse<UserRecord>>(`/users/${userId}`, { isActive })
  return res.data?.data ?? res.data
}

export async function deleteUser(userId: string): Promise<void> {
  await axiosInstance.delete(`/users/${userId}`)
}

export interface ProfileUpdateRequest {
  fullName: string;
  email: string;
}

export async function updateProfile(userId: string, data: ProfileUpdateRequest): Promise<UserRecord> {
  const res = await axiosInstance.patch<ApiResponse<UserRecord>>(`/users/${userId}/profile`, data)
  return res.data.data
}
