import useLabStore from '@/stores/useLabStore'
import { useAuth } from '@/hooks/useAuth'

export default function TopBar() {
  const selectedLabId = useLabStore(state => state.selectedLabId)
  const labs = useLabStore(state => state.labs)
  const { user } = useAuth()

  const selectedLab = labs.find(l => l.id === selectedLabId)

  return (
    <header
      style={{
        height: 48,
        background: '#13131A',
        borderBottom: '1px solid #1E1E2E',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 24px',
        flexShrink: 0,
      }}
    >
      <span
        style={{
          fontFamily: 'Inter',
          fontSize: 13,
          color: '#6B6B80',
        }}
      >
        {selectedLab ? selectedLab.name : 'Lab seçilmedi'}
      </span>

      <span
        style={{
          fontFamily: 'JetBrains Mono',
          fontSize: 12,
          color: '#C9A84C',
        }}
      >
        {user?.fullName ?? ''}
      </span>
    </header>
  )
}
