import { useForm, SubmitHandler } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { changePassword } from '@/services/authService'
import useAuthStore from '@/stores/useAuthStore'
import { useAuth } from '@/hooks/useAuth'

interface FormValues {
  oldPassword: string
  newPassword: string
  confirmPassword: string
}

const INPUT_BASE: React.CSSProperties = {
  width: '100%',
  background: 'var(--bg-base)',
  border: '1px solid var(--border-subtle)',
  color: 'var(--text-primary)',
  padding: '10px 14px',
  borderRadius: 'var(--radius-md)',
  fontFamily: 'Inter',
  fontSize: 14,
  outline: 'none',
  boxSizing: 'border-box',
}

const LABEL_STYLE: React.CSSProperties = {
  fontFamily: 'Inter',
  fontSize: 12,
  textTransform: 'uppercase',
  letterSpacing: '0.04em',
  color: 'var(--text-secondary)',
  marginBottom: 6,
  display: 'block',
}

function fieldStyle(hasError: boolean): React.CSSProperties {
  return {
    ...INPUT_BASE,
    borderColor: hasError ? 'var(--status-faulty)' : 'var(--border-subtle)',
  }
}

export default function ChangePasswordPage() {
  const navigate = useNavigate()
  const { isAdmin, isTeacher } = useAuth()
  const clearMustChangePassword = useAuthStore(s => s.clearMustChangePassword)

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ mode: 'onBlur' })

  const newPasswordValue = watch('newPassword')

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    try {
      await changePassword(data.oldPassword, data.newPassword)
      clearMustChangePassword()
      toast.success('Şifreniz güncellendi')
      if (isAdmin) navigate('/dashboard', { replace: true })
      else if (isTeacher) navigate('/grid', { replace: true })
      else navigate('/issues', { replace: true })
    } catch {
      toast.error('Şifre değiştirilemedi, mevcut şifrenizi kontrol edin')
    }
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'var(--bg-base)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
      }}
    >
      <div
        style={{
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 12,
          padding: 32,
          width: '100%',
          maxWidth: 400,
          boxSizing: 'border-box',
        }}
      >
        <p
          style={{
            fontFamily: 'JetBrains Mono',
            fontSize: 18,
            fontWeight: 500,
            color: 'var(--accent)',
            margin: '0 0 4px 0',
          }}
        >
          CLMS
        </p>
        <h1
          style={{
            fontFamily: 'Inter',
            fontWeight: 600,
            letterSpacing: '-0.02em',
            fontSize: 20,
            color: 'var(--text-primary)',
            margin: '0 0 8px 0',
          }}
        >
          Şifre Değiştir
        </h1>
        <p
          style={{
            fontFamily: 'Inter',
            fontSize: 13,
            color: 'var(--text-secondary)',
            margin: '0 0 24px 0',
          }}
        >
          İlk girişiniz için şifrenizi güncellemeniz gerekmektedir.
        </p>

        <form
          onSubmit={handleSubmit(onSubmit)}
          style={{ display: 'flex', flexDirection: 'column', gap: 18 }}
          noValidate
        >
          {/* Mevcut Şifre */}
          <div>
            <label htmlFor="oldPassword" style={LABEL_STYLE}>
              Mevcut Şifre
            </label>
            <input
              id="oldPassword"
              type="password"
              autoComplete="current-password"
              aria-describedby={errors.oldPassword ? 'oldPassword-error' : undefined}
              style={fieldStyle(!!errors.oldPassword)}
              onFocus={e => (e.target.style.borderColor = 'var(--accent)')}
              {...register('oldPassword', { required: 'Mevcut şifre zorunludur' })}
            />
            {errors.oldPassword && (
              <p
                id="oldPassword-error"
                role="alert"
                style={{ color: 'var(--color-danger)', fontSize: 12, marginTop: 4, fontFamily: 'Inter' }}
              >
                {errors.oldPassword.message}
              </p>
            )}
          </div>

          {/* Yeni Şifre */}
          <div>
            <label htmlFor="newPassword" style={LABEL_STYLE}>
              Yeni Şifre
            </label>
            <input
              id="newPassword"
              type="password"
              autoComplete="new-password"
              aria-describedby={errors.newPassword ? 'newPassword-error' : undefined}
              style={fieldStyle(!!errors.newPassword)}
              onFocus={e => (e.target.style.borderColor = 'var(--accent)')}
              {...register('newPassword', {
                required: 'Yeni şifre zorunludur',
                minLength: { value: 8, message: 'En az 8 karakter giriniz' },
              })}
            />
            {errors.newPassword && (
              <p
                id="newPassword-error"
                role="alert"
                style={{ color: 'var(--color-danger)', fontSize: 12, marginTop: 4, fontFamily: 'Inter' }}
              >
                {errors.newPassword.message}
              </p>
            )}
          </div>

          {/* Yeni Şifre (Tekrar) */}
          <div>
            <label htmlFor="confirmPassword" style={LABEL_STYLE}>
              Yeni Şifre (Tekrar)
            </label>
            <input
              id="confirmPassword"
              type="password"
              autoComplete="new-password"
              aria-describedby={errors.confirmPassword ? 'confirmPassword-error' : undefined}
              style={fieldStyle(!!errors.confirmPassword)}
              onFocus={e => (e.target.style.borderColor = 'var(--accent)')}
              {...register('confirmPassword', {
                required: 'Şifre tekrarı zorunludur',
                validate: v => v === newPasswordValue || 'Şifreler eşleşmiyor',
              })}
            />
            {errors.confirmPassword && (
              <p
                id="confirmPassword-error"
                role="alert"
                style={{ color: 'var(--color-danger)', fontSize: 12, marginTop: 4, fontFamily: 'Inter' }}
              >
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            style={{
              width: '100%',
              padding: 12,
              borderRadius: 'var(--radius-md)',
              background: 'var(--accent)',
              color: 'var(--accent-text)',
              fontWeight: 600,
              fontSize: 14,
              fontFamily: 'Inter',
              border: 'none',
              cursor: isSubmitting ? 'not-allowed' : 'pointer',
              opacity: isSubmitting ? 0.7 : 1,
              transition: 'opacity 120ms',
            }}
          >
            {isSubmitting ? 'Kaydediliyor...' : 'Şifreyi Değiştir'}
          </button>
        </form>
      </div>
    </div>
  )
}
