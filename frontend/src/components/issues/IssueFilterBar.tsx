import { IssueStatus, IssueCategory } from '@/types/issue.types'

const SELECT_STYLE: React.CSSProperties = {
  background: '#13131A',
  border: '1px solid #1E1E2E',
  color: '#E8E8F0',
  padding: '6px 12px',
  borderRadius: 6,
  fontFamily: 'Inter',
  fontSize: 13,
  cursor: 'pointer',
  outline: 'none',
}

interface IssueFilterBarProps {
  statusFilter: IssueStatus | 'ALL'
  categoryFilter: IssueCategory | 'ALL'
  onStatusChange: (value: IssueStatus | 'ALL') => void
  onCategoryChange: (value: IssueCategory | 'ALL') => void
}

export default function IssueFilterBar({
  statusFilter,
  categoryFilter,
  onStatusChange,
  onCategoryChange,
}: IssueFilterBarProps) {
  return (
    <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
      <select
        style={SELECT_STYLE}
        value={statusFilter}
        onChange={e => onStatusChange(e.target.value as IssueStatus | 'ALL')}
      >
        <option value="ALL">Tüm Durumlar</option>
        <option value="OPEN">Açık</option>
        <option value="IN_PROGRESS">İşlemde</option>
        <option value="PENDING_APPROVAL">Onay Bekliyor</option>
        <option value="RESOLVED">Çözüldü</option>
        <option value="REJECTED">Reddedildi</option>
      </select>

      <select
        style={SELECT_STYLE}
        value={categoryFilter}
        onChange={e => onCategoryChange(e.target.value as IssueCategory | 'ALL')}
      >
        <option value="ALL">Tüm Kategoriler</option>
        <option value="NO_DISPLAY">Ekran Yok</option>
        <option value="NO_INTERNET">İnternet Yok</option>
        <option value="NO_POWER">Güç Yok</option>
        <option value="SLOW_PERFORMANCE">Yavaş Performans</option>
        <option value="PERIPHERAL_FAILURE">Çevre Birimi Arızası</option>
        <option value="OS_ERROR">İS Hatası</option>
        <option value="OTHER">Diğer</option>
      </select>
    </div>
  )
}
