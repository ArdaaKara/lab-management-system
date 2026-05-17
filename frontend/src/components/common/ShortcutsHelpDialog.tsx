import Modal from './Modal';

interface Props {
  open: boolean;
  onClose: () => void;
}

const SHORTCUTS = [
  { key: '/', action: "Arama'ya odaklan" },
  { key: 'Esc', action: 'Pencereyi kapat' },
  { key: '?', action: 'Bu menüyü aç' },
  { key: 'g g', action: "Lab Grid'e git" },
  { key: 'g i', action: "Arızalara git" },
  { key: 'g d', action: "Dashboard'a git" },
];

export default function ShortcutsHelpDialog({ open, onClose }: Props) {
  return (
    <Modal open={open} onClose={onClose} maxWidth={360}>
      <h2
        style={{
          fontFamily: 'Inter',
          fontWeight: 600,
          fontSize: 16,
          color: 'var(--text-primary)',
          margin: '0 0 20px 0',
          letterSpacing: '-0.02em',
        }}
      >
        Klavye Kısayolları
      </h2>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {SHORTCUTS.map(({ key, action }) => (
          <div
            key={key}
            style={{
              display: 'grid',
              gridTemplateColumns: '72px 1fr',
              alignItems: 'center',
              gap: 16,
            }}
          >
            <span
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 12,
                color: 'var(--text-primary)',
                background: 'var(--bg-raised)',
                border: '1px solid var(--border-default)',
                borderRadius: 4,
                padding: '3px 8px',
                textAlign: 'center',
                display: 'inline-block',
              }}
            >
              {key}
            </span>
            <span
              style={{
                fontFamily: 'Inter',
                fontSize: 13,
                color: 'var(--text-secondary)',
              }}
            >
              {action}
            </span>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 24, display: 'flex', justifyContent: 'flex-end' }}>
        <button
          onClick={onClose}
          style={{
            padding: '7px 16px',
            background: 'var(--bg-raised)',
            border: '1px solid var(--border-default)',
            color: 'var(--text-primary)',
            fontFamily: 'Inter',
            fontSize: 13,
            borderRadius: 6,
            cursor: 'pointer',
            transition: 'border-color 120ms ease',
          }}
          onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--border-strong)')}
          onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--border-default)')}
        >
          Kapat
        </button>
      </div>
    </Modal>
  );
}
