import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { createComputer } from '../../services/computerService';
import { computerKeys } from '../../hooks/useComputersQuery';

interface Props {
  labId: string;
  open: boolean;
  onClose: () => void;
}

const FIELD_STYLE: React.CSSProperties = {
  width: '100%',
  background: 'var(--bg-base)',
  border: '1px solid var(--border-subtle)',
  color: 'var(--text-primary)',
  padding: '9px 12px',
  borderRadius: 'var(--radius-md)',
  fontFamily: 'var(--font-ui)',
  fontSize: 13,
  outline: 'none',
  boxSizing: 'border-box',
};

const LABEL_STYLE: React.CSSProperties = {
  fontFamily: 'var(--font-ui)',
  fontSize: 11,
  textTransform: 'uppercase',
  letterSpacing: '0.04em',
  color: 'var(--text-secondary)',
  marginBottom: 5,
  display: 'block',
};

export function AddComputerDialog({ labId, open, onClose }: Props) {
  const queryClient = useQueryClient();

  const [assetTag, setAssetTag] = useState('');
  const [macAddress, setMacAddress] = useState('');
  const [hostname, setHostname] = useState('');
  const [ipAddress, setIpAddress] = useState('');
  const [gridRow, setGridRow] = useState('');
  const [gridCol, setGridCol] = useState('');
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState('');

  if (!open) return null;

  const reset = () => {
    setAssetTag('');
    setMacAddress('');
    setHostname('');
    setIpAddress('');
    setGridRow('');
    setGridCol('');
    setError('');
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!assetTag.trim() || !macAddress.trim()) {
      setError('Envanter no ve MAC adresi zorunludur.');
      return;
    }

    const macRegex = /^([0-9A-Fa-f]{2}:){5}[0-9A-Fa-f]{2}$/;
    if (!macRegex.test(macAddress.trim())) {
      setError('MAC adresi AA:BB:CC:DD:EE:FF formatında olmalıdır.');
      return;
    }

    setIsPending(true);
    try {
      await createComputer({
        labId,
        assetTag: assetTag.trim(),
        macAddress: macAddress.trim(),
        hostname: hostname.trim() || undefined,
        ipAddress: ipAddress.trim() || undefined,
        gridRow: gridRow !== '' ? parseInt(gridRow) : undefined,
        gridCol: gridCol !== '' ? parseInt(gridCol) : undefined,
      });
      queryClient.invalidateQueries({ queryKey: computerKeys.byLab(labId) });
      handleClose();
    } catch {
      setError('Bilgisayar eklenirken bir hata oluştu.');
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.6)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
      }}
      onClick={handleClose}
    >
      <div
        style={{
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-xl)',
          padding: 28,
          width: '100%',
          maxWidth: 440,
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
          Bilgisayar Ekle
        </h2>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div>
            <label style={LABEL_STYLE}>Envanter No *</label>
            <input
              style={FIELD_STYLE}
              value={assetTag}
              onChange={e => setAssetTag(e.target.value)}
              placeholder="PC-001"
              onFocus={e => (e.target.style.borderColor = 'var(--accent)')}
              onBlur={e => (e.target.style.borderColor = 'var(--border-subtle)')}
            />
          </div>

          <div>
            <label style={LABEL_STYLE}>MAC Adresi *</label>
            <input
              style={FIELD_STYLE}
              value={macAddress}
              onChange={e => setMacAddress(e.target.value)}
              placeholder="AA:BB:CC:DD:EE:FF"
              onFocus={e => (e.target.style.borderColor = 'var(--accent)')}
              onBlur={e => (e.target.style.borderColor = 'var(--border-subtle)')}
            />
          </div>

          <div>
            <label style={LABEL_STYLE}>Hostname</label>
            <input
              style={FIELD_STYLE}
              value={hostname}
              onChange={e => setHostname(e.target.value)}
              placeholder="lab1-pc01"
              onFocus={e => (e.target.style.borderColor = 'var(--accent)')}
              onBlur={e => (e.target.style.borderColor = 'var(--border-subtle)')}
            />
          </div>

          <div>
            <label style={LABEL_STYLE}>IP Adresi</label>
            <input
              style={FIELD_STYLE}
              value={ipAddress}
              onChange={e => setIpAddress(e.target.value)}
              placeholder="192.168.1.10"
              onFocus={e => (e.target.style.borderColor = 'var(--accent)')}
              onBlur={e => (e.target.style.borderColor = 'var(--border-subtle)')}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <div>
              <label style={LABEL_STYLE}>Satır (0'dan başlar)</label>
              <input
                type="number"
                min={0}
                style={FIELD_STYLE}
                value={gridRow}
                onChange={e => setGridRow(e.target.value)}
                placeholder="0"
                onFocus={e => (e.target.style.borderColor = 'var(--accent)')}
                onBlur={e => (e.target.style.borderColor = 'var(--border-subtle)')}
              />
            </div>
            <div>
              <label style={LABEL_STYLE}>Sütun (0'dan başlar)</label>
              <input
                type="number"
                min={0}
                style={FIELD_STYLE}
                value={gridCol}
                onChange={e => setGridCol(e.target.value)}
                placeholder="0"
                onFocus={e => (e.target.style.borderColor = 'var(--accent)')}
                onBlur={e => (e.target.style.borderColor = 'var(--border-subtle)')}
              />
            </div>
          </div>

          {error && (
            <div
              style={{
                background: 'var(--status-faulty-bg)',
                border: '1px solid var(--status-faulty)',
                borderRadius: 'var(--radius-md)',
                padding: '9px 12px',
                color: 'var(--status-faulty-text)',
                fontSize: 13,
                fontFamily: 'var(--font-ui)',
              }}
            >
              {error}
            </div>
          )}

          <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
            <button
              type="button"
              onClick={handleClose}
              style={{
                flex: 1,
                padding: '10px 0',
                borderRadius: 'var(--radius-md)',
                background: 'transparent',
                border: '1px solid var(--border-subtle)',
                color: 'var(--text-secondary)',
                fontFamily: 'var(--font-ui)',
                fontSize: 13,
                fontWeight: 500,
                cursor: 'pointer',
              }}
            >
              İptal
            </button>
            <button
              type="submit"
              disabled={isPending}
              style={{
                flex: 1,
                padding: '10px 0',
                borderRadius: 'var(--radius-md)',
                background: 'var(--accent)',
                border: 'none',
                color: 'var(--accent-text)',
                fontFamily: 'var(--font-ui)',
                fontSize: 13,
                fontWeight: 600,
                cursor: isPending ? 'not-allowed' : 'pointer',
                opacity: isPending ? 0.7 : 1,
              }}
            >
              {isPending ? 'Ekleniyor...' : 'Ekle'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
