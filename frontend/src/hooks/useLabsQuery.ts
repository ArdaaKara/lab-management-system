import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getAllLabs, getLabById, createLab } from '../services/labService'
import type { CreateLabRequest } from '../types/lab.types'
import { toast } from 'sonner'

export const labKeys = {
  all: ['labs'] as const,
  detail: (labId: string) => ['labs', labId] as const,
}

export function useLabsQuery() {
  return useQuery({
    queryKey: labKeys.all,
    queryFn: getAllLabs,
    staleTime: 60_000,
  })
}

export function useLabDetailQuery(labId: string | null) {
  return useQuery({
    queryKey: labId ? labKeys.detail(labId) : ['labs', 'none'],
    queryFn: () => getLabById(labId!),
    enabled: !!labId,
    staleTime: 60_000,
  })
}

export function useLabMutations() {
  const queryClient = useQueryClient()
  const invalidate = () => queryClient.invalidateQueries({ queryKey: labKeys.all })

  const create = useMutation({
    mutationFn: (data: CreateLabRequest) => createLab(data),
    onSuccess: () => {
      toast.success('Laboratuvar oluşturuldu')
      invalidate()
    },
    onError: () => toast.error('Laboratuvar oluşturulamadı'),
  })

  return { create }
}
