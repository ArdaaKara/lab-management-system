import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import useLabStore from '@/stores/useLabStore'
import useAuthStore from '@/stores/useAuthStore'

interface NavItem {
  label: string
  to: string
}

export default function Sidebar() {
  const { isAdmin, isTeacher, isTechnician, user } = useAuth()
  const selectedLabId = useLabStore(state => state.selectedLabId)
  const labs = useLabStore(state => state.labs)
  const navigate = useNavigate()

  const selectedLab = labs.find(l => l.id === selectedLabId)

  const getNavItems = (): NavItem[] => {
    if (isAdmin) {
      return [
        { label: 'Dashboard', to: '/dashboard' },
        { label: 'Lab Yönetimi', to: '/labs' },
        { label: 'Kullanıcılar', to: '/users' },
        { label: 'Grid Görünümü', to: '/grid' },
        { label: 'Arızalar', to: '/issues' },
        { label: 'Raporlar', to: '/reports' },
      ]
    }
    if (isTeacher) {
      return [
        { label: 'Dashboard', to: '/dashboard' },
        { label: 'Grid Görünümü', to: '/grid' },
        { label: 'Arızalar', to: '/issues' },
        { label: 'Onay Bekleyenler', to: '/issues?tab=pending' },
        { label: 'Raporlar', to: '/reports' },
      ]
    }
    if (isTechnician) {
      return [
        { label: 'Grid Görünümü', to: '/grid' },
        { label: 'Arızalar', to: '/issues' },
      ]
    }
    return []
  }

  const handleLogout = () => {
    useAuthStore.getState().logout()
    navigate('/login')
  }

  return (
    <aside
      style={{
        width: 220,
        minHeight: '100vh',
        background: '#13131A',
        borderRight: '1px solid #1E1E2E',
        padding: '24px 0',
        display: 'flex',
        flexDirection: 'column',
        flexShrink: 0,
      }}
    >
      {/* Logo */}
      <div
        style={{
          padding: '0 20px 24px',
          borderBottom: '1px solid #1E1E2E',
          marginBottom: 8,
        }}
      >
        <p
          style={{
            fontFamily: 'JetBrains Mono',
            fontSize: 16,
            fontWeight: 500,
            color: '#C9A84C',
            margin: '0 0 2px 0',
          }}
        >
          CLMS
        </p>
        <p
          style={{
            fontFamily: 'Inter',
            fontSize: 11,
            color: '#6B6B80',
            margin: 0,
          }}
        >
          Lab Yönetim Sistemi
        </p>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1 }}>
        {getNavItems().map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            style={({ isActive }) => ({
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              padding: isActive ? '10px 17px' : '10px 20px',
              fontFamily: 'Inter',
              fontSize: 13,
              color: isActive ? '#E8E8F0' : '#6B6B80',
              background: isActive ? '#0A0A0F' : 'transparent',
              borderLeft: isActive ? '3px solid #C9A84C' : '3px solid transparent',
              textDecoration: 'none',
              transition: 'color 120ms, background 120ms',
            })}
            onMouseEnter={e => {
              const el = e.currentTarget
              if (!el.classList.contains('active')) {
                el.style.color = '#E8E8F0'
                el.style.background = '#0A0A0F55'
              }
            }}
            onMouseLeave={e => {
              const el = e.currentTarget
              if (!el.classList.contains('active')) {
                el.style.color = '#6B6B80'
                el.style.background = 'transparent'
              }
            }}
          >
            {item.label}
          </NavLink>
        ))}
      </nav>

      {/* Lab Listesi */}
      {labs.length > 0 && (
        <div
          style={{
            borderTop: '1px solid #1E1E2E',
            padding: '12px 0',
          }}
        >
          <p
            style={{
              fontFamily: 'Inter',
              fontSize: 11,
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
              color: '#6B6B80',
              margin: '0 0 6px 0',
              padding: '0 20px',
            }}
          >
            Lablar
          </p>
          {labs.map(lab => (
            <button
              key={lab.id}
              onClick={() => useLabStore.getState().selectLab(lab.id)}
              style={{
                display: 'block',
                width: '100%',
                textAlign: 'left',
                background: selectedLabId === lab.id ? '#0A0A0F' : 'transparent',
                borderLeft: selectedLabId === lab.id ? '3px solid #C9A84C' : '3px solid transparent',
                borderTop: 'none',
                borderRight: 'none',
                borderBottom: 'none',
                padding: selectedLabId === lab.id ? '8px 17px' : '8px 20px',
                fontFamily: 'Inter',
                fontSize: 13,
                color: selectedLabId === lab.id ? '#E8E8F0' : '#6B6B80',
                cursor: 'pointer',
                transition: 'color 120ms, background 120ms',
              }}
              onMouseEnter={e => {
                if (selectedLabId !== lab.id) {
                  e.currentTarget.style.color = '#E8E8F0'
                  e.currentTarget.style.background = '#0A0A0F55'
                }
              }}
              onMouseLeave={e => {
                if (selectedLabId !== lab.id) {
                  e.currentTarget.style.color = '#6B6B80'
                  e.currentTarget.style.background = 'transparent'
                }
              }}
            >
              {lab.name}
            </button>
          ))}
        </div>
      )}

      {/* Footer */}
      <div style={{ marginTop: 'auto' }}>
        {/* Aktif Lab */}
        <div
          style={{
            padding: '16px 20px',
            borderTop: '1px solid #1E1E2E',
          }}
        >
          <p
            style={{
              fontFamily: 'Inter',
              fontSize: 11,
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
              color: '#6B6B80',
              margin: '0 0 2px 0',
            }}
          >
            Aktif Lab:
          </p>
          <p
            style={{
              fontFamily: 'Inter',
              fontSize: 13,
              color: selectedLab ? '#E8E8F0' : '#6B6B80',
              margin: 0,
            }}
          >
            {selectedLab?.name ?? 'Seçilmedi'}
          </p>
        </div>

        {/* Kullanıcı + Logout */}
        <div
          style={{
            padding: '12px 20px',
            display: 'flex',
            flexDirection: 'column',
            gap: 6,
          }}
        >
          <NavLink
            to="/settings/profile"
            style={({ isActive }) => ({
              fontFamily: 'JetBrains Mono',
              fontSize: 12,
              color: isActive ? '#D4B86A' : '#C9A84C',
              textDecoration: 'none',
              transition: 'color 120ms',
            })}
            onMouseEnter={e => (e.currentTarget.style.color = '#D4B86A')}
            onMouseLeave={e => (e.currentTarget.style.color = '#C9A84C')}
          >
            {user?.fullName ?? '—'}
          </NavLink>
          <button
            onClick={handleLogout}
            style={{
              background: 'none',
              border: 'none',
              padding: 0,
              fontFamily: 'Inter',
              fontSize: 12,
              color: '#6B6B80',
              cursor: 'pointer',
              textAlign: 'left',
              transition: 'color 120ms',
            }}
            onMouseEnter={e => (e.currentTarget.style.color = '#E05555')}
            onMouseLeave={e => (e.currentTarget.style.color = '#6B6B80')}
          >
            Çıkış
          </button>
        </div>
      </div>
    </aside>
  )
}
