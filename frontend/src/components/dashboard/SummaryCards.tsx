import { LabSummaryResponse } from '@/types/analytics.types'

interface StatCardProps {
  label: string
  value: number
  valueColor?: string
  isLoading?: boolean
}

function StatCard({ label, value, valueColor, isLoading }: StatCardProps) {
  return (
    <div
      style={{
        background: 'var(--bg-surface)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-lg)',
        padding: '16px 20px',
      }}
    >
      {isLoading ? (
        <div
          style={{
            width: 48,
            height: 32,
            background: 'var(--bg-raised)',
            borderRadius: 'var(--radius-md)',
            marginBottom: 8,
          }}
        />
      ) : (
        <p
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 28,
            fontWeight: 500,
            color: valueColor ?? 'var(--text-primary)',
            margin: '0 0 4px 0',
          }}
        >
          {value}
        </p>
      )}
      <p
        style={{
          fontFamily: 'var(--font-ui)',
          fontSize: 11,
          textTransform: 'uppercase',
          letterSpacing: '0.06em',
          color: 'var(--text-muted)',
          margin: 0,
        }}
      >
        {label}
      </p>
    </div>
  )
}

interface SummaryCardsProps {
  summary?: LabSummaryResponse
  isLoading?: boolean
}

export default function SummaryCards({ summary, isLoading }: SummaryCardsProps) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
        gap: 12,
      }}
    >
      <StatCard
        label="Toplam PC"
        value={summary?.totalComputers ?? 0}
        isLoading={isLoading}
      />
      <StatCard
        label="Aktif"
        value={summary?.activeCount ?? 0}
        valueColor="var(--status-active-text)"
        isLoading={isLoading}
      />
      <StatCard
        label="Arızalı"
        value={summary?.faultyCount ?? 0}
        valueColor="var(--status-faulty-text)"
        isLoading={isLoading}
      />
      <StatCard
        label="Onarımda"
        value={summary?.underRepairCount ?? 0}
        valueColor="var(--status-repair-text)"
        isLoading={isLoading}
      />
    </div>
  )
}
