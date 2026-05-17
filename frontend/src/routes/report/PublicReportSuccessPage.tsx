import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { CheckCircle2 } from 'lucide-react'

interface LocationState {
  displayId?: string
}

export default function PublicReportSuccessPage() {
  const { computerId } = useParams<{ computerId: string }>()
  const navigate = useNavigate()
  const location = useLocation()
  const state = location.state as LocationState | null
  const displayId = state?.displayId

  const handleClose = () => {
    try {
      window.close()
      setTimeout(() => navigate('/'), 300)
    } catch {
      navigate('/')
    }
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#0A0A0F',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: 480,
          margin: '0 auto',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 16,
          textAlign: 'center',
        }}
      >
        <CheckCircle2 size={48} color="#52B788" aria-hidden="true" />

        <h1
          style={{
            fontFamily: 'Inter',
            fontWeight: 600,
            fontSize: 20,
            color: '#E8E8F0',
            margin: 0,
            letterSpacing: '-0.02em',
          }}
        >
          Bildiriminiz İletildi
        </h1>

        {displayId && (
          <p
            style={{
              fontFamily: "'JetBrains Mono', 'Fira Code', ui-monospace, monospace",
              fontSize: 14,
              color: '#A8B4C8',
              margin: 0,
            }}
          >
            {displayId} numaralı kayıt oluşturuldu.
          </p>
        )}

        <p
          style={{
            fontFamily: 'Inter',
            fontSize: 14,
            color: '#4A4A62',
            margin: 0,
            lineHeight: 1.5,
          }}
        >
          Öğretmen ve teknisyen ekibi en kısa sürede ilgilenecek. Bu sayfayı
          kapatabilirsiniz.
        </p>

        <div style={{ display: 'flex', gap: 12, marginTop: 8, width: '100%' }}>
          <button
            onClick={() => navigate(`/report/${computerId}`)}
            style={{
              flex: 1,
              padding: '11px 16px',
              borderRadius: 6,
              background: '#C9A84C',
              color: '#0A0A0F',
              fontWeight: 600,
              fontSize: 14,
              fontFamily: 'Inter',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            Yeni Bildirim Yap
          </button>
          <button
            onClick={handleClose}
            aria-label="Sekmeyi kapat"
            style={{
              flex: 1,
              padding: '11px 16px',
              borderRadius: 6,
              background: 'transparent',
              color: '#8888A8',
              fontWeight: 500,
              fontSize: 14,
              fontFamily: 'Inter',
              border: '1px solid #2A2A3E',
              cursor: 'pointer',
            }}
          >
            Kapat
          </button>
        </div>
      </div>
    </div>
  )
}
