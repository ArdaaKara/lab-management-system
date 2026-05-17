import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { Clock } from 'lucide-react'

type IssueCategory = 'HARDWARE' | 'SOFTWARE' | 'NETWORK' | 'PERIPHERAL' | 'OTHER'

const CATEGORY_OPTIONS: { value: IssueCategory; label: string }[] = [
  { value: 'HARDWARE', label: 'Donanım' },
  { value: 'SOFTWARE', label: 'Yazılım' },
  { value: 'NETWORK', label: 'Ağ / İnternet' },
  { value: 'PERIPHERAL', label: 'Çevre Birimi' },
  { value: 'OTHER', label: 'Diğer' },
]

interface ComputerInfo {
  id: string
  hostname: string
  lab: { code: string; name: string }
}

const INPUT_STYLE: React.CSSProperties = {
  width: '100%',
  background: '#0A0A0F',
  border: '1px solid #1E1E2E',
  color: '#E8E8F0',
  padding: '10px 14px',
  borderRadius: 6,
  fontFamily: 'Inter',
  fontSize: 16,
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

export default function PublicReportPage() {
  const { computerId } = useParams<{ computerId: string }>()
  const navigate = useNavigate()

  const [computerInfo, setComputerInfo] = useState<ComputerInfo | null>(null)
  const [computerError, setComputerError] = useState<'404' | '410' | 'error' | null>(null)
  const [isLoadingComputer, setIsLoadingComputer] = useState(true)

  const [category, setCategory] = useState<IssueCategory | ''>('')
  const [studentNo, setStudentNo] = useState('')
  const [studentName, setStudentName] = useState('')
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const [rateLimitState, setRateLimitState] = useState<{
    active: boolean
    secondsLeft: number
  }>({ active: false, secondsLeft: 0 })

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    if (!computerId) return
    axios
      .get(`${import.meta.env.VITE_API_BASE_URL}/public/computers/${computerId}`)
      .then(res => setComputerInfo(res.data))
      .catch(err => {
        if (axios.isAxiosError(err)) {
          if (err.response?.status === 404) setComputerError('404')
          else if (err.response?.status === 410) setComputerError('410')
          else setComputerError('error')
        } else {
          setComputerError('error')
        }
      })
      .finally(() => setIsLoadingComputer(false))
  }, [computerId])

  useEffect(() => {
    if (!rateLimitState.active) return

    intervalRef.current = setInterval(() => {
      setRateLimitState(prev => {
        if (prev.secondsLeft <= 1) {
          if (intervalRef.current) {
            clearInterval(intervalRef.current)
            intervalRef.current = null
          }
          return { active: false, secondsLeft: 0 }
        }
        return { ...prev, secondsLeft: prev.secondsLeft - 1 }
      })
    }, 1000)

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }
  }, [rateLimitState.active])

  const validate = (): boolean => {
    if (!category) {
      setError('Sorun türü seçimi zorunludur')
      return false
    }
    if (!studentNo) {
      setError('Öğrenci numarası zorunludur')
      return false
    }
    if (!/^\d{5,15}$/.test(studentNo)) {
      setError('Geçerli bir öğrenci numarası girin (5-15 rakam)')
      return false
    }
    if (!studentName.trim()) {
      setError('Ad Soyad zorunludur')
      return false
    }
    if (studentName.trim().length < 2 || studentName.trim().length > 100) {
      setError('Ad Soyad 2-100 karakter arasında olmalı')
      return false
    }
    if (!title.trim()) {
      setError('Sorun başlığı zorunludur')
      return false
    }
    if (title.trim().length < 5 || title.trim().length > 200) {
      setError('Sorun başlığı 5-200 karakter arasında olmalı')
      return false
    }
    if (!description.trim()) {
      setError('Detay açıklama zorunludur')
      return false
    }
    if (description.trim().length < 10 || description.trim().length > 2000) {
      setError('Detay 10-2000 karakter arasında olmalı')
      return false
    }
    return true
  }

  const handleSubmit = async () => {
    setError('')
    if (!validate()) return

    setIsLoading(true)
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/public/issues`,
        {
          computerId,
          studentNo,
          studentName: studentName.trim(),
          title: title.trim(),
          description: description.trim(),
          category,
        },
      )
      navigate(`/report/${computerId}/success`, {
        state: { displayId: res.data.displayId },
      })
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response?.status === 429) {
        const retryAfter: number = err.response.data?.retryAfterSeconds ?? 60
        setRateLimitState({ active: true, secondsLeft: retryAfter })
      } else {
        setError('Bir hata oluştu. Lütfen tekrar deneyin.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoadingComputer) {
    return (
      <div
        style={{
          minHeight: '100vh',
          background: '#0A0A0F',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            width: 32,
            height: 32,
            border: '3px solid #1E1E2E',
            borderTopColor: '#C9A84C',
            borderRadius: '50%',
            animation: 'spin 0.7s linear infinite',
          }}
        />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    )
  }

  if (computerError) {
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
        <p
          style={{
            fontFamily: 'Inter',
            fontSize: 15,
            color: '#6B6B80',
            textAlign: 'center',
            padding: 24,
          }}
        >
          {computerError === '410'
            ? 'Bu bilgisayar artık hizmet dışıdır.'
            : 'Bu bilgisayar sisteme kayıtlı değil.'}
        </p>
      </div>
    )
  }

  if (rateLimitState.active) {
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
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 16,
            maxWidth: 480,
            width: '100%',
            textAlign: 'center',
          }}
        >
          <Clock size={32} color="#E07070" aria-hidden="true" />
          <h2
            style={{
              fontFamily: 'Inter',
              fontWeight: 600,
              fontSize: 18,
              color: '#E8E8F0',
              margin: 0,
            }}
          >
            Çok sık deniyorsunuz
          </h2>
          <p
            style={{
              fontFamily: 'Inter',
              fontSize: 14,
              color: '#8888A8',
              margin: 0,
            }}
          >
            {rateLimitState.secondsLeft > 0
              ? `${rateLimitState.secondsLeft} saniye sonra tekrar deneyin.`
              : 'Şimdi tekrar deneyebilirsiniz.'}
          </p>
          <button
            onClick={() => window.history.back()}
            style={{
              background: 'transparent',
              border: '1px solid #2A2A3E',
              color: '#8888A8',
              fontFamily: 'Inter',
              fontSize: 14,
              padding: '10px 24px',
              borderRadius: 6,
              cursor: 'pointer',
            }}
          >
            Geri Dön
          </button>
        </div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0A0A0F', display: 'flex', flexDirection: 'column' }}>
      <div
        style={{
          position: 'sticky',
          top: 0,
          background: '#13131A',
          borderBottom: '1px solid #1E1E2E',
          padding: '12px 16px',
          zIndex: 10,
        }}
      >
        <p style={{ fontFamily: 'JetBrains Mono', fontSize: 13, color: '#6B6B80', margin: 0 }}>
          {computerInfo?.lab.code} · {computerInfo?.hostname}
        </p>
      </div>

      <div style={{ flex: 1, display: 'flex', justifyContent: 'center', padding: '24px 16px 96px' }}>
        <div style={{ width: '100%', maxWidth: 480 }}>
          <h1
            style={{
              fontFamily: 'Inter',
              fontWeight: 600,
              letterSpacing: '-0.02em',
              fontSize: 22,
              color: '#E8E8F0',
              margin: '0 0 24px 0',
            }}
          >
            Arıza Bildir
          </h1>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {/* Sorun Türü */}
            <div>
              <label style={LABEL_STYLE}>Sorun Türü</label>
              <div role="radiogroup" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {CATEGORY_OPTIONS.map(opt => (
                  <div
                    key={opt.value}
                    role="radio"
                    aria-checked={category === opt.value}
                    tabIndex={0}
                    onClick={() => setCategory(opt.value)}
                    onKeyDown={e => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault()
                        setCategory(opt.value)
                      }
                    }}
                    style={{
                      background: category === opt.value ? 'rgba(201, 168, 76, 0.07)' : '#0A0A0F',
                      border: `1px solid ${category === opt.value ? '#C9A84C' : '#1E1E2E'}`,
                      borderRadius: 6,
                      padding: '12px 14px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 10,
                    }}
                  >
                    <div
                      style={{
                        width: 14,
                        height: 14,
                        borderRadius: '50%',
                        border: `2px solid ${category === opt.value ? '#C9A84C' : '#3A3A52'}`,
                        background: category === opt.value ? '#C9A84C' : 'transparent',
                        flexShrink: 0,
                      }}
                    />
                    <span
                      style={{
                        fontFamily: 'Inter',
                        fontSize: 15,
                        color: category === opt.value ? '#E8E8F0' : '#8888A8',
                      }}
                    >
                      {opt.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Öğrenci Numarası */}
            <div>
              <label style={LABEL_STYLE}>Öğrenci Numarası</label>
              <input
                type="text"
                inputMode="numeric"
                value={studentNo}
                onChange={e => setStudentNo(e.target.value)}
                style={INPUT_STYLE}
                onFocus={e => (e.target.style.borderColor = '#C9A84C')}
                onBlur={e => (e.target.style.borderColor = '#1E1E2E')}
                placeholder="Örn: 2021001"
              />
            </div>

            {/* Ad Soyad */}
            <div>
              <label style={LABEL_STYLE}>Ad Soyad</label>
              <input
                type="text"
                value={studentName}
                onChange={e => setStudentName(e.target.value)}
                style={INPUT_STYLE}
                onFocus={e => (e.target.style.borderColor = '#C9A84C')}
                onBlur={e => (e.target.style.borderColor = '#1E1E2E')}
                placeholder="Mehmet Demir"
              />
            </div>

            {/* Sorun Başlığı */}
            <div>
              <label style={LABEL_STYLE}>Sorun Başlığı</label>
              <input
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                style={INPUT_STYLE}
                onFocus={e => (e.target.style.borderColor = '#C9A84C')}
                onBlur={e => (e.target.style.borderColor = '#1E1E2E')}
                placeholder="Örn: Klavye çalışmıyor"
              />
            </div>

            {/* Detay */}
            <div>
              <label style={LABEL_STYLE}>Detay</label>
              <textarea
                rows={4}
                maxLength={2000}
                value={description}
                onChange={e => setDescription(e.target.value)}
                style={{ ...INPUT_STYLE, resize: 'none' }}
                onFocus={e => (e.target.style.borderColor = '#C9A84C')}
                onBlur={e => (e.target.style.borderColor = '#1E1E2E')}
                placeholder="Ne oluyor, ne yapınca oluyor?"
              />
              <p
                style={{
                  color: '#6B6B80',
                  fontSize: 11,
                  textAlign: 'right',
                  margin: '4px 0 0 0',
                  fontFamily: 'Inter',
                }}
              >
                {description.length}/2000
              </p>
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
          </div>
        </div>
      </div>

      <div
        style={{
          position: 'sticky',
          bottom: 0,
          background: '#0A0A0F',
          borderTop: '1px solid #1E1E2E',
          padding: 16,
        }}
      >
        <div style={{ maxWidth: 480, margin: '0 auto' }}>
          <button
            onClick={handleSubmit}
            disabled={isLoading}
            style={{
              width: '100%',
              padding: 14,
              borderRadius: 6,
              background: '#C9A84C',
              color: '#0A0A0F',
              fontWeight: 600,
              fontSize: 15,
              fontFamily: 'Inter',
              border: 'none',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              opacity: isLoading ? 0.7 : 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              transition: 'opacity 120ms',
            }}
          >
            {isLoading && (
              <span
                style={{
                  width: 14,
                  height: 14,
                  border: '2px solid rgba(10,10,15,0.3)',
                  borderTop: '2px solid #0A0A0F',
                  borderRadius: '50%',
                  display: 'inline-block',
                  animation: 'spin 0.7s linear infinite',
                }}
              />
            )}
            {isLoading ? 'Gönderiliyor...' : 'Arıza Bildir'}
          </button>
        </div>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}
