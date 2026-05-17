import { LabResponse } from '@/types/lab.types'
import { ReportPeriod, ReportRangeRequest } from '@/types/reports.types'

const PERIOD_LABELS: Record<ReportPeriod, string> = {
  THIS_WEEK: 'Bu Hafta',
  THIS_MONTH: 'Bu Ay',
  LAST_30_DAYS: 'Son 30 Gün',
  THIS_SEMESTER: 'Bu Dönem',
  CUSTOM: 'Özel Aralık',
}

const PERIODS: ReportPeriod[] = ['THIS_WEEK', 'THIS_MONTH', 'LAST_30_DAYS', 'THIS_SEMESTER', 'CUSTOM']

const SELECT_STYLE: React.CSSProperties = {
  background: 'var(--bg-surface)',
  border: '1px solid var(--border-subtle)',
  color: 'var(--text-primary)',
  padding: '6px 12px',
  borderRadius: 6,
  fontFamily: 'var(--font-ui)',
  fontSize: 13,
  cursor: 'pointer',
  outline: 'none',
}

const INPUT_STYLE: React.CSSProperties = {
  background: 'var(--bg-surface)',
  border: '1px solid var(--border-subtle)',
  color: 'var(--text-primary)',
  padding: '6px 12px',
  borderRadius: 6,
  fontFamily: 'var(--font-ui)',
  fontSize: 13,
  outline: 'none',
  colorScheme: 'dark',
}

const LABEL_STYLE: React.CSSProperties = {
  fontFamily: 'var(--font-ui)',
  fontSize: 11,
  textTransform: 'uppercase',
  letterSpacing: '0.06em',
  color: 'var(--text-muted)',
  marginBottom: 4,
  display: 'block',
}

interface ReportFiltersProps {
  params: ReportRangeRequest
  onChange: (params: ReportRangeRequest) => void
  labs?: LabResponse[]
  isAdmin: boolean
  errors?: { dateFrom?: string; dateTo?: string }
}

export default function ReportFilters({ params, onChange, labs, isAdmin, errors }: ReportFiltersProps) {
  function handlePeriodChange(period: ReportPeriod) {
    const next: ReportRangeRequest = { ...params, period }
    if (period !== 'CUSTOM') {
      delete next.dateFrom
      delete next.dateTo
    }
    onChange(next)
  }

  function handleDateFrom(val: string) {
    onChange({ ...params, dateFrom: val ? new Date(val).toISOString() : undefined })
  }

  function handleDateTo(val: string) {
    onChange({ ...params, dateTo: val ? new Date(val).toISOString() : undefined })
  }

  function handleLabChange(labId: string) {
    onChange({ ...params, labId: labId || undefined })
  }

  return (
    <div
      style={{
        display: 'flex',
        gap: 'var(--space-4)',
        flexWrap: 'wrap',
        alignItems: 'flex-end',
        padding: '12px 0',
        marginBottom: 'var(--space-4)',
      }}
    >
      {/* Period */}
      <div>
        <label style={LABEL_STYLE}>Dönem</label>
        <select
          style={SELECT_STYLE}
          value={params.period}
          onChange={e => handlePeriodChange(e.target.value as ReportPeriod)}
        >
          {PERIODS.map(p => (
            <option key={p} value={p}>{PERIOD_LABELS[p]}</option>
          ))}
        </select>
      </div>

      {/* Custom date range */}
      {params.period === 'CUSTOM' && (
        <>
          <div>
            <label style={LABEL_STYLE}>Başlangıç</label>
            <input
              type="date"
              style={{
                ...INPUT_STYLE,
                borderColor: errors?.dateFrom ? 'var(--color-danger)' : 'var(--border-subtle)',
              }}
              value={params.dateFrom ? params.dateFrom.slice(0, 10) : ''}
              onChange={e => handleDateFrom(e.target.value)}
            />
            {errors?.dateFrom && (
              <p style={{ color: 'var(--color-danger)', fontSize: 12, fontFamily: 'var(--font-ui)', margin: '4px 0 0 0' }}>
                {errors.dateFrom}
              </p>
            )}
          </div>
          <div>
            <label style={LABEL_STYLE}>Bitiş</label>
            <input
              type="date"
              style={{
                ...INPUT_STYLE,
                borderColor: errors?.dateTo ? 'var(--color-danger)' : 'var(--border-subtle)',
              }}
              value={params.dateTo ? params.dateTo.slice(0, 10) : ''}
              onChange={e => handleDateTo(e.target.value)}
            />
            {errors?.dateTo && (
              <p style={{ color: 'var(--color-danger)', fontSize: 12, fontFamily: 'var(--font-ui)', margin: '4px 0 0 0' }}>
                {errors.dateTo}
              </p>
            )}
          </div>
        </>
      )}

      {/* Lab select — ADMIN only */}
      {isAdmin && labs && labs.length > 0 && (
        <div>
          <label style={LABEL_STYLE}>Lab</label>
          <select
            style={SELECT_STYLE}
            value={params.labId ?? ''}
            onChange={e => handleLabChange(e.target.value)}
          >
            <option value="">Tüm Lablar</option>
            {labs.map(lab => (
              <option key={lab.id} value={lab.id}>{lab.name}</option>
            ))}
          </select>
        </div>
      )}
    </div>
  )
}
