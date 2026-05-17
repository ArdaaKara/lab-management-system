import { Badge } from '@/components/ui/badge'
import { IssueStatus } from '@/types/issue.types'

interface IssueStatusBadgeProps {
  status: IssueStatus
}

const STATUS_CONFIG: Record<
  IssueStatus,
  { background: string; color: string; border: string; label: string }
> = {
  OPEN: {
    background: '#1A3A5C33',
    color: '#4A9EDB',
    border: '1px solid #1A3A5C',
    label: 'Açık',
  },
  IN_PROGRESS: {
    background: '#7A5C0033',
    color: '#C9A84C',
    border: '1px solid #7A5C00',
    label: 'İşlemde',
  },
  PENDING_APPROVAL: {
    background: '#5C3A1A33',
    color: '#E8935A',
    border: '1px solid #5C3A1A',
    label: 'Onay Bekliyor',
  },
  RESOLVED: {
    background: '#2D6A4F33',
    color: '#4CAF82',
    border: '1px solid #2D6A4F',
    label: 'Çözüldü',
  },
  REJECTED: {
    background: '#8B1A1A33',
    color: '#E05555',
    border: '1px solid #8B1A1A',
    label: 'Reddedildi',
  },
}

export default function IssueStatusBadge({ status }: IssueStatusBadgeProps) {
  const config = STATUS_CONFIG[status]

  return (
    <Badge
      style={{
        background: config.background,
        color: config.color,
        border: config.border,
        fontFamily: 'Inter',
        fontSize: 11,
        fontWeight: 500,
        letterSpacing: '0.04em',
        textTransform: 'uppercase',
        padding: '2px 8px',
        borderRadius: 4,
      }}
    >
      {config.label}
    </Badge>
  )
}
