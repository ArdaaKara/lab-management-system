import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import * as Chart from 'chart.js'
import { Download, BarChart3 } from 'lucide-react'
import useLabStore from '@/stores/useLabStore'
import { useAuth } from '@/hooks/useAuth'
import { useReportSummaryQuery } from '@/hooks/useAnalyticsQuery'
import { useReportExport } from '@/hooks/useReportExport'
import ReportFilters from './ReportFilters'
import { ReportPeriod, ReportRangeRequest, DashboardSummary } from '@/types/reports.types'

Chart.Chart.register(...Chart.registerables)

const CATEGORY_LABELS: Record<string, string> = {
  NO_DISPLAY: 'Ekran Yok',
  NO_INTERNET: 'İnternet Yok',
  NO_POWER: 'Güç Yok',
  SLOW_PERFORMANCE: 'Yavaş Performans',
  PERIPHERAL_FAILURE: 'Çevre Birimi Arızası',
  OS_ERROR: 'İS Hatası',
  OTHER: 'Diğer',
}

const SHIMMER: React.CSSProperties = {
  background: 'linear-gradient(90deg, var(--bg-surface) 25%, var(--bg-raised) 50%, var(--bg-surface) 75%)',
  backgroundSize: '200% 100%',
  animation: 'shimmer 1.5s infinite',
  borderRadius: 'var(--radius-md)',
}

// ── Chart components ─────────────────────────────────────

function IssueByDayChart({ data }: { data: DashboardSummary['issuesByDay'] }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const chartRef = useRef<Chart.Chart | null>(null)

  useEffect(() => {
    if (!canvasRef.current) return
    chartRef.current?.destroy()
    const ctx = canvasRef.current.getContext('2d')
    if (!ctx) return

    const cs = getComputedStyle(document.documentElement)
    const accent    = cs.getPropertyValue('--accent').trim()
    const axisColor = cs.getPropertyValue('--text-secondary').trim()
    const gridColor = cs.getPropertyValue('--border-subtle').trim()
    const monoColor = cs.getPropertyValue('--text-mono').trim()

    chartRef.current = new Chart.Chart(ctx, {
      type: 'bar',
      data: {
        labels: data.map(d => d.date),
        datasets: [{
          data: data.map(d => d.count),
          backgroundColor: accent + '99',
          borderColor: accent,
          borderWidth: 1,
          borderRadius: 4,
        }],
      },
      options: {
        plugins: { legend: { display: false } },
        scales: {
          x: {
            ticks: { color: monoColor, font: { family: 'JetBrains Mono', size: 10 } },
            grid: { color: gridColor },
          },
          y: {
            ticks: { color: axisColor, stepSize: 1 },
            grid: { color: gridColor },
            beginAtZero: true,
          },
        },
        responsive: true,
        maintainAspectRatio: false,
      },
    })

    return () => { chartRef.current?.destroy(); chartRef.current = null }
  }, [data])

  return (
    <div
      role="img"
      aria-label="Günlük arıza grafiği"
      style={{
        background: 'var(--bg-surface)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-lg)',
        padding: 16,
      }}
    >
      <p style={{ fontFamily: 'var(--font-ui)', fontWeight: 600, fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', margin: '0 0 12px 0' }}>
        Günlük Arıza Dağılımı
      </p>
      <div style={{ height: 200 }}>
        <canvas ref={canvasRef} />
      </div>
    </div>
  )
}

function CategoryBreakdownChart({ data }: { data: DashboardSummary['issuesByCategory'] }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const chartRef = useRef<Chart.Chart | null>(null)

  useEffect(() => {
    if (!canvasRef.current) return
    chartRef.current?.destroy()
    const ctx = canvasRef.current.getContext('2d')
    if (!ctx) return

    const cs = getComputedStyle(document.documentElement)
    const borderColor = cs.getPropertyValue('--border-subtle').trim()
    const legendColor = cs.getPropertyValue('--text-secondary').trim()
    const PALETTE = [
      cs.getPropertyValue('--status-faulty-text').trim(),
      cs.getPropertyValue('--color-info').trim(),
      cs.getPropertyValue('--status-repair-text').trim(),
      cs.getPropertyValue('--color-success').trim(),
      cs.getPropertyValue('--text-secondary').trim(),
    ]

    chartRef.current = new Chart.Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: data.map(d => CATEGORY_LABELS[d.category] ?? d.category),
        datasets: [{
          data: data.map(d => d.count),
          backgroundColor: PALETTE.slice(0, data.length),
          borderColor,
          borderWidth: 2,
        }],
      },
      options: {
        plugins: {
          legend: { labels: { color: legendColor, font: { family: 'Inter' } } },
        },
        cutout: '60%',
        responsive: true,
        maintainAspectRatio: false,
      },
    })

    return () => { chartRef.current?.destroy(); chartRef.current = null }
  }, [data])

  return (
    <div
      role="img"
      aria-label="Kategori bazlı arıza dağılımı"
      style={{
        background: 'var(--bg-surface)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-lg)',
        padding: 16,
      }}
    >
      <p style={{ fontFamily: 'var(--font-ui)', fontWeight: 600, fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', margin: '0 0 12px 0' }}>
        Kategori Dağılımı
      </p>
      <div style={{ height: 200 }}>
        <canvas ref={canvasRef} />
      </div>
    </div>
  )
}

// ── ReportsPage ───────────────────────────────────────────

export default function ReportsPage() {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const { isAdmin, isTeacher } = useAuth()
  const labs = useLabStore(s => s.labs)
  const { isExporting, exportCsv } = useReportExport()

  // For TEACHER, ownLabId comes from the first (only) lab the API returns for them
  const ownLabId = isTeacher ? (labs[0]?.id ?? null) : null

  const [filterParams, setFilterParams] = useState<ReportRangeRequest>(() => ({
    period: (searchParams.get('period') as ReportPeriod) ?? 'THIS_MONTH',
    labId: isTeacher ? undefined : (searchParams.get('labId') ?? undefined),
    dateFrom: searchParams.get('dateFrom') ?? undefined,
    dateTo: searchParams.get('dateTo') ?? undefined,
  }))

  const [dateErrors, setDateErrors] = useState<{ dateFrom?: string; dateTo?: string }>({})

  // Once ownLabId is resolved for TEACHER, inject it into filterParams
  useEffect(() => {
    if (isTeacher && ownLabId) {
      setFilterParams(prev => ({ ...prev, labId: ownLabId }))
    }
  }, [isTeacher, ownLabId])

  function handleFilterChange(next: ReportRangeRequest) {
    const errs: { dateFrom?: string; dateTo?: string } = {}
    if (next.period === 'CUSTOM') {
      if (!next.dateFrom) errs.dateFrom = 'Zorunlu alan'
      if (!next.dateTo)   errs.dateTo   = 'Zorunlu alan'
    }
    setDateErrors(errs)
    setFilterParams(next)

    const sp = new URLSearchParams()
    sp.set('period', next.period)
    if (!isTeacher && next.labId) sp.set('labId', next.labId)
    if (next.period === 'CUSTOM' && next.dateFrom) sp.set('dateFrom', next.dateFrom)
    if (next.period === 'CUSTOM' && next.dateTo)   sp.set('dateTo',   next.dateTo)
    setSearchParams(sp, { replace: true })
  }

  // Stable query params — TEACHER's labId is always locked to ownLabId
  const queryParams = useMemo<ReportRangeRequest>(() => {
    const effectiveLabId = isTeacher ? (ownLabId ?? undefined) : filterParams.labId
    const p: ReportRangeRequest = { period: filterParams.period }
    if (effectiveLabId) p.labId = effectiveLabId
    if (filterParams.period === 'CUSTOM') {
      if (filterParams.dateFrom) p.dateFrom = filterParams.dateFrom
      if (filterParams.dateTo)   p.dateTo   = filterParams.dateTo
    }
    return p
  }, [filterParams, isTeacher, ownLabId])

  const isCustomValid  = filterParams.period !== 'CUSTOM' || (!!filterParams.dateFrom && !!filterParams.dateTo)
  const isQueryEnabled = isCustomValid && (isAdmin || ownLabId !== null)

  const { data: summary, isFetching, isError, refetch } = useReportSummaryQuery(queryParams, isQueryEnabled)

  const isEmpty = !isFetching && !isError && summary !== undefined && summary.totalIssues === 0

  return (
    <div style={{ background: 'var(--bg-base)', minHeight: '100vh', padding: 'var(--space-6)' }}>
      <style>{`
        @keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }
        @keyframes spin    { to { transform: rotate(360deg); } }
      `}</style>

      {/* ── PageHeader ── */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 'var(--space-4)' }}>
        <div>
          <p style={{ fontFamily: 'var(--font-ui)', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-muted)', margin: '0 0 2px 0' }}>
            Raporlar
          </p>
          <h1 style={{ fontFamily: 'var(--font-ui)', fontWeight: 600, letterSpacing: '-0.02em', fontSize: 22, color: 'var(--text-primary)', margin: 0 }}>
            Raporlar
          </h1>
        </div>

        <button
          onClick={() => exportCsv(queryParams)}
          disabled={isFetching || isExporting || !isQueryEnabled}
          aria-label="Arıza raporunu CSV olarak indir"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 7,
            background: isExporting ? 'var(--bg-raised)' : 'var(--accent)',
            color: isExporting ? 'var(--text-secondary)' : '#0A0A0F',
            border: 'none',
            borderRadius: 'var(--radius-md)',
            padding: '8px 16px',
            fontFamily: 'var(--font-ui)',
            fontWeight: 600,
            fontSize: 13,
            cursor: isFetching || isExporting || !isQueryEnabled ? 'not-allowed' : 'pointer',
            opacity: isFetching || !isQueryEnabled ? 0.5 : 1,
            transition: 'background 0.15s ease',
          }}
        >
          {isExporting ? (
            <>
              <span style={{ width: 13, height: 13, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'var(--accent)', borderRadius: '50%', animation: 'spin 0.7s linear infinite', display: 'inline-block' }} />
              Aktarılıyor...
            </>
          ) : (
            <>
              <Download size={14} />
              CSV İndir
            </>
          )}
        </button>
      </div>

      {/* ── Filters ── */}
      <ReportFilters
        params={filterParams}
        onChange={handleFilterChange}
        labs={labs}
        isAdmin={isAdmin}
        errors={dateErrors}
      />

      {/* ── Error ── */}
      {isError && (
        <div
          style={{
            background: 'var(--status-faulty-bg)',
            border: '1px solid var(--status-faulty)',
            borderRadius: 'var(--radius-md)',
            padding: '10px 16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 'var(--space-4)',
          }}
        >
          <span style={{ fontFamily: 'var(--font-ui)', fontSize: 13, color: 'var(--status-faulty-text)' }}>
            Rapor yüklenemedi.
          </span>
          <button
            onClick={() => refetch()}
            style={{
              background: 'transparent',
              border: '1px solid var(--status-faulty)',
              color: 'var(--status-faulty-text)',
              padding: '4px 12px',
              borderRadius: 'var(--radius-md)',
              fontFamily: 'var(--font-ui)',
              fontSize: 12,
              cursor: 'pointer',
            }}
          >
            Tekrar Dene
          </button>
        </div>
      )}

      {/* ── Summary Cards ── */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 'var(--space-4)',
          marginBottom: 'var(--space-6)',
        }}
      >
        {[
          { label: 'Toplam Arıza',    value: summary?.totalIssues,               nullable: false, color: 'var(--text-primary)' },
          { label: 'Açık',            value: summary?.openIssues,                nullable: false, color: 'var(--status-faulty-text)' },
          { label: 'Onay Bekleyen',   value: summary?.resolvedAwaitingApproval,  nullable: false, color: 'var(--color-warning)' },
          { label: 'Ort. Çözüm (sa)', value: summary?.avgResolutionHours,        nullable: true,  color: 'var(--color-info)' },
        ].map(card => (
          <div
            key={card.label}
            style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-lg)', padding: '16px 20px' }}
          >
            {isFetching ? (
              <div role="status" aria-busy="true" aria-label="Yükleniyor" style={{ ...SHIMMER, height: 80 }} />
            ) : (
              <>
                <p
                  aria-label={card.label}
                  style={{ fontFamily: 'var(--font-mono)', fontSize: 32, fontWeight: 500, color: card.color, margin: '0 0 6px 0' }}
                >
                  {card.nullable && (card.value === null || card.value === undefined)
                    ? '—'
                    : (card.value ?? 0)}
                </p>
                <p style={{ fontFamily: 'var(--font-ui)', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', margin: 0 }}>
                  {card.label}
                </p>
              </>
            )}
          </div>
        ))}
      </div>

      {/* ── Empty State ── */}
      {isEmpty && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 'var(--space-6)', gap: 12 }}>
          <BarChart3 size={48} color="var(--text-muted)" />
          <p style={{ fontFamily: 'var(--font-ui)', fontWeight: 600, fontSize: 16, color: 'var(--text-muted)', margin: 0 }}>
            Seçilen dönemde arıza kaydı yok.
          </p>
          <p style={{ fontFamily: 'var(--font-ui)', fontSize: 13, color: 'var(--text-muted)', margin: 0 }}>
            Farklı bir tarih aralığı veya lab seçin.
          </p>
        </div>
      )}

      {/* ── Charts + Table (non-empty or loading) ── */}
      {!isEmpty && !isError && (
        <>
          {/* Charts row */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)', marginBottom: 'var(--space-6)' }}>
            {isFetching ? (
              <>
                <div role="status" aria-busy="true" aria-label="Yükleniyor" style={{ ...SHIMMER, height: 200 }} />
                <div role="status" aria-busy="true" aria-label="Yükleniyor" style={{ ...SHIMMER, height: 200 }} />
              </>
            ) : summary ? (
              <>
                <IssueByDayChart data={summary.issuesByDay} />
                <CategoryBreakdownChart data={summary.issuesByCategory} />
              </>
            ) : null}
          </div>

          {/* TopFaultyTable */}
          <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
            <p style={{ fontFamily: 'var(--font-ui)', fontWeight: 600, fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', margin: 0, padding: '12px 16px', borderBottom: '1px solid var(--border-subtle)' }}>
              En Çok Arıza Veren Bilgisayarlar
            </p>

            {isFetching ? (
              <div style={{ padding: '8px 16px', display: 'flex', flexDirection: 'column', gap: 8 }}>
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} role="status" aria-busy="true" aria-label="Yükleniyor" style={{ ...SHIMMER, height: 36 }} />
                ))}
              </div>
            ) : (
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                    <th style={{ padding: '8px 16px', textAlign: 'left', fontFamily: 'var(--font-ui)', fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                      Hostname
                    </th>
                    <th style={{ padding: '8px 16px', textAlign: 'right', fontFamily: 'var(--font-ui)', fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                      Arıza Sayısı
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {(summary?.topFaultyComputers ?? []).slice(0, 5).map(pc => (
                    <tr
                      key={pc.computerId}
                      onClick={() => navigate(`/issues?computerId=${pc.computerId}`)}
                      style={{ borderBottom: '1px solid var(--border-subtle)', cursor: 'pointer', transition: 'background 0.1s ease' }}
                      onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg-raised)')}
                      onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                    >
                      <td style={{ padding: '10px 16px', fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--text-mono)' }}>
                        {pc.hostname}
                      </td>
                      <td style={{ padding: '10px 16px', fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--text-primary)', textAlign: 'right' }}>
                        {pc.faultCount}
                      </td>
                    </tr>
                  ))}
                  {(summary?.topFaultyComputers ?? []).length === 0 && (
                    <tr>
                      <td colSpan={2} style={{ padding: 20, textAlign: 'center', fontFamily: 'var(--font-ui)', fontSize: 13, color: 'var(--text-muted)' }}>
                        Veri yok
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
        </>
      )}
    </div>
  )
}
