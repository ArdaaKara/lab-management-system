import { useMemo, useState } from 'react'
import useLabStore from '@/stores/useLabStore'
import { useAuth } from '@/hooks/useAuth'
import IssueTable from '@/components/issues/IssueTable'
import IssueCreateForm from '@/components/issues/IssueCreateForm'
import PendingApprovalList from '@/components/issues/PendingApprovalList'
import { useIssuesQuery } from '@/hooks/useIssuesQuery'
import { IssueStatus, IssueCategory, IssueFilter } from '@/types/issue.types'
import { SkeletonTable } from '@/components/common/SkeletonTable'

const SELECT_STYLE: React.CSSProperties = {
  background: 'var(--bg-surface)',
  border: '1px solid var(--border-subtle)',
  color: 'var(--text-primary)',
  padding: '6px 12px',
  borderRadius: 6,
  fontFamily: 'Inter',
  fontSize: 13,
  cursor: 'pointer',
  outline: 'none',
}

export default function IssuesPage() {
  const selectedLabId = useLabStore(state => state.selectedLabId)
  const { isAdmin, isTeacher } = useAuth()

  const [statusFilter, setStatusFilter] = useState<IssueStatus | 'ALL'>('ALL')
  const [categoryFilter, setCategoryFilter] = useState<IssueCategory | 'ALL'>('ALL')
  const [createOpen, setCreateOpen] = useState(false)

  // Normalize to undefined when no filter is active so query key stays stable
  const filter = useMemo<IssueFilter | undefined>(() => {
    const f: IssueFilter = {}
    if (statusFilter !== 'ALL') f.status = statusFilter
    if (categoryFilter !== 'ALL') f.category = categoryFilter
    return Object.keys(f).length > 0 ? f : undefined
  }, [statusFilter, categoryFilter])

  const hasActiveFilter = statusFilter !== 'ALL' || categoryFilter !== 'ALL'

  const clearFilters = () => {
    setStatusFilter('ALL')
    setCategoryFilter('ALL')
  }

  const { data, isLoading } = useIssuesQuery(selectedLabId, filter)

  if (!selectedLabId) {
    return (
      <div style={{ background: 'var(--bg-base)', minHeight: '100vh', padding: 24 }}>
        <p style={{ color: 'var(--text-secondary)', textAlign: 'center', marginTop: 64 }}>
          Lab seçilmedi.
        </p>
      </div>
    )
  }

  return (
    <div style={{ background: 'var(--bg-base)', minHeight: '100vh', padding: 24 }}>
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 20,
        }}
      >
        <span
          style={{
            fontFamily: 'Inter',
            fontWeight: 600,
            letterSpacing: '-0.02em',
            fontSize: 20,
            color: 'var(--text-primary)',
          }}
        >
          Arızalar
        </span>
        <span
          style={{
            background: 'var(--accent-muted)',
            color: 'var(--accent)',
            border: '1px solid rgba(201,168,76,0.33)',
            borderRadius: 4,
            padding: '2px 10px',
            fontFamily: 'Inter',
            fontSize: 12,
            fontWeight: 600,
          }}
        >
          {data?.length ?? 0}
        </span>
      </div>

      {/* Filtre bar */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
        <select
          style={SELECT_STYLE}
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value as IssueStatus | 'ALL')}
        >
          <option value="ALL">Tüm Durumlar</option>
          <option value="OPEN">Açık</option>
          <option value="IN_PROGRESS">İşlemde</option>
          <option value="PENDING_APPROVAL">Onay Bekliyor</option>
          <option value="RESOLVED">Çözüldü</option>
          <option value="REJECTED">Reddedildi</option>
        </select>

        <select
          style={SELECT_STYLE}
          value={categoryFilter}
          onChange={e => setCategoryFilter(e.target.value as IssueCategory | 'ALL')}
        >
          <option value="ALL">Tüm Kategoriler</option>
          <option value="NO_DISPLAY">Ekran Yok</option>
          <option value="NO_INTERNET">İnternet Yok</option>
          <option value="NO_POWER">Güç Yok</option>
          <option value="SLOW_PERFORMANCE">Yavaş Performans</option>
          <option value="PERIPHERAL_FAILURE">Çevre Birimi Arızası</option>
          <option value="OS_ERROR">İS Hatası</option>
          <option value="OTHER">Diğer</option>
        </select>
      </div>

      {/* Onay listesi — ADMIN ve TEACHER görebilir */}
      {(isAdmin || isTeacher) && (
        <>
          <PendingApprovalList />
          <hr style={{ border: 'none', borderTop: '1px solid var(--border-subtle)', marginBottom: 16 }} />
        </>
      )}

      {isLoading ? (
        <div
          aria-label="İçerik yükleniyor"
          style={{
            border: '1px solid var(--border-subtle)',
            borderRadius: 8,
            overflow: 'hidden',
            background: 'var(--bg-surface)',
          }}
        >
          <SkeletonTable columns={7} rows={8} />
        </div>
      ) : (
        <IssueTable
          labId={selectedLabId}
          issues={data ?? []}
          isLoading={false}
          hasActiveFilter={hasActiveFilter}
          onClearFilters={clearFilters}
          onReportIssue={isAdmin || isTeacher ? () => setCreateOpen(true) : undefined}
        />
      )}

      <IssueCreateForm
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        labId={selectedLabId}
      />
    </div>
  )
}
