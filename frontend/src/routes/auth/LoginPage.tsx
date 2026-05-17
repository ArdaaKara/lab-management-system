import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { login } from '@/services/authService'
import useAuthStore from '@/stores/useAuthStore'
import { REFRESH_TOKEN_KEY } from '@/lib/constants'

const INPUT_STYLE: React.CSSProperties = {
  width: '100%',
  background: '#0A0A0F',
  border: '1px solid #1E1E2E',
  color: '#E8E8F0',
  padding: '10px 14px',
  borderRadius: 6,
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
  color: '#6B6B80',
  marginBottom: 6,
  display: 'block',
}

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const navigate = useNavigate()
  const storeLogin = useAuthStore(state => state.login)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!email.trim() || !password) {
      setError('E-posta ve şifre zorunludur')
      return
    }

    setIsLoading(true)
    try {
      // ADR-002: access token → memory (useAuthStore), refresh token → localStorage
      const response = await login({ email: email.trim(), password })
      console.log('token:', response.accessToken)
      localStorage.setItem(REFRESH_TOKEN_KEY, response.refreshToken)
      storeLogin(response)
      console.log('store token:', useAuthStore.getState().accessToken)
      navigate('/dashboard', { replace: true })
    } catch {
      setError('Kullanıcı adı veya şifre hatalı.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#0A0A0F',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
      }}
    >
      <div
        style={{
          background: '#13131A',
          border: '1px solid #1E1E2E',
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
            color: '#C9A84C',
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
            color: '#E8E8F0',
            margin: '0 0 28px 0',
          }}
        >
          Giriş Yap
        </h1>

        <form
          onSubmit={handleSubmit}
          style={{ display: 'flex', flexDirection: 'column', gap: 20 }}
        >
          <div>
            <label style={LABEL_STYLE}>E-posta</label>
            <input
              type="email"
              autoComplete="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              style={INPUT_STYLE}
              onFocus={e => (e.target.style.borderColor = '#C9A84C')}
              onBlur={e => (e.target.style.borderColor = '#1E1E2E')}
            />
          </div>

          <div>
            <label style={LABEL_STYLE}>Şifre</label>
            <input
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              style={INPUT_STYLE}
              onFocus={e => (e.target.style.borderColor = '#C9A84C')}
              onBlur={e => (e.target.style.borderColor = '#1E1E2E')}
            />
          </div>

          {error && (
            <div
              style={{
                background: '#8B1A1A22',
                border: '1px solid #8B1A1A',
                borderRadius: 6,
                padding: '10px 14px',
                color: '#E05555',
                fontSize: 13,
                fontFamily: 'Inter',
              }}
            >
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            style={{
              width: '100%',
              padding: 12,
              borderRadius: 6,
              background: '#C9A84C',
              color: '#0A0A0F',
              fontWeight: 600,
              fontSize: 14,
              fontFamily: 'Inter',
              border: 'none',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              opacity: isLoading ? 0.7 : 1,
              transition: 'opacity 120ms',
            }}
          >
            {isLoading ? 'Giriş yapılıyor...' : 'Giriş Yap'}
          </button>
        </form>
      </div>
    </div>
  )
}
