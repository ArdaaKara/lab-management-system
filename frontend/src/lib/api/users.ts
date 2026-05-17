import axiosInstance from '@/services/axiosInstance'
import { ApiResponse } from '@/types/api.types'
import { UserRecord } from '@/services/userService'
import type { Role } from '@/types/auth.types'

export type UserRole = Role

export interface FetchUsersParams {
  role?: UserRole
  labId?: string
  search?: string
  page?: number
  size?: number
}

export async function fetchUsers(params: FetchUsersParams): Promise<UserRecord[]> {
  const cleanedParams = Object.fromEntries(
    Object.entries(params).filter(([, v]) => v != null && v !== '')
  )
  const res = await axiosInstance.get<ApiResponse<UserRecord[] | { content?: UserRecord[] }>>(
    '/users',
    { params: cleanedParams }
  )
  const payload = res.data.data
  return Array.isArray(payload) ? payload : payload.content ?? []
}
