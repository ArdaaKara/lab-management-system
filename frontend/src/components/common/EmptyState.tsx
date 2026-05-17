import { LucideIcon } from 'lucide-react'

export type EmptyStateProps = {
  icon: LucideIcon
  title: string
  description?: string
  action?: {
    label: string
    onClick: () => void
    variant?: 'primary' | 'secondary'
  }
  compact?: boolean
}

export default function EmptyState({ icon: Icon, title, description, action, compact = false }: EmptyStateProps) {
  const padding = compact ? 'var(--space-4)' : 'var(--space-6)'
  const iconSize = compact ? 24 : 40

  return (
    <div
      role="status"
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding,
        gap: 'var(--space-3)',
      }}
    >
      <Icon
        aria-hidden="true"
        size={iconSize}
        strokeWidth={1.5}
        style={{ color: 'var(--text-muted)', flexShrink: 0 }}
      />
      <span
        style={{
          fontFamily: 'var(--font-ui)',
          fontSize: 16,
          fontWeight: 500,
          color: 'var(--text-muted)',
        }}
      >
        {title}
      </span>
      {description && (
        <span
          style={{
            fontFamily: 'var(--font-ui)',
            fontSize: 14,
            color: 'var(--text-muted)',
            maxWidth: 320,
            textAlign: 'center',
          }}
        >
          {description}
        </span>
      )}
      {action && (
        <button
          onClick={action.onClick}
          style={{
            marginTop: 'var(--space-2)',
            background: action.variant === 'secondary' ? 'transparent' : 'var(--accent)',
            color: action.variant === 'secondary' ? 'var(--text-secondary)' : 'var(--accent-text)',
            border: action.variant === 'secondary' ? '1px solid var(--border-default)' : 'none',
            fontFamily: 'var(--font-ui)',
            fontWeight: 600,
            fontSize: 13,
            padding: '8px 16px',
            borderRadius: 'var(--radius-md)',
            cursor: 'pointer',
          }}
        >
          {action.label}
        </button>
      )}
    </div>
  )
}
