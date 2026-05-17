import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Building2 } from 'lucide-react'
import { useLabsQuery } from '@/hooks/useLabsQuery'
import { useAuth } from '@/hooks/useAuth'
import type { LabResponse } from '@/types/lab.types'
import { Skeleton } from '@/components/common/Skeleton'
import EmptyState from '@/components/common/EmptyState'
import LabCreateModal from '@/components/labs/LabCreateModal'

function LabCard({ lab, onClick }: { lab: LabResponse; onClick: () => void }) {
  return (
    <div
      onClick={onClick}
      style={{
        background: 'var(--bg-surface)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-lg)',
        padding: 'var(--space-4)',
        cursor: 'pointer',
        transition: 'border-color 120ms',
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
      }}
      onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--border-default)')}
      onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--border-subtle)')}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 13,
              color: 'var(--accent)',
              letterSpacing: '0.04em',
            }}
          >
            {lab.roomNumber}
          </span>
          <span
            style={{
              fontFamily: 'var(--font-ui)',
              fontSize: 15,
              fontWeight: 600,
              color: 'var(--text-primary)',
            }}
          >
            {lab.name}
          </span>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 16 }}>
        <div>
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 18,
              fontWeight: 500,
              color: 'var(--text-primary)',
              display: 'block',
            }}
          >
            {lab.maxRows} × {lab.maxCols}
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
            Grid
          </span>
        </div>
        <div>
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 18,
              fontWeight: 500,
              color: 'var(--text-primary)',
              display: 'block',
            }}
          >
            {lab.assignedUserIds.length}
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
            Atanan
          </span>
        </div>
      </div>

      <div
        style={{
          paddingTop: 12,
          borderTop: '1px solid var(--border-subtle)',
        }}
      >
        <span
          style={{
            fontFamily: 'var(--font-ui)',
            fontSize: 12,
            color: 'var(--accent)',
            fontWeight: 500,
          }}
        >
          Detaya Git →
        </span>
      </div>
    </div>
  )
}


export default function LabListPage() {
  const navigate = useNavigate()
  const { isAdmin } = useAuth()
  const { data: labs, isLoading, isError, refetch } = useLabsQuery()
  const [createOpen, setCreateOpen] = useState(false)

  return (
    <div style={{ background: 'var(--bg-base)', minHeight: '100vh', padding: 'var(--space-6)' }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          marginBottom: 'var(--space-6)',
        }}
      >
        <div>
          <h1
            style={{
              fontFamily: 'var(--font-ui)',
              fontWeight: 600,
              fontSize: 20,
              letterSpacing: '-0.02em',
              color: 'var(--text-primary)',
              margin: '0 0 4px 0',
            }}
          >
            Laboratuvarlar
          </h1>
        </div>
        {isAdmin && (
          <button
            onClick={() => setCreateOpen(true)}
            style={{
              background: 'var(--accent)',
              color: 'var(--accent-text)',
              fontFamily: 'var(--font-ui)',
              fontWeight: 600,
              fontSize: 13,
              padding: '8px 16px',
              border: 'none',
              borderRadius: 'var(--radius-md)',
              cursor: 'pointer',
            }}
          >
            + Yeni Lab
          </button>
        )}
      </div>

      {isError && (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 12,
            marginTop: 64,
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
            Laboratuvarlar yüklenemedi
          </p>
          <button
            onClick={() => refetch()}
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
            Yenile
          </button>
        </div>
      )}

      {isLoading && (
        <div
          aria-label="İçerik yükleniyor"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 'var(--space-4)',
          }}
        >
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton.Rect key={i} height={160} />
          ))}
        </div>
      )}

      {!isLoading && !isError && labs && labs.length === 0 && (
        <EmptyState
          icon={Building2}
          title="Laboratuvar bulunamadı"
          description="Henüz laboratuvar oluşturulmamış."
          action={isAdmin ? { label: 'Lab Oluştur', onClick: () => setCreateOpen(true) } : undefined}
        />
      )}

      {!isLoading && !isError && labs && labs.length > 0 && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 'var(--space-4)',
          }}
        >
          {labs.map(lab => (
            <LabCard
              key={lab.id}
              lab={lab}
              onClick={() => navigate(`/labs/${lab.id}`)}
            />
          ))}
        </div>
      )}

      <LabCreateModal open={createOpen} onClose={() => setCreateOpen(false)} />
    </div>
  )
}
