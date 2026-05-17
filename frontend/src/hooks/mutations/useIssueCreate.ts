import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { createIssue } from '@/services/issueService'
import { IssueCreateFormValues } from '@/validation/issueCreate.schema'

export function useIssueCreate(labId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ computerId, category, studentIdReporter, description }: IssueCreateFormValues) =>
      createIssue(computerId, { category, studentIdReporter, description }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['issues', labId] })
      toast.success('Arıza bildirimi oluşturuldu')
    },
    onError: () => {
      toast.error('Arıza bildirimi oluşturulamadı')
    },
  })
}
