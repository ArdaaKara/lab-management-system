import { useParams, useNavigate, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { useLabDetailQuery } from '@/hooks/useLabsQuery'
import { getComputerListByLab } from '@/services/computerService'
import { computerKeys } from '@/hooks/useComputersQuery'
import { useAuth } from '@/hooks/useAuth'
import type { ComputerStatus } from '@/types/computer.types'
import { Skeleton } from '@/components/common/Skeleton'
import { SkeletonTable } from '@/components/common/SkeletonTable'

const STATUS_LABEL: Record<ComputerStatus, string> = {
  ACTIVE: 'Aktif',
  FAULTY: 'Arızalı',
  UNDER_REPAIR: 'Onarımda',
  DECOMMISSIONED: 'Hizmet Dışı',
}

const STATUS_STYLE: Record<ComputerStatus, React.CSSProperties> = {
  ACTIVE: {
    background: 'rgba(82,183,136,0.12)',
    color: 'var(--color-success)',
    border: '1px solid var(--color-success)',
  },
  FAULTY: {
    background: 'rgba(224,112,112,0.12)',
    color: 'var(--color-danger)',
    border: '1px solid var(--color-danger)',
  },
  UNDER_REPAIR: {
    background: 'rgba(212,160,23,0.12)',
    color: 'var(--color-warning)',
    border: '1px solid var(--color-warning)',
  },
  DECOMMISSIONED: {
    background: 'var(--bg-raised)',
    color: 'var(--text-muted)',
    border: '1px solid var(--border-subtle)',
  },
}

function StatusBadge({ status }: { status: ComputerStatus }) {
  return (
    <span
      style={{
        ...STATUS_STYLE[status],
        fontSize: 11,
        fontWeight: 600,
        letterSpacing: '0.04em',
        borderRadius: 4,
        padding: '2px 8px',
        fontFamily: 'var(--font-ui)',
        display: 'inline-block',
      }}
    >
      {STATUS_LABEL[status]}
    </span>
  )
}

function StatCard({ label, value, danger }: { label: string; value: number; danger?: boolean }) {
  return (
    <div
      style={{
        background: 'var(--bg-surface)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-lg)',
        padding: '16px 20px',
        minWidth: 120,
      }}
    >
      <span
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 26,
          fontWeight: 500,
          color: danger && value > 0 ? 'var(--color-danger)' : 'var(--text-primary)',
          display: 'block',
          marginBottom: 4,
        }}
      >
        {value}
      </span>
      <span
        style={{
          fontFamily: 'var(--font-ui)',
          fontSize: 11,
          textTransform: 'uppercase',
          letterSpacing: '0.06em',
          color: 'var(--text-muted)',
        }}
      >
        {label}
      </span>
    </div>
  )
}

export default function LabDetailPage() {
  const { labId } = useParams<{ labId: string }>()
  const navigate = useNavigate()
  const { isAdmin } = useAuth()

  const {
    data: lab,
    isLoading: labLoading,
    isError: labError,
  } = useLabDetailQuery(labId ?? null)

  const { data: computers = [], isLoading: computersLoading } = useQuery({
    queryKey: labId ? computerKeys.byLab(labId) : ['computers', 'none'],
    queryFn: () => getComputerListByLab(labId!),
    enabled: !!labId,
    staleTime: 30_000,
  })

  if (labLoading) {
    return (
      <div
        aria-label="İçerik yükleniyor"
        style={{ background: 'var(--bg-base)', minHeight: '100vh', padding: 'var(--space-6)' }}
      >
        {/* Header skeleton */}
        <div style={{ marginBottom: 'var(--space-6)', display: 'flex', flexDirection: 'column', gap: 8 }}>
          <Skeleton.Title />
          <Skeleton.Text />
        </div>

        {/* Stats skeleton */}
        <div style={{ display: 'flex', gap: 'var(--space-3)', marginBottom: 'var(--space-6)', flexWrap: 'wrap' }}>
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton.Rect key={i} width={120} height={60} />
          ))}
        </div>

        {/* Table skeleton */}
        <div
          style={{
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-lg)',
            overflow: 'hidden',
          }}
        >
          <SkeletonTable columns={4} rows={5} />
        </div>
      </div>
    )
  }

  if (labError || !lab) {
    return (
      <div
        style={{
          background: 'var(--bg-base)',
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 16,
        }}
      >
        <p
          style={{
            fontFamily: 'var(--font-ui)',
            fontSize: 14,
            color: 'var(--text-secondary)',
            margin: 0,
          }}
        >
          Lab bulunamadı
        </p>
        <button
          onClick={() => navigate('/labs')}
          style={{
            background: 'transparent',
            border: '1px solid var(--accent)',
            color: 'var(--accent)',
            fontFamily: 'var(--font-ui)',
            fontSize: 13,
            padding: '6px 16px',
            borderRadius: 'var(--radius-md)',
            cursor: 'pointer',
          }}
        >
          Geri Dön
        </button>
      </div>
    )
  }

  const activeCount = computers.filter(c => c.status === 'ACTIVE').length
  const faultyCount = computers.filter(c => c.status === 'FAULTY').length
  const repairCount = computers.filter(c => c.status === 'UNDER_REPAIR').length

  return (
    <div style={{ background: 'var(--bg-base)', minHeight: '100vh', padding: 'var(--space-6)' }}>
      {/* Breadcrumb */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          marginBottom: 'var(--space-4)',
          fontFamily: 'var(--font-ui)',
          fontSize: 13,
        }}
      >
        <Link
          to="/labs"
          style={{ color: 'var(--text-muted)', textDecoration: 'none' }}
        >
          Laboratuvarlar
        </Link>
        <span style={{ color: 'var(--text-muted)' }}>/</span>
        <span style={{ color: 'var(--text-secondary)' }}>{lab.roomNumber}</span>
      </div>

      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          marginBottom: 'var(--space-6)',
        }}
      >
        <div>
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 13,
              color: 'var(--accent)',
              letterSpacing: '0.06em',
              display: 'block',
              marginBottom: 4,
            }}
          >
            {lab.roomNumber}
          </span>
          <h1
            style={{
              fontFamily: 'var(--font-ui)',
              fontWeight: 600,
              fontSize: 22,
              letterSpacing: '-0.02em',
              color: 'var(--text-primary)',
              margin: 0,
            }}
          >
            {lab.name}
          </h1>
        </div>
        {isAdmin && (
          <button
            onClick={() => navigate(`/labs/${labId}/qr-sheet`)}
            style={{
              background: 'transparent',
              border: '1px solid var(--border-default)',
              color: 'var(--text-secondary)',
              fontFamily: 'var(--font-ui)',
              fontSize: 12,
              padding: '5px 12px',
              borderRadius: 'var(--radius-md)',
              cursor: 'pointer',
            }}
          >
            QR Baskı
          </button>
        )}
      </div>

      {/* Stats bar */}
      <div
        style={{
          display: 'flex',
          gap: 'var(--space-3)',
          marginBottom: 'var(--space-6)',
          flexWrap: 'wrap',
        }}
      >
        <StatCard label="Toplam PC" value={computers.length} />
        <StatCard label="Aktif" value={activeCount} />
        <StatCard label="Arızalı" value={faultyCount} danger />
        <StatCard label="Onarımda" value={repairCount} />
      </div>

      {/* Computer table */}
      <div
        style={{
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-lg)',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            padding: '14px 16px',
            borderBottom: '1px solid var(--border-subtle)',
            fontFamily: 'var(--font-ui)',
            fontSize: 13,
            fontWeight: 600,
            color: 'var(--text-secondary)',
          }}
        >
          Bilgisayarlar
        </div>

        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
              {['Hostname', 'IP Adresi', 'Konum', 'Durum'].map(col => (
                <th
                  key={col}
                  style={{
                    padding: '10px 16px',
                    textAlign: 'left',
                    fontFamily: 'var(--font-ui)',
                    fontSize: 11,
                    fontWeight: 600,
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    color: 'var(--text-muted)',
                  }}
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {computersLoading && (
              <tr>
                <td colSpan={4} style={{ padding: 0 }}>
                  <SkeletonTable columns={4} rows={4} />
                </td>
              </tr>
            )}

            {!computersLoading && computers.length === 0 && (
              <tr>
                <td colSpan={4} style={{ padding: '40px 16px', textAlign: 'center' }}>
                  <p
                    style={{
                      fontFamily: 'var(--font-ui)',
                      fontSize: 14,
                      color: 'var(--text-secondary)',
                      margin: 0,
                    }}
                  >
                    Bu laboratuvarda bilgisayar yok
                  </p>
                </td>
              </tr>
            )}

            {!computersLoading && computers.map(c => (
              <tr
                key={c.id}
                style={{ borderBottom: '1px solid var(--border-subtle)' }}
                onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg-raised)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
              >
                <td style={{ padding: '12px 16px' }}>
                  <span
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: 13,
                      color: 'var(--text-primary)',
                    }}
                  >
                    {c.hostname ?? c.assetTag}
                  </span>
                </td>
                <td style={{ padding: '12px 16px' }}>
                  <span
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: 13,
                      color: 'var(--text-secondary)',
                    }}
                  >
                    {c.ipAddress ?? '—'}
                  </span>
                </td>
                <td style={{ padding: '12px 16px' }}>
                  <span
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: 13,
                      color: 'var(--text-secondary)',
                    }}
                  >
                    {c.gridRow != null && c.gridCol != null
                      ? `${c.gridRow + 1} × ${c.gridCol + 1}`
                      : 'Depo'}
                  </span>
                </td>
                <td style={{ padding: '12px 16px' }}>
                  <StatusBadge status={c.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
