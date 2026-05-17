import { useState } from 'react'
import { Users } from 'lucide-react'
import { useUsersQuery, useUserMutations } from '@/hooks/useUsersQuery'
import type { UserRecord } from '@/services/userService'
import UserCreateModal from '@/components/users/UserCreateModal'
import { SkeletonTable } from '@/components/common/SkeletonTable'
import EmptyState from '@/components/common/EmptyState'

const ROLE_LABEL: Record<string, string> = {
  ADMIN: 'Yönetici',
  TEACHER: 'Öğretmen',
  TECHNICIAN: 'Teknisyen',
}

const ROLE_STYLE: Record<string, React.CSSProperties> = {
  ADMIN: {
    background: 'var(--accent-muted)',
    color: 'var(--accent)',
    border: '1px solid var(--accent)',
  },
  TEACHER: {
    background: 'rgba(107,143,212,0.12)',
    color: 'var(--color-info)',
    border: '1px solid var(--color-info)',
  },
  TECHNICIAN: {
    background: 'rgba(82,183,136,0.12)',
    color: 'var(--color-success)',
    border: '1px solid var(--color-success)',
  },
}

function RoleBadge({ role }: { role: string }) {
  const style = ROLE_STYLE[role] ?? { background: 'var(--bg-raised)', color: 'var(--text-muted)', border: '1px solid var(--border-default)' }
  return (
    <span
      style={{
        ...style,
        fontSize: 11,
        fontWeight: 600,
        letterSpacing: '0.04em',
        borderRadius: 4,
        padding: '2px 8px',
        fontFamily: 'var(--font-ui)',
        display: 'inline-block',
      }}
    >
      {ROLE_LABEL[role] ?? role}
    </span>
  )
}

function StatusDot({ isActive }: { isActive: boolean }) {
  return (
    <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
      <span
        style={{
          width: 7,
          height: 7,
          borderRadius: '50%',
          background: isActive ? 'var(--color-success)' : 'var(--text-muted)',
          display: 'inline-block',
          flexShrink: 0,
        }}
      />
      <span
        style={{
          fontSize: 13,
          color: isActive ? 'var(--color-success)' : 'var(--text-muted)',
          fontFamily: 'var(--font-ui)',
        }}
      >
        {isActive ? 'Aktif' : 'Pasif'}
      </span>
    </span>
  )
}


function UserRow({ user, onToggle, isPending }: {
  user: UserRecord
  onToggle: () => void
  isPending: boolean
}) {
  const primaryRole = user.roles[0] ?? ''

  return (
    <tr
      style={{
        borderBottom: '1px solid var(--border-subtle)',
        transition: 'background 120ms',
      }}
      onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg-raised)')}
      onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
    >
      <td style={{ padding: '12px 16px' }}>
        <span
          style={{
            fontSize: 14,
            color: 'var(--text-primary)',
            fontFamily: 'var(--font-ui)',
            fontWeight: 500,
          }}
        >
          {user.fullName}
        </span>
      </td>
      <td style={{ padding: '12px 16px' }}>
        <RoleBadge role={primaryRole} />
      </td>
      <td style={{ padding: '12px 16px' }}>
        <span
          style={{
            fontSize: 13,
            color: 'var(--text-secondary)',
            fontFamily: 'var(--font-mono)',
          }}
        >
          {user.email}
        </span>
      </td>
      <td style={{ padding: '12px 16px' }}>
        <StatusDot isActive={user.isActive} />
      </td>
      <td style={{ padding: '12px 16px' }}>
        <button
          onClick={onToggle}
          disabled={isPending}
          style={{
            background: 'transparent',
            border: `1px solid ${user.isActive ? 'var(--border-default)' : 'var(--color-success)'}`,
            color: user.isActive ? 'var(--text-secondary)' : 'var(--color-success)',
            fontFamily: 'var(--font-ui)',
            fontSize: 12,
            padding: '4px 10px',
            borderRadius: 'var(--radius-sm)',
            cursor: isPending ? 'not-allowed' : 'pointer',
            opacity: isPending ? 0.5 : 1,
            transition: 'opacity 120ms',
          }}
        >
          {user.isActive ? 'Devre Dışı Bırak' : 'Aktifleştir'}
        </button>
      </td>
    </tr>
  )
}

export default function UserListPage() {
  const [modalOpen, setModalOpen] = useState(false)
  const { data, isLoading, isError, refetch } = useUsersQuery()
  const { toggleActive } = useUserMutations()

  return (
    <div style={{ background: 'var(--bg-base)', minHeight: '100vh', padding: 24 }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          marginBottom: 24,
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
            Kullanıcılar
          </h1>
        </div>
        <button
          onClick={() => setModalOpen(true)}
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
          + Yeni Kullanıcı
        </button>
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
            Kullanıcılar yüklenemedi
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

      {!isError && isLoading && (
        <div
          style={{
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-lg)',
            overflow: 'hidden',
          }}
        >
          <SkeletonTable columns={6} rows={6} />
        </div>
      )}

      {!isError && !isLoading && (
        <div
          style={{
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-lg)',
            overflow: 'hidden',
          }}
        >
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                {['Kullanıcı', 'Rol', 'E-posta', 'Durum', 'İşlemler'].map(col => (
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
              {data && data.length === 0 && (
                <tr>
                  <td colSpan={5} style={{ padding: 0 }}>
                    <EmptyState
                      icon={Users}
                      title="Kullanıcı bulunamadı"
                      description="Arama kriterinizle eşleşen kullanıcı yok."
                      action={{ label: 'Yeni Kullanıcı', onClick: () => setModalOpen(true) }}
                    />
                  </td>
                </tr>
              )}

              {data?.map(user => (
                <UserRow
                  key={user.id}
                  user={user}
                  onToggle={() => toggleActive.mutate({ userId: user.id, isActive: !user.isActive })}
                  isPending={toggleActive.isPending}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}

      <UserCreateModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  )
}
