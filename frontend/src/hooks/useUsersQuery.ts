import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { createUser, toggleUserActive } from '../services/userService'
import type { UserCreateRequest } from '../services/userService'
import { fetchUsers } from '@/lib/api/users'
import type { UserRole } from '@/lib/api/users'
import { toast } from 'sonner'

export type UseUsersQueryParams = {
  role?: UserRole
  labId?: string
  search?: string
  page?: number
  size?: number
  enabled?: boolean
}

export const userKeys = {
  all: ['users'] as const,
}

export function useUsersQuery(params: UseUsersQueryParams = {}) {
  const { role, labId, search, page = 0, size = 100, enabled = true } = params
  return useQuery({
    queryKey: ['users', { role, labId, search, page, size }],
    queryFn: () => fetchUsers({ role, labId, search, page, size }),
    staleTime: 30_000,
    enabled,
  })
}

export function useUserMutations() {
  const queryClient = useQueryClient()
  const invalidate = () => queryClient.invalidateQueries({ queryKey: userKeys.all })

  const create = useMutation({
    mutationFn: (data: UserCreateRequest) => createUser(data),
    onSuccess: () => {
      toast.success('Kullanıcı oluşturuldu')
      invalidate()
    },
    onError: () => toast.error('Kullanıcı oluşturulamadı'),
  })

  const toggleActive = useMutation({
    mutationFn: ({ userId, isActive }: { userId: string; isActive: boolean }) =>
      toggleUserActive(userId, isActive),
    onSuccess: (_, { isActive }) =>
      toast.success(isActive ? 'Kullanıcı aktifleştirildi' : 'Kullanıcı devre dışı bırakıldı'),
    onError: () => toast.error('İşlem başarısız'),
    onSettled: invalidate,
  })

  return { create, toggleActive }
}
