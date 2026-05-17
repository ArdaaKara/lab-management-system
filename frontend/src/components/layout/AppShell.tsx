import { useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import useLabStore from '@/stores/useLabStore'
import { useShortcuts } from '@/hooks/useShortcuts'
import ShortcutsHelpDialog from '@/components/common/ShortcutsHelpDialog'

export default function AppShell() {
  const fetchLabs = useLabStore(state => state.fetchLabs)
  const { helpOpen, setHelpOpen } = useShortcuts()

  useEffect(() => {
    fetchLabs()
  }, [fetchLabs])

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
        minHeight: '100vh',
        background: '#0A0A0F',
      }}
    >
      <Sidebar />
      <main style={{ flex: 1, overflow: 'auto', background: '#0A0A0F' }}>
        <Outlet />
      </main>
      <ShortcutsHelpDialog open={helpOpen} onClose={() => setHelpOpen(false)} />
    </div>
  )
}
