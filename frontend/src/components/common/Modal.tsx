import type { ReactNode } from 'react'

interface ModalProps {
  open: boolean
  onClose: () => void
  children: ReactNode
  maxWidth?: number
}

export default function Modal({ open, onClose, children, maxWidth = 480 }: ModalProps) {
  if (!open) return null

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.7)',
        zIndex: 50,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: '#13131A',
          border: '1px solid #1E1E2E',
          borderRadius: 'var(--radius-xl)',
          padding: 24,
          width: '100%',
          maxWidth,
          maxHeight: '90vh',
          overflowY: 'auto',
          boxSizing: 'border-box',
        }}
        onClick={e => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  )
}
