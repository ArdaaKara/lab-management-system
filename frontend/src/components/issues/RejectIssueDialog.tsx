import { useState, useEffect } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { reject } from '@/services/issueService'
import useLabStore from '@/stores/useLabStore'
import { IssueResponse } from '@/types/issue.types'

interface RejectIssueDialogProps {
  issue: IssueResponse | null
  open: boolean
  onClose: () => void
}

export default function RejectIssueDialog({
  issue,
  open,
  onClose,
}: RejectIssueDialogProps) {
  const [reason, setReason] = useState<string>('')
  const [error, setError] = useState<string>('')
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const queryClient = useQueryClient()
  const labId = useLabStore(s => s.selectedLabId)

  useEffect(() => {
    if (!open) {
      setReason('')
      setError('')
      setIsLoading(false)
    }
  }, [open])

  const validate = (): boolean => {
    if (reason.trim().length === 0) {
      setError('Ret gerekçesi zorunludur')
      return false
    }
    if (reason.trim().length < 10) {
      setError('En az 10 karakter giriniz')
      return false
    }
    if (reason.trim().length > 500) {
      setError('En fazla 500 karakter')
      return false
    }
    return true
  }

  const handleConfirm = async () => {
    if (!issue) return
    if (!validate()) return

    setIsLoading(true)
    try {
      await reject(issue.id, { reason: reason.trim() })
      queryClient.invalidateQueries({ queryKey: ['issues', labId] })
      setReason('')
      setError('')
      setIsLoading(false)
      onClose()
    } catch {
      setError('Bir hata oluştu. Lütfen tekrar deneyin.')
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={val => !val && onClose()}>
      <DialogContent
        style={{
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-subtle)',
          color: 'var(--text-primary)',
          maxWidth: 440,
        }}
      >
        <DialogHeader>
          <DialogTitle
            style={{
              fontFamily: 'var(--font-ui)',
              fontWeight: 600,
              letterSpacing: '-0.02em',
              color: 'var(--text-primary)',
            }}
          >
            Arızayı Reddet
          </DialogTitle>
        </DialogHeader>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <Textarea
            placeholder="Ret gerekçesini açıklayın (min. 10 karakter)"
            rows={4}
            value={reason}
            onChange={e => {
              setReason(e.target.value)
              setError('')
            }}
            style={{
              background: 'var(--bg-base)',
              border: '1px solid var(--border-subtle)',
              color: 'var(--text-primary)',
              resize: 'none',
              fontFamily: 'var(--font-ui)',
              fontSize: 13,
            }}
          />

          {error && (
            <p style={{ color: 'var(--color-danger)', fontSize: 12, marginTop: 4 }}>
              {error}
            </p>
          )}

          <p
            style={{
              color: 'var(--text-secondary)',
              fontSize: 'var(--text-xs)',
              textAlign: 'right',
            }}
          >
            {reason.length}/500
          </p>
        </div>

        <DialogFooter style={{ gap: 8 }}>
          <Button
            variant="ghost"
            style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-ui)' }}
            onClick={onClose}
          >
            İptal
          </Button>
          <Button
            disabled={isLoading || !reason.trim()}
            onClick={handleConfirm}
            style={{
              background: 'var(--status-faulty)',
              color: 'var(--text-primary)',
              fontFamily: 'var(--font-ui)',
              fontWeight: 600,
            }}
          >
            {isLoading ? 'Gönderiliyor...' : 'Reddet'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
