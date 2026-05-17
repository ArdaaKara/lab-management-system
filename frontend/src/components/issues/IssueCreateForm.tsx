import { useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import Modal from '@/components/common/Modal'
import { useComputersQuery } from '@/hooks/useComputersQuery'
import { useIssueCreate } from '@/hooks/mutations/useIssueCreate'
import {
  issueCreateSchema,
  ISSUE_CATEGORIES,
  IssueCreateFormValues,
} from '@/validation/issueCreate.schema'

const CATEGORY_LABELS: Record<string, string> = {
  NO_DISPLAY: 'Ekran Yok',
  NO_INTERNET: 'İnternet Yok',
  NO_POWER: 'Güç Yok',
  SLOW_PERFORMANCE: 'Yavaş Performans',
  PERIPHERAL_FAILURE: 'Çevre Birimi Arızası',
  OS_ERROR: 'İS Hatası',
  OTHER: 'Diğer',
}

const LABEL_STYLE: React.CSSProperties = {
  fontFamily: 'Inter',
  fontSize: 11,
  textTransform: 'uppercase',
  letterSpacing: '0.06em',
  color: '#6B6B80',
  marginBottom: 6,
  display: 'block',
}

const INPUT_STYLE: React.CSSProperties = {
  width: '100%',
  background: '#0A0A0F',
  border: '1px solid #1E1E2E',
  color: '#E8E8F0',
  padding: '8px 12px',
  borderRadius: 6,
  fontFamily: 'Inter',
  fontSize: 13,
  outline: 'none',
  boxSizing: 'border-box',
}

const ERROR_STYLE: React.CSSProperties = {
  fontFamily: 'Inter',
  fontSize: 11,
  color: '#E05555',
  marginTop: 4,
}

interface IssueCreateFormProps {
  open: boolean
  onClose: () => void
  labId: string
  computerId?: string
  onSuccess?: () => void
}

export default function IssueCreateForm({ open, onClose, labId, computerId, onSuccess }: IssueCreateFormProps) {
  const { data: computers = [] } = useComputersQuery(labId)
  const mutation = useIssueCreate(labId)

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<IssueCreateFormValues>({
    resolver: zodResolver(issueCreateSchema),
    defaultValues: {
      computerId: computerId ?? '',
      studentIdReporter: '',
      description: '',
    },
  })

  useEffect(() => {
    if (open) {
      reset({ computerId: computerId ?? '', studentIdReporter: '', description: '' })
    } else {
      reset({ computerId: '', studentIdReporter: '', description: '' })
    }
  }, [open, computerId, reset])

  const onSubmit = (values: IssueCreateFormValues) => {
    mutation.mutate(values, {
      onSuccess: () => {
        reset()
        onClose()
        onSuccess?.()
      },
    })
  }

  return (
    <Modal open={open} onClose={onClose}>
      <DialogHeader style={{ marginBottom: 20 }}>
        <DialogTitle
          style={{
            fontFamily: 'Inter',
            fontWeight: 600,
            letterSpacing: '-0.02em',
            color: '#E8E8F0',
          }}
        >
          Yeni Arıza Bildirimi
        </DialogTitle>
        <DialogDescription className="sr-only">
          Arıza bildirimi oluşturma formu
        </DialogDescription>
      </DialogHeader>

      <form
        onSubmit={handleSubmit(onSubmit)}
        style={{ display: 'flex', flexDirection: 'column', gap: 20 }}
      >
        {/* Bilgisayar */}
        <div>
          <label style={LABEL_STYLE}>Bilgisayar</label>
          <select
            {...register('computerId')}
            disabled={!!computerId}
            style={{ ...INPUT_STYLE, cursor: computerId ? 'default' : 'pointer', opacity: computerId ? 0.7 : 1 }}
          >
            <option value="">Seçiniz...</option>
            {computers.map(c => (
              <option key={c.id} value={c.id}>
                {c.assetTag}
              </option>
            ))}
          </select>
          {errors.computerId && (
            <p style={ERROR_STYLE}>{errors.computerId.message}</p>
          )}
        </div>

        {/* Kategori */}
        <div>
          <label style={LABEL_STYLE}>Kategori</label>
          <Controller
            name="category"
            control={control}
            render={({ field }) => (
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: 8,
                }}
                role="radiogroup"
                aria-label="Arıza kategorisi"
              >
                {ISSUE_CATEGORIES.map(cat => (
                  <div
                    key={cat}
                    role="radio"
                    aria-checked={field.value === cat}
                    tabIndex={0}
                    onClick={() => field.onChange(cat)}
                    onKeyDown={e =>
                      (e.key === 'Enter' || e.key === ' ') && field.onChange(cat)
                    }
                    style={{
                      background: field.value === cat ? '#C9A84C11' : '#0A0A0F',
                      border: `1px solid ${field.value === cat ? '#C9A84C' : '#1E1E2E'}`,
                      borderRadius: 6,
                      padding: '8px 12px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      transition: 'border-color 120ms, background 120ms',
                    }}
                  >
                    <div
                      style={{
                        width: 12,
                        height: 12,
                        borderRadius: '50%',
                        border: `2px solid ${field.value === cat ? '#C9A84C' : '#3A3A4A'}`,
                        background: field.value === cat ? '#C9A84C' : 'transparent',
                        flexShrink: 0,
                      }}
                    />
                    <span
                      style={{
                        fontFamily: 'Inter',
                        fontSize: 12,
                        color: field.value === cat ? '#E8E8F0' : '#6B6B80',
                      }}
                    >
                      {CATEGORY_LABELS[cat]}
                    </span>
                  </div>
                ))}
              </div>
            )}
          />
          {errors.category && (
            <p style={ERROR_STYLE}>{errors.category.message}</p>
          )}
        </div>

        {/* Öğrenci Numarası */}
        <div>
          <label style={LABEL_STYLE}>Öğrenci Numarası</label>
          <input
            {...register('studentIdReporter')}
            type="text"
            inputMode="numeric"
            placeholder="örn. 20210001"
            style={INPUT_STYLE}
            onFocus={e => (e.target.style.borderColor = '#C9A84C')}
            onBlur={e => (e.target.style.borderColor = '#1E1E2E')}
          />
          {errors.studentIdReporter && (
            <p style={ERROR_STYLE}>{errors.studentIdReporter.message}</p>
          )}
        </div>

        {/* Açıklama */}
        <div>
          <label style={LABEL_STYLE}>Açıklama (opsiyonel)</label>
          <textarea
            {...register('description')}
            rows={3}
            maxLength={500}
            placeholder="Sorunu kısaca açıklayın"
            style={{ ...INPUT_STYLE, resize: 'none' }}
            onFocus={e => (e.target.style.borderColor = '#C9A84C')}
            onBlur={e => (e.target.style.borderColor = '#1E1E2E')}
          />
          {errors.description && (
            <p style={ERROR_STYLE}>{errors.description.message}</p>
          )}
        </div>

        <DialogFooter style={{ gap: 8, paddingTop: 4 }}>
          <button
            type="button"
            onClick={onClose}
            disabled={mutation.isPending}
            style={{
              background: 'transparent',
              border: '1px solid #1E1E2E',
              color: '#6B6B80',
              fontFamily: 'Inter',
              fontSize: 13,
              padding: '8px 20px',
              borderRadius: 6,
              cursor: 'pointer',
            }}
          >
            İptal
          </button>
          <button
            type="submit"
            disabled={mutation.isPending}
            style={{
              background: '#C9A84C',
              border: 'none',
              color: '#0A0A0F',
              fontFamily: 'Inter',
              fontWeight: 600,
              fontSize: 13,
              padding: '8px 20px',
              borderRadius: 6,
              cursor: mutation.isPending ? 'not-allowed' : 'pointer',
              opacity: mutation.isPending ? 0.7 : 1,
              display: 'flex',
              alignItems: 'center',
              gap: 6,
            }}
          >
            {mutation.isPending && (
              <span
                style={{
                  width: 12,
                  height: 12,
                  border: '2px solid #0A0A0F44',
                  borderTop: '2px solid #0A0A0F',
                  borderRadius: '50%',
                  display: 'inline-block',
                  animation: 'spin 0.7s linear infinite',
                }}
              />
            )}
            {mutation.isPending ? 'Gönderiliyor...' : 'Bildir'}
          </button>
        </DialogFooter>
      </form>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </Modal>
  )
}
