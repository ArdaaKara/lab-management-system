import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import {
  getIssuesByLab,
  getPendingApprovals,
  claimIssue,
  resolveIssue,
  approveIssue,
  rejectIssue,
} from '../services/issueService'
import type { IssueFilter } from '../types/issue.types'

export const issueKeys = {
  byLab: (labId: string, filter?: IssueFilter) =>
    ['issues', labId, filter] as const,
  pending: (labId: string) => ['issues', labId, 'pending'] as const,
  detail: (issueId: string) => ['issue', issueId] as const,
}

export function useIssuesQuery(labId: string | null, filter?: IssueFilter) {
  return useQuery({
    queryKey: labId ? issueKeys.byLab(labId, filter) : ['issues', 'none'],
    queryFn: () => getIssuesByLab(labId!, filter),
    enabled: !!labId,
    staleTime: 30_000,
  })
}

export function usePendingApprovalsQuery(labId: string | null) {
  return useQuery({
    queryKey: labId ? issueKeys.pending(labId) : ['issues', 'pending', 'none'],
    queryFn: () => getPendingApprovals(labId!),
    enabled: !!labId,
    staleTime: 15_000,
  })
}

export function useIssueMutations(labId: string) {
  const queryClient = useQueryClient()

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ['issues', labId] })
  }

  const claim = useMutation({
    mutationFn: (issueId: string) => claimIssue(issueId),
    onSuccess: () => { invalidate(); toast.success('Arıza üstlenildi') },
    onError: () => toast.error('Üstlenme başarısız'),
  })

  const resolve = useMutation({
    mutationFn: ({ issueId, resolution }: { issueId: string; resolution: string }) =>
      resolveIssue(issueId, resolution),
    onSuccess: () => { invalidate(); toast.success('Arıza çözüldü, onay bekleniyor') },
    onError: () => toast.error('Çözüm kaydedilemedi'),
  })

  const approve = useMutation({
    mutationFn: (issueId: string) => approveIssue(issueId),
    onSuccess: () => { invalidate(); toast.success('Arıza onaylandı ve kapatıldı') },
    onError: () => toast.error('Onay başarısız'),
  })

  const reject = useMutation({
    mutationFn: ({ issueId, reason }: { issueId: string; reason: string }) =>
      rejectIssue(issueId, reason),
    onSuccess: () => { invalidate(); toast.success('Arıza reddedildi, tekrar açıldı') },
    onError: () => toast.error('Red işlemi başarısız'),
  })

  return { claim, resolve, approve, reject }
}
