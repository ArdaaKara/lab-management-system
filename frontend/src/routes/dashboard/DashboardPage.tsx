import { BarChart3 } from 'lucide-react'
import useLabStore from '@/stores/useLabStore'
import { useAuth } from '@/hooks/useAuth'
import { useSummaryQuery } from '@/hooks/useAnalyticsQuery'
import SummaryCards from '@/components/dashboard/SummaryCards'
import HealthDonutChart from '@/components/dashboard/HealthDonutChart'
import FaultyChart from '@/components/dashboard/FaultyComputersChart'
import AvgResolutionCard from '@/components/dashboard/ResolutionTimeChart'
import { Skeleton } from '@/components/common/Skeleton'
import { SkeletonTable } from '@/components/common/SkeletonTable'
import EmptyState from '@/components/common/EmptyState'

export default function DashboardPage() {
  const selectedLabId = useLabStore(state => state.selectedLabId)
  const labs = useLabStore(state => state.labs)
  const { isAdmin, isTeacher } = useAuth()

  const labId = selectedLabId ?? undefined
  const { data: summary, isLoading, isError } = useSummaryQuery(labId)

  const selectedLab = labs.find(l => l.id === selectedLabId)
  const showLabScope = isAdmin || isTeacher

  return (
    <div
      style={{
        background: 'var(--bg-base)',
        minHeight: '100vh',
        padding: 'var(--space-6)',
      }}
    >
      {/* Header */}
      <div style={{ marginBottom: 'var(--space-6)' }}>
        <h1
          style={{
            fontFamily: 'var(--font-ui)',
            fontWeight: 600,
            letterSpacing: '-0.02em',
            fontSize: 20,
            color: 'var(--text-primary)',
            margin: '0 0 4px 0',
          }}
        >
          Dashboard
        </h1>
        <p
          style={{
            fontFamily: 'var(--font-ui)',
            fontSize: 13,
            color: 'var(--text-muted)',
            margin: 0,
          }}
        >
          {selectedLab?.name ?? (showLabScope ? 'Sol menüden bir lab seçin' : '')}
        </p>
      </div>

      {/* No lab selected */}
      {!selectedLabId && (
        <p
          style={{
            color: 'var(--text-muted)',
            textAlign: 'center',
            marginTop: 64,
            fontFamily: 'var(--font-ui)',
            fontSize: 14,
          }}
        >
          Sol menüden bir laboratuvar seçin.
        </p>
      )}

      {/* Error */}
      {isError && selectedLabId && (
        <div
          style={{
            background: 'var(--status-faulty-bg)',
            border: '1px solid var(--status-faulty)',
            borderRadius: 'var(--radius-md)',
            padding: '12px 16px',
            color: 'var(--status-faulty-text)',
            fontFamily: 'var(--font-ui)',
            fontSize: 13,
            marginBottom: 16,
          }}
        >
          Veriler yüklenemedi.
        </div>
      )}

      {/* Content — shown while loading (skeletons) or when data is ready */}
      {selectedLabId && !isError && (
        <div aria-label={isLoading ? 'İçerik yükleniyor' : undefined}>
          {/* Summary cards */}
          {isLoading ? (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: 'var(--space-4)',
                marginBottom: 'var(--space-5)',
              }}
            >
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton.Rect key={i} height={80} />
              ))}
            </div>
          ) : (
            <div style={{ marginBottom: 'var(--space-5)' }}>
              <SummaryCards summary={summary} isLoading={false} />
            </div>
          )}

          {/* Charts row */}
          {isLoading ? (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: 'var(--space-4)',
                marginBottom: 'var(--space-5)',
              }}
            >
              {Array.from({ length: 2 }).map((_, i) => (
                <Skeleton.Rect key={i} height={200} />
              ))}
            </div>
          ) : summary ? (
            summary.faultyCount + summary.underRepairCount === 0 && summary.topFaultyComputers.length === 0
              ? (
                <div
                  style={{
                    background: 'var(--bg-surface)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-lg)',
                    marginBottom: 'var(--space-5)',
                  }}
                >
                  <EmptyState
                    icon={BarChart3}
                    title="Gösterilecek veri yok"
                    description="Seçili dönemde arıza kaydı bulunmuyor."
                  />
                </div>
              )
              : (
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                    gap: 'var(--space-4)',
                    marginBottom: 'var(--space-5)',
                  }}
                >
                  <HealthDonutChart summary={summary} />
                  <FaultyChart summary={summary} />
                  <AvgResolutionCard avgResolutionMinutes={summary.avgResolutionMinutes} />
                </div>
              )
          ) : null}

          {/* Top faulty table */}
          {isLoading && (
            <div
              style={{
                background: 'var(--bg-surface)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-lg)',
                overflow: 'hidden',
              }}
            >
              <SkeletonTable columns={3} rows={5} />
            </div>
          )}
        </div>
      )}
    </div>
  )
}
