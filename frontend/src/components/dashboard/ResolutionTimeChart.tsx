interface AvgResolutionCardProps {
  avgResolutionMinutes: number
}

function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes} dk`
  if (minutes < 1440) return `${Math.round(minutes / 60)} saat`
  return `${Math.round(minutes / 1440)} gün`
}

export default function AvgResolutionCard({ avgResolutionMinutes }: AvgResolutionCardProps) {
  const hasData = avgResolutionMinutes > 0

  return (
    <div
      style={{
        background: 'var(--bg-surface)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-lg)',
        padding: 24,
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
      }}
    >
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
        Ort. Çözüm Süresi
      </p>

      <p
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 32,
          fontWeight: 500,
          color: hasData ? 'var(--accent)' : 'var(--border-default)',
          margin: 0,
        }}
      >
        {hasData ? formatDuration(avgResolutionMinutes) : '—'}
      </p>

      <p
        style={{
          fontFamily: 'var(--font-ui)',
          fontSize: 12,
          color: 'var(--text-muted)',
          margin: 0,
        }}
      >
        son 30 gün
      </p>
    </div>
  )
}
