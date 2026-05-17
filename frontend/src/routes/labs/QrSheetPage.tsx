import { useParams, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { QRCodeSVG } from 'qrcode.react'
import { useLabDetailQuery } from '@/hooks/useLabsQuery'
import { getComputerListByLab } from '@/services/computerService'
import LoadingSpinner from '@/components/common/LoadingSpinner'
import type { ComputerResponse } from '@/types/computer.types'

const PRINT_STYLES = `
  @media print {
    .no-print { display: none !important; }
    body { background: white !important; }
    @page { margin: 10mm; }
    .qr-grid {
      display: grid !important;
      grid-template-columns: repeat(4, 1fr) !important;
    }
    .qr-card {
      page-break-inside: avoid;
      break-inside: avoid;
      border: 1px solid #ccc !important;
      background: white !important;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
  }
`

function QrCard({
  computer,
  labRoomNumber,
}: {
  computer: ComputerResponse
  labRoomNumber: string
}) {
  const qrUrl = `${window.location.origin}/report/${computer.id}`
  const position =
    computer.gridRow != null && computer.gridCol != null
      ? `Sıra ${computer.gridRow + 1}, Kolon ${computer.gridCol + 1}`
      : 'Envanter'

  return (
    <div
      className="qr-card"
      style={{
        background: 'var(--bg-surface)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-lg)',
        padding: 16,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 10,
        textAlign: 'center',
      }}
    >
      <QRCodeSVG value={qrUrl} size={120} />

      <div style={{ width: '100%' }}>
        <p
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 13,
            fontWeight: 700,
            color: 'var(--text-primary)',
            margin: '0 0 2px 0',
            wordBreak: 'break-all',
          }}
        >
          {computer.hostname ?? computer.assetTag}
        </p>
        <p
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 11,
            color: 'var(--text-muted)',
            margin: '0 0 4px 0',
          }}
        >
          {labRoomNumber}
        </p>
        <p
          style={{
            fontFamily: 'var(--font-ui)',
            fontSize: 11,
            color: 'var(--text-secondary)',
            margin: '0 0 8px 0',
          }}
        >
          {position}
        </p>
        <p
          style={{
            fontFamily: 'var(--font-ui)',
            fontSize: 10,
            color: 'var(--text-muted)',
            margin: 0,
            lineHeight: 1.4,
          }}
        >
          Arıza bildirmek
          <br />
          için QR okutun
        </p>
      </div>
    </div>
  )
}

export default function QrSheetPage() {
  const { labId } = useParams<{ labId: string }>()
  const navigate = useNavigate()

  const { data: lab, isLoading: labLoading, isError: labError } = useLabDetailQuery(labId ?? null)

  const { data: allComputers = [], isLoading: computersLoading } = useQuery({
    queryKey: ['computers', labId, 'list'],
    queryFn: () => getComputerListByLab(labId!),
    enabled: !!labId,
    staleTime: 60_000,
  })

  const computers = allComputers.filter(c => c.status !== 'DECOMMISSIONED')

  const isLoading = labLoading || computersLoading
  const isError = labError

  if (isLoading) {
    return (
      <div
        style={{
          background: 'var(--bg-base)',
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 12,
        }}
      >
        <LoadingSpinner size={28} />
        <span
          style={{
            fontFamily: 'var(--font-ui)',
            fontSize: 14,
            color: 'var(--text-secondary)',
          }}
        >
          Hazırlanıyor…
        </span>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    )
  }

  if (isError || !lab) {
    return (
      <div
        style={{
          background: 'var(--bg-base)',
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 16,
        }}
      >
        <p
          style={{
            fontFamily: 'var(--font-ui)',
            fontSize: 14,
            color: 'var(--text-secondary)',
            margin: 0,
          }}
        >
          Sayfa yüklenemedi
        </p>
        <button
          onClick={() => navigate(-1)}
          style={{
            background: 'transparent',
            border: '1px solid var(--accent)',
            color: 'var(--accent)',
            fontFamily: 'var(--font-ui)',
            fontSize: 13,
            padding: '6px 16px',
            borderRadius: 'var(--radius-md)',
            cursor: 'pointer',
          }}
        >
          Geri Dön
        </button>
      </div>
    )
  }

  return (
    <>
      <style>{PRINT_STYLES}</style>

      <div style={{ background: 'var(--bg-base)', minHeight: '100vh', padding: 'var(--space-6)' }}>
        {/* Toolbar — hidden on print */}
        <div
          className="no-print"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 'var(--space-6)',
          }}
        >
          <div>
            <h1
              style={{
                fontFamily: 'var(--font-ui)',
                fontWeight: 600,
                fontSize: 18,
                letterSpacing: '-0.02em',
                color: 'var(--text-primary)',
                margin: '0 0 4px 0',
              }}
            >
              {lab.roomNumber} — QR Baskı Sayfası
            </h1>
            <p
              style={{
                fontFamily: 'var(--font-ui)',
                fontSize: 12,
                color: 'var(--text-muted)',
                margin: 0,
              }}
            >
              {computers.length} bilgisayar
            </p>
          </div>

          <div style={{ display: 'flex', gap: 8 }}>
            <button
              onClick={() => navigate(-1)}
              style={{
                background: 'transparent',
                border: '1px solid var(--border-default)',
                color: 'var(--text-secondary)',
                fontFamily: 'var(--font-ui)',
                fontSize: 13,
                padding: '7px 14px',
                borderRadius: 'var(--radius-md)',
                cursor: 'pointer',
              }}
            >
              Geri Dön
            </button>
            <button
              aria-label="Sayfayı yazdır"
              onClick={() => window.print()}
              style={{
                background: 'var(--accent)',
                color: 'var(--accent-text)',
                border: 'none',
                fontFamily: 'var(--font-ui)',
                fontWeight: 600,
                fontSize: 13,
                padding: '7px 16px',
                borderRadius: 'var(--radius-md)',
                cursor: 'pointer',
              }}
            >
              Yazdır
            </button>
          </div>
        </div>

        {computers.length === 0 ? (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginTop: 64,
            }}
          >
            <p
              style={{
                fontFamily: 'var(--font-ui)',
                fontSize: 14,
                color: 'var(--text-secondary)',
                margin: 0,
              }}
            >
              Bu laboratuvarda yazdırılacak bilgisayar yok
            </p>
          </div>
        ) : (
          <div
            className="qr-grid"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: 'var(--space-3)',
            }}
          >
            {computers.map(computer => (
              <QrCard
                key={computer.id}
                computer={computer}
                labRoomNumber={lab.roomNumber}
              />
            ))}
          </div>
        )}
      </div>
    </>
  )
}
