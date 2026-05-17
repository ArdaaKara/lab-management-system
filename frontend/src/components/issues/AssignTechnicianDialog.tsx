import { useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { assignTechnician } from '@/services/issueService'
import useLabStore from '@/stores/useLabStore'
import { IssueResponse } from '@/types/issue.types'

// TODO: GET /labs/:labId/users?role=TECHNICIAN endpoint'i
// hazır olduğunda mock veri kaldırılacak
const MOCK_TECHNICIANS = [
  { id: 'tech-001', name: 'Ahmet Yılmaz' },
  { id: 'tech-002', name: 'Mehmet Demir' },
  { id: 'tech-003', name: 'Ayşe Kaya' },
]

interface AssignTechnicianDialogProps {
  issue: IssueResponse | null
  open: boolean
  onClose: () => void
}

export default function AssignTechnicianDialog({
  issue,
  open,
  onClose,
}: AssignTechnicianDialogProps) {
  const [selectedTechId, setSelectedTechId] = useState<string>('')
  const queryClient = useQueryClient()
  const labId = useLabStore(s => s.selectedLabId)

  const handleConfirm = async () => {
    if (!issue || !selectedTechId) return
    try {
      await assignTechnician(issue.id, selectedTechId)
      queryClient.invalidateQueries({ queryKey: ['issues', labId] })
      setSelectedTechId('')
      onClose()
    } catch {
      // hata gösterimi geliştirilebilir
    }
  }

  const handleClose = () => {
    setSelectedTechId('')
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={val => !val && handleClose()}>
      <DialogContent
        style={{
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-subtle)',
          color: 'var(--text-primary)',
          maxWidth: 400,
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
            Teknisyen Ata
          </DialogTitle>
        </DialogHeader>

        {issue && (
          <p style={{ fontFamily: 'var(--font-ui)', fontSize: 13, color: 'var(--text-secondary)' }}>
            <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-primary)' }}>
              {issue.computerName}
            </span>{' '}
            için teknisyen seçin.
          </p>
        )}

        <Select
          disabled={!issue}
          value={selectedTechId}
          onValueChange={setSelectedTechId}
        >
          <SelectTrigger
            style={{
              background: 'var(--bg-base)',
              border: '1px solid var(--border-subtle)',
              color: selectedTechId ? 'var(--text-primary)' : 'var(--text-secondary)',
              fontFamily: 'var(--font-ui)',
            }}
          >
            <SelectValue placeholder="Teknisyen seçin" />
          </SelectTrigger>
          <SelectContent
            style={{
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-subtle)',
              color: 'var(--text-primary)',
            }}
          >
            {MOCK_TECHNICIANS.map(tech => (
              <SelectItem
                key={tech.id}
                value={tech.id}
                style={{ fontFamily: 'var(--font-ui)', fontSize: 13 }}
              >
                {tech.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <DialogFooter style={{ gap: 8, marginTop: 8 }}>
          <Button
            variant="ghost"
            style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-ui)' }}
            onClick={handleClose}
          >
            İptal
          </Button>
          <Button
            disabled={!selectedTechId}
            onClick={handleConfirm}
            style={{
              background: 'var(--accent)',
              color: 'var(--accent-text)',
              fontWeight: 600,
              fontFamily: 'var(--font-ui)',
            }}
          >
            Onayla
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
