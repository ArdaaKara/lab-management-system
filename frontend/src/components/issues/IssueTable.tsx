import { useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { AlertCircle, CheckCircle2 } from 'lucide-react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/hooks/useAuth'
import IssueStatusBadge from './IssueStatusBadge'
import { IssueResponse } from '@/types/issue.types'
import AssignTechnicianDialog from './AssignTechnicianDialog'
import RejectIssueDialog from './RejectIssueDialog'
import { resolve, approve } from '@/services/issueService'
import EmptyState from '@/components/common/EmptyState'

interface IssueTableProps {
  labId: string
  issues: IssueResponse[]
  isLoading: boolean
  hasActiveFilter?: boolean
  onClearFilters?: () => void
  onReportIssue?: () => void
}

const CATEGORY_LABELS: Record<string, string> = {
  NO_DISPLAY: 'Ekran Yok',
  NO_INTERNET: 'İnternet Yok',
  NO_POWER: 'Güç Yok',
  SLOW_PERFORMANCE: 'Yavaş Performans',
  PERIPHERAL_FAILURE: 'Çevre Birimi Arızası',
  OS_ERROR: 'İS Hatası',
  OTHER: 'Diğer',
}

export default function IssueTable({ labId, issues, isLoading, hasActiveFilter, onClearFilters, onReportIssue }: IssueTableProps) {
  const queryClient = useQueryClient()
  const { isAdmin, isTechnician, isTeacher, user } = useAuth()

  const [assignTarget, setAssignTarget] = useState<IssueResponse | null>(null)
  const [rejectTarget, setRejectTarget] = useState<IssueResponse | null>(null)

  const invalidateIssues = () => {
    queryClient.invalidateQueries({ queryKey: ['issues', labId] })
  }

  const handleResolve = async (issue: IssueResponse) => {
    try {
      await resolve(issue.id)
      invalidateIssues()
    } catch (err) {
      console.error('Issue action failed:', err)
    }
  }

  const handleApprove = async (issue: IssueResponse) => {
    try {
      await approve(issue.id)
      invalidateIssues()
    } catch (err) {
      console.error('Issue action failed:', err)
    }
  }

  // Invalidate after dialog closes so React Query re-fetches fresh data
  const handleAssignClose = () => {
    setAssignTarget(null)
    invalidateIssues()
  }

  const handleRejectClose = () => {
    setRejectTarget(null)
    invalidateIssues()
  }

  const renderActions = (issue: IssueResponse) => {
    if (isAdmin) {
      return (
        <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
          <Button
            variant="ghost"
            style={{ fontSize: 12, color: 'var(--text-secondary)' }}
            onClick={() => setAssignTarget(issue)}
          >
            Ata
          </Button>
          {issue.status === 'PENDING_APPROVAL' && (
            <>
              <Button
                variant="ghost"
                style={{ fontSize: 12, color: 'var(--status-active)' }}
                onClick={() => handleApprove(issue)}
              >
                Onayla
              </Button>
              <Button
                variant="ghost"
                style={{ fontSize: 12, color: 'var(--status-faulty)' }}
                onClick={() => setRejectTarget(issue)}
              >
                Reddet
              </Button>
            </>
          )}
          {issue.status === 'IN_PROGRESS' && (
            <Button
              variant="ghost"
              style={{ fontSize: 12, color: 'var(--accent)' }}
              onClick={() => handleResolve(issue)}
            >
              Çöz
            </Button>
          )}
        </div>
      )
    }

    if (isTechnician) {
      // TECHNICIAN can only resolve issues assigned to themselves
      const canResolve = issue.status === 'IN_PROGRESS' && issue.assignedTechnicianId === user?.id
      return (
        <div style={{ display: 'flex', gap: 4 }}>
          {issue.status === 'OPEN' && (
            <Button
              variant="ghost"
              style={{ fontSize: 12, color: 'var(--text-secondary)' }}
              onClick={() => setAssignTarget(issue)}
            >
              Ata
            </Button>
          )}
          {canResolve && (
            <Button
              variant="ghost"
              style={{ fontSize: 12, color: 'var(--accent)' }}
              onClick={() => handleResolve(issue)}
            >
              Çöz
            </Button>
          )}
        </div>
      )
    }

    if (isTeacher) {
      return (
        <div style={{ display: 'flex', gap: 4 }}>
          {issue.status === 'PENDING_APPROVAL' && (
            <>
              <Button
                variant="ghost"
                style={{ fontSize: 12, color: 'var(--status-active)' }}
                onClick={() => handleApprove(issue)}
              >
                Onayla
              </Button>
              <Button
                variant="ghost"
                style={{ fontSize: 12, color: 'var(--status-faulty)' }}
                onClick={() => setRejectTarget(issue)}
              >
                Reddet
              </Button>
            </>
          )}
        </div>
      )
    }

    return null
  }

  return (
    <>
      <div
        style={{
          border: '1px solid var(--border-subtle)',
          borderRadius: 8,
          overflow: 'hidden',
          background: 'var(--bg-surface)',
        }}
      >
        <Table>
          <TableHeader>
            <TableRow
              style={{
                background: 'var(--bg-surface)',
                borderBottom: '1px solid var(--border-subtle)',
              }}
            >
              {['Bilgisayar', 'Kategori', 'Durum', 'Teknisyen', 'Tarih', 'İşlemler'].map(
                col => (
                  <TableHead
                    key={col}
                    style={{
                      fontFamily: 'Inter',
                      fontSize: 11,
                      textTransform: 'uppercase',
                      letterSpacing: '0.04em',
                      color: 'var(--text-secondary)',
                    }}
                  >
                    {col}
                  </TableHead>
                )
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }, (_, i) => (
                <TableRow key={`skeleton-${i}`}>
                  {Array.from({ length: 6 }, (_, j) => (
                    <TableCell key={j} style={{ padding: '10px 16px' }}>
                      <div
                        style={{
                          height: 20,
                          background: 'var(--bg-raised)',
                          borderRadius: 'var(--radius-sm)',
                        }}
                      />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : issues.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} style={{ padding: 0 }}>
                  <EmptyState
                    icon={hasActiveFilter ? AlertCircle : CheckCircle2}
                    title={hasActiveFilter ? 'Arıza bulunamadı' : 'Henüz arıza kaydı yok'}
                    description={
                      hasActiveFilter
                        ? 'Seçili filtrelerle eşleşen arıza yok. Filtreleri temizleyin.'
                        : 'Sistemde kayıtlı arıza bulunmuyor.'
                    }
                    action={
                      hasActiveFilter
                        ? onClearFilters
                          ? { label: 'Filtreleri Temizle', onClick: onClearFilters }
                          : undefined
                        : onReportIssue
                          ? { label: 'Arıza Bildir', onClick: onReportIssue }
                          : undefined
                    }
                  />
                </TableCell>
              </TableRow>
            ) : (
              issues.map(issue => (
                <TableRow
                  key={issue.id}
                  style={{
                    background: 'transparent',
                    borderBottom: '1px solid var(--border-subtle)',
                    transition: 'background 120ms',
                  }}
                  onMouseEnter={e =>
                    (e.currentTarget.style.background = 'var(--bg-surface)')
                  }
                  onMouseLeave={e =>
                    (e.currentTarget.style.background = 'transparent')
                  }
                >
                  <TableCell
                    style={{
                      fontFamily: 'JetBrains Mono',
                      fontSize: 13,
                      color: 'var(--text-primary)',
                    }}
                  >
                    {issue.computerName}
                  </TableCell>
                  <TableCell style={{ color: 'var(--text-primary)', fontSize: 13 }}>
                    {CATEGORY_LABELS[issue.category] ?? issue.category}
                  </TableCell>
                  <TableCell>
                    <IssueStatusBadge status={issue.status} />
                  </TableCell>
                  <TableCell style={{ fontSize: 13 }}>
                    {issue.assignedTechnicianId ? (
                      <span
                        style={{
                          fontFamily: 'JetBrains Mono',
                          fontSize: 12,
                          color: 'var(--text-primary)',
                        }}
                      >
                        {issue.assignedTechnicianId.slice(0, 8)}...
                      </span>
                    ) : (
                      <span style={{ color: 'var(--text-secondary)' }}>Atanmadı</span>
                    )}
                  </TableCell>
                  <TableCell style={{ color: 'var(--text-secondary)', fontSize: 12 }}>
                    {new Date(issue.createdAt).toLocaleDateString('tr-TR')}
                  </TableCell>
                  <TableCell>{renderActions(issue)}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <AssignTechnicianDialog
        issue={assignTarget}
        open={assignTarget !== null}
        onClose={handleAssignClose}
      />
      <RejectIssueDialog
        issue={rejectTarget}
        open={rejectTarget !== null}
        onClose={handleRejectClose}
      />
    </>
  )
}
