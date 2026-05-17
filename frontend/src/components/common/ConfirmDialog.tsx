import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

interface ConfirmDialogProps {
  open: boolean
  title: string
  message: string
  confirmLabel?: string
  cancelLabel?: string
  destructive?: boolean
  onConfirm: () => void
  onCancel: () => void
}

export default function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = 'Onayla',
  cancelLabel = 'İptal',
  destructive = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  return (
    <Dialog open={open} onOpenChange={val => !val && onCancel()}>
      <DialogContent
        style={{
          background: '#13131A',
          border: '1px solid #1E1E2E',
          color: '#E8E8F0',
          maxWidth: 400,
        }}
      >
        <DialogHeader>
          <DialogTitle
            style={{
              fontFamily: 'Inter',
              fontWeight: 600,
              letterSpacing: '-0.02em',
              color: '#E8E8F0',
            }}
          >
            {title}
          </DialogTitle>
        </DialogHeader>

        <p style={{ fontFamily: 'Inter', fontSize: 14, color: '#6B6B80', margin: 0 }}>
          {message}
        </p>

        <DialogFooter style={{ gap: 8 }}>
          <Button
            variant="ghost"
            style={{ color: '#6B6B80', fontFamily: 'Inter' }}
            onClick={onCancel}
          >
            {cancelLabel}
          </Button>
          <Button
            onClick={onConfirm}
            style={{
              background: destructive ? '#8B1A1A' : '#C9A84C',
              color: destructive ? '#E8E8F0' : '#0A0A0F',
              fontWeight: 600,
              fontFamily: 'Inter',
            }}
          >
            {confirmLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
