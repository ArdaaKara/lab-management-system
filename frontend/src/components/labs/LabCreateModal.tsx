import { useState, useEffect } from 'react'
import { useLabMutations } from '@/hooks/useLabsQuery'

interface LabCreateModalProps {
  open: boolean
  onClose: () => void
}

const LABEL_STYLE: React.CSSProperties = {
  fontFamily: 'var(--font-ui)',
  fontSize: 11,
  fontWeight: 600,
  textTransform: 'uppercase',
  letterSpacing: '0.06em',
  color: 'var(--text-muted)',
  display: 'block',
  marginBottom: 6,
}

const INPUT_STYLE: React.CSSProperties = {
  width: '100%',
  background: 'var(--bg-raised)',
  border: '1px solid var(--border-default)',
  borderRadius: 'var(--radius-md)',
  color: 'var(--text-primary)',
  fontFamily: 'var(--font-ui)',
  fontSize: 14,
  padding: '8px 12px',
  outline: 'none',
  boxSizing: 'border-box',
}

const ERROR_STYLE: React.CSSProperties = {
  fontFamily: 'var(--font-ui)',
  fontSize: 12,
  color: 'var(--color-danger)',
  marginTop: 4,
}

export default function LabCreateModal({ open, onClose }: LabCreateModalProps) {
  const { create } = useLabMutations()
  const [name, setName] = useState('')
  const [roomNumber, setRoomNumber] = useState('')
  const [maxRows, setMaxRows] = useState('')
  const [maxCols, setMaxCols] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    if (!open) {
      setName('')
      setRoomNumber('')
      setMaxRows('')
      setMaxCols('')
      setError('')
    }
  }, [open])

  if (!open) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    const rows = parseInt(maxRows)
    const cols = parseInt(maxCols)

    if (!name.trim() || !roomNumber.trim()) {
      setError('Lab adı ve oda numarası zorunludur.')
      return
    }
    if (isNaN(rows) || rows < 1 || isNaN(cols) || cols < 1) {
      setError('Satır ve sütun sayısı en az 1 olmalıdır.')
      return
    }

    create.mutate(
      { name: name.trim(), roomNumber: roomNumber.trim(), maxRows: rows, maxCols: cols },
      { onSuccess: onClose }
    )
  }

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
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-xl)',
          padding: 'var(--space-6)',
          width: '100%',
          maxWidth: 440,
          boxSizing: 'border-box',
        }}
        onClick={e => e.stopPropagation()}
      >
        <h2
          style={{
            fontFamily: 'var(--font-ui)',
            fontWeight: 600,
            fontSize: 16,
            color: 'var(--text-primary)',
            margin: '0 0 20px 0',
            letterSpacing: '-0.02em',
          }}
        >
          Yeni Laboratuvar
        </h2>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label htmlFor="lab-name" style={LABEL_STYLE}>Lab Adı</label>
            <input
              id="lab-name"
              name="name"
              autoComplete="off"
              style={INPUT_STYLE}
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Bilgisayar Laboratuvarı 1"
              onFocus={e => (e.target.style.borderColor = 'var(--accent)')}
              onBlur={e => (e.target.style.borderColor = 'var(--border-default)')}
            />
          </div>

          <div>
            <label htmlFor="lab-room-number" style={LABEL_STYLE}>Oda Numarası</label>
            <input
              id="lab-room-number"
              name="roomNumber"
              autoComplete="off"
              style={INPUT_STYLE}
              value={roomNumber}
              onChange={e => setRoomNumber(e.target.value)}
              placeholder="A-101"
              onFocus={e => (e.target.style.borderColor = 'var(--accent)')}
              onBlur={e => (e.target.style.borderColor = 'var(--border-default)')}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label htmlFor="lab-max-rows" style={LABEL_STYLE}>Satır Sayısı</label>
              <input
                id="lab-max-rows"
                name="maxRows"
                type="number"
                min={1}
                max={20}
                autoComplete="off"
                style={INPUT_STYLE}
                value={maxRows}
                onChange={e => setMaxRows(e.target.value)}
                placeholder="5"
                onFocus={e => (e.target.style.borderColor = 'var(--accent)')}
                onBlur={e => (e.target.style.borderColor = 'var(--border-default)')}
              />
            </div>
            <div>
              <label htmlFor="lab-max-cols" style={LABEL_STYLE}>Sütun Sayısı</label>
              <input
                id="lab-max-cols"
                name="maxCols"
                type="number"
                min={1}
                max={20}
                autoComplete="off"
                style={INPUT_STYLE}
                value={maxCols}
                onChange={e => setMaxCols(e.target.value)}
                placeholder="8"
                onFocus={e => (e.target.style.borderColor = 'var(--accent)')}
                onBlur={e => (e.target.style.borderColor = 'var(--border-default)')}
              />
            </div>
          </div>

          {error && <p style={ERROR_STYLE}>{error}</p>}

          <div style={{ display: 'flex', gap: 10, marginTop: 4, justifyContent: 'flex-end' }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: '8px 16px',
                borderRadius: 'var(--radius-md)',
                background: 'transparent',
                border: '1px solid var(--border-default)',
                color: 'var(--text-secondary)',
                fontFamily: 'var(--font-ui)',
                fontSize: 13,
                cursor: 'pointer',
              }}
            >
              İptal
            </button>
            <button
              type="submit"
              disabled={create.isPending}
              style={{
                padding: '8px 16px',
                borderRadius: 'var(--radius-md)',
                background: 'var(--accent)',
                border: 'none',
                color: 'var(--accent-text)',
                fontFamily: 'var(--font-ui)',
                fontSize: 13,
                fontWeight: 600,
                cursor: create.isPending ? 'not-allowed' : 'pointer',
                opacity: create.isPending ? 0.7 : 1,
              }}
            >
              {create.isPending ? 'Oluşturuluyor…' : 'Oluştur'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
