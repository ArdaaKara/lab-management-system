import { useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useUserMutations } from '@/hooks/useUsersQuery'

interface UserCreateModalProps {
  open: boolean
  onClose: () => void
}

interface FormValues {
  fullName: string
  email: string
  password: string
  role: 'ADMIN' | 'TEACHER' | 'TECHNICIAN'
}

const LABEL_STYLE: React.CSSProperties = {
  fontSize: 11,
  fontWeight: 600,
  letterSpacing: '0.08em',
  textTransform: 'uppercase',
  color: 'var(--text-muted)',
  fontFamily: 'var(--font-ui)',
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
  fontSize: 12,
  color: 'var(--color-danger)',
  fontFamily: 'var(--font-ui)',
  marginTop: 4,
}

export default function UserCreateModal({ open, onClose }: UserCreateModalProps) {
  const { create } = useUserMutations()

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: { fullName: '', email: '', password: '', role: 'TEACHER' },
    mode: 'onBlur',
  })

  useEffect(() => {
    if (!open) reset()
  }, [open, reset])

  if (!open) return null

  const onSubmit = (values: FormValues) => {
    create.mutate(
      {
        fullName: values.fullName,
        email: values.email,
        password: values.password,
        roleNames: [values.role],
      },
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
          maxWidth: 480,
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
          Yeni Kullanıcı
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label htmlFor="user-full-name" style={LABEL_STYLE}>Ad Soyad</label>
            <input
              id="user-full-name"
              autoComplete="name"
              style={INPUT_STYLE}
              placeholder="Ahmet Yılmaz"
              {...register('fullName', {
                required: 'Ad soyad zorunlu',
                minLength: { value: 2, message: 'En az 2 karakter' },
                maxLength: { value: 120, message: 'En fazla 120 karakter' },
              })}
            />
            {errors.fullName && <p style={ERROR_STYLE}>{errors.fullName.message}</p>}
          </div>

          <div>
            <label htmlFor="user-email" style={LABEL_STYLE}>E-posta</label>
            <input
              id="user-email"
              type="email"
              autoComplete="email"
              style={INPUT_STYLE}
              placeholder="kullanici@okul.k12.tr"
              {...register('email', {
                required: 'E-posta zorunlu',
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: 'Geçerli bir e-posta girin',
                },
              })}
            />
            {errors.email && <p style={ERROR_STYLE}>{errors.email.message}</p>}
          </div>

          <div>
            <label htmlFor="user-password" style={LABEL_STYLE}>Geçici Şifre</label>
            <input
              id="user-password"
              type="password"
              autoComplete="new-password"
              style={INPUT_STYLE}
              placeholder="En az 8 karakter"
              {...register('password', {
                required: 'Şifre zorunlu',
                minLength: { value: 8, message: 'En az 8 karakter' },
                maxLength: { value: 128, message: 'En fazla 128 karakter' },
              })}
            />
            {errors.password && <p style={ERROR_STYLE}>{errors.password.message}</p>}
          </div>

          <div>
            <label htmlFor="user-role" style={LABEL_STYLE}>Rol</label>
            <Controller
              name="role"
              control={control}
              rules={{ required: 'Rol seçimi zorunlu' }}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger
                    id="user-role"
                    style={{
                      background: 'var(--bg-raised)',
                      border: '1px solid var(--border-default)',
                      borderRadius: 'var(--radius-md)',
                      color: 'var(--text-primary)',
                      fontFamily: 'var(--font-ui)',
                      fontSize: 14,
                    }}
                  >
                    <SelectValue placeholder="Rol seçin" />
                  </SelectTrigger>
                  <SelectContent
                    style={{
                      background: 'var(--bg-surface)',
                      border: '1px solid var(--border-default)',
                      borderRadius: 'var(--radius-md)',
                    }}
                  >
                    <SelectItem value="ADMIN">Yönetici</SelectItem>
                    <SelectItem value="TEACHER">Öğretmen</SelectItem>
                    <SelectItem value="TECHNICIAN">Teknisyen</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
            {errors.role && <p style={ERROR_STYLE}>{errors.role.message}</p>}
          </div>

          <div style={{ display: 'flex', gap: 10, marginTop: 8, justifyContent: 'flex-end' }}>
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
