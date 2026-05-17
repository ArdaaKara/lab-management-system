import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import IssueStatusBadge from './IssueStatusBadge'
import { IssueResponse } from '@/types/issue.types'

const CATEGORY_LABELS: Record<string, string> = {
  NO_DISPLAY: 'Ekran Yok',
  NO_INTERNET: 'İnternet Yok',
  NO_POWER: 'Güç Yok',
  SLOW_PERFORMANCE: 'Yavaş Performans',
  PERIPHERAL_FAILURE: 'Çevre Birimi Arızası',
  OS_ERROR: 'İS Hatası',
  OTHER: 'Diğer',
}

interface IssueDetailDrawerProps {
  issue: IssueResponse | null
  open: boolean
  onClose: () => void
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <span
        style={{
          fontFamily: 'Inter',
          fontSize: 11,
          textTransform: 'uppercase',
          letterSpacing: '0.04em',
          color: '#6B6B80',
        }}
      >
        {label}
      </span>
      <span style={{ fontFamily: 'Inter', fontSize: 14, color: '#E8E8F0' }}>
        {value}
      </span>
    </div>
  )
}

export default function IssueDetailDrawer({ issue, open, onClose }: IssueDetailDrawerProps) {
  return (
    <Sheet open={open} onOpenChange={val => !val && onClose()}>
      <SheetContent
        style={{
          background: '#13131A',
          border: '1px solid #1E1E2E',
          color: '#E8E8F0',
          display: 'flex',
          flexDirection: 'column',
          gap: 20,
        }}
      >
        <SheetHeader>
          <SheetTitle
            style={{
              fontFamily: 'Inter',
              fontWeight: 600,
              letterSpacing: '-0.02em',
              color: '#E8E8F0',
            }}
          >
            Arıza Detayı
          </SheetTitle>
        </SheetHeader>

        {issue && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <Row
              label="Bilgisayar"
              value={
                <span style={{ fontFamily: 'JetBrains Mono' }}>{issue.computerName}</span>
              }
            />
            <Row label="Kategori" value={CATEGORY_LABELS[issue.category] ?? issue.category} />
            <Row label="Durum" value={<IssueStatusBadge status={issue.status} />} />
            <Row
              label="Öğrenci No"
              value={
                <span style={{ fontFamily: 'JetBrains Mono' }}>{issue.reporterStudentNo}</span>
              }
            />
            {issue.assignedTechnicianId && (
              <Row
                label="Teknisyen"
                value={
                  <span style={{ fontFamily: 'JetBrains Mono' }}>
                    {issue.assignedTechnicianId}
                  </span>
                }
              />
            )}
            {issue.description && (
              <Row label="Açıklama" value={issue.description} />
            )}
            <Row
              label="Oluşturulma"
              value={new Date(issue.createdAt).toLocaleString('tr-TR')}
            />
            {issue.resolvedAt && (
              <Row
                label="Çözülme"
                value={new Date(issue.resolvedAt).toLocaleString('tr-TR')}
              />
            )}
          </div>
        )}
      </SheetContent>
    </Sheet>
  )
}
