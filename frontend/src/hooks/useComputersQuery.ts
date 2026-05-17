import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { getComputersByLab, moveComputer } from '../services/computerService'
import type { ComputerGridResponse } from '../types/computer.types'

// Query key factory — tüm computer query'leri bu factory'yi kullanır
export const computerKeys = {
  byLab: (labId: string) => ['computers', labId] as const,
}

// Primary query hook
export function useComputersQuery(labId: string | null) {
  return useQuery({
    queryKey: labId ? computerKeys.byLab(labId) : ['computers', 'none'],
    queryFn: () => getComputersByLab(labId!),
    enabled: !!labId,
    staleTime: 30_000,
    refetchInterval: 30_000,
    refetchIntervalInBackground: false,
    select: (data: ComputerGridResponse[]) => data, // kept for future per-cell select
  })
}

// Move mutation — optimistic update + rollback (ADR-014 pattern)
export function useComputerMove(labId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ computerId, gridRow, gridCol }: {
      computerId: string
      gridRow: number | null
      gridCol: number | null
    }) => moveComputer(computerId, { gridRow, gridCol }),

    onMutate: async ({ computerId, gridRow, gridCol }) => {
      // Cancel in-flight refetches to avoid overwriting optimistic update
      await queryClient.cancelQueries({ queryKey: computerKeys.byLab(labId) })
      // Snapshot for rollback
      const previous = queryClient.getQueryData<ComputerGridResponse[]>(
        computerKeys.byLab(labId)
      )
      // Optimistic update — cast needed because gridRow/gridCol allow null during transit
      queryClient.setQueryData<ComputerGridResponse[]>(
        computerKeys.byLab(labId),
        (old) => old?.map((c) =>
          c.id === computerId ? { ...c, gridRow, gridCol } as ComputerGridResponse : c
        ) ?? []
      )
      return { previous }
    },

    onError: (_err, _vars, ctx) => {
      if (ctx?.previous) {
        queryClient.setQueryData(computerKeys.byLab(labId), ctx.previous)
      }
      toast.error('Bilgisayar taşınamadı, konum eski haline döndürüldü')
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: computerKeys.byLab(labId) })
    },
  })
}
