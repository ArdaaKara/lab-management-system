import { Component, ReactNode, useState } from 'react';
import { MousePointerClick, Lock } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import useLabStore from '../../stores/useLabStore';
import useUiStore from '../../stores/useUiStore';
import { LabGrid } from '../../components/grid/LabGrid';
import { GridLegend } from '../../components/grid/GridLegend';
import { AddComputerDialog } from '../../components/computer/AddComputerDialog';
import { useAuth } from '../../hooks/useAuth';
import { useComputersQuery, computerKeys } from '../../hooks/useComputersQuery';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EmptyState from '../../components/common/EmptyState';

class ErrorBoundary extends Component<
  { children: ReactNode; fallback: ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) return this.props.fallback;
    return this.props.children;
  }
}

function DensityToggle() {
  const density = useUiStore(s => s.density);
  const setDensity = useUiStore(s => s.setDensity);

  const btnBase: React.CSSProperties = {
    padding: '5px 12px',
    fontFamily: 'Inter',
    fontSize: 12,
    border: '1px solid var(--border-default)',
    cursor: 'pointer',
    transition: 'background 120ms, border-color 120ms, color 120ms',
  };

  const active: React.CSSProperties = {
    background: 'var(--bg-raised)',
    borderColor: 'var(--border-strong)',
    color: 'var(--text-primary)',
  };

  const inactive: React.CSSProperties = {
    background: 'transparent',
    color: 'var(--text-secondary)',
  };

  return (
    <div style={{ display: 'flex', borderRadius: 6, overflow: 'hidden' }}>
      <button
        onClick={() => setDensity('comfortable')}
        title="Comfortable"
        style={{
          ...btnBase,
          borderRight: 'none',
          borderRadius: '6px 0 0 6px',
          ...(density === 'comfortable' ? active : inactive),
        }}
      >
        Geniş
      </button>
      <button
        onClick={() => setDensity('compact')}
        title="Compact"
        style={{
          ...btnBase,
          borderRadius: '0 6px 6px 0',
          ...(density === 'compact' ? active : inactive),
        }}
      >
        Kompakt
      </button>
    </div>
  );
}

function GridPage() {
  const selectedLabId = useLabStore((state) => state.selectedLabId);
  const labs = useLabStore((state) => state.labs);
  const labName = labs.find((l) => l.id === selectedLabId)?.name ?? 'Lab';
  const { isAdmin, isTechnician } = useAuth();
  const density = useUiStore(s => s.density);
  const [dialogOpen, setDialogOpen] = useState(false);

  const queryClient = useQueryClient();
  const { isLoading, isError } = useComputersQuery(selectedLabId);

  const handleRetry = () => {
    if (selectedLabId) {
      queryClient.invalidateQueries({ queryKey: computerKeys.byLab(selectedLabId) });
    }
  };

  const renderContent = () => {
    if (!selectedLabId) {
      const noLabContent = isTechnician && labs.length === 0
        ? (
          <EmptyState
            icon={Lock}
            title="Henüz lab atanmadı"
            description="Yöneticinizden lab ataması talep edin."
          />
        )
        : (
          <EmptyState
            icon={MousePointerClick}
            title="Lab seçin"
            description="Görüntülemek istediğiniz laboratuvarı seçin."
          />
        );

      return (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
          }}
        >
          {noLabContent}
        </div>
      );
    }

    if (isLoading) {
      return (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
          }}
        >
          <LoadingSpinner size={40} />
        </div>
      );
    }

    if (isError) {
      return (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
            gap: 12,
          }}
        >
          <p style={{ color: 'var(--status-faulty-text)', fontFamily: 'Inter', fontSize: 14 }}>
            Lab verisi yüklenemedi.
          </p>
          <button
            onClick={handleRetry}
            style={{
              padding: '6px 16px',
              borderRadius: 6,
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-default)',
              color: 'var(--text-primary)',
              fontFamily: 'Inter',
              fontSize: 12,
              cursor: 'pointer',
            }}
          >
            Tekrar dene
          </button>
        </div>
      );
    }

    return (
      <ErrorBoundary
        fallback={
          <div style={{ padding: 24, color: 'var(--status-faulty-text)' }}>
            Grid yüklenirken bir hata oluştu.
          </div>
        }
      >
        <LabGrid labId={selectedLabId} density={density} onAddComputer={() => setDialogOpen(true)} />
      </ErrorBoundary>
    );
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: 'var(--bg-base)' }}>
      <header
        style={{
          height: '56px',
          background: 'var(--bg-surface)',
          borderBottom: '1px solid var(--border-subtle)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 24px',
          flexShrink: 0,
        }}
      >
        <span
          style={{
            fontFamily: 'Inter',
            fontWeight: 600,
            letterSpacing: '-0.02em',
            color: 'var(--text-primary)',
            fontSize: '15px',
          }}
        >
          {labName}
        </span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <DensityToggle />
          {isAdmin && selectedLabId && (
            <button
              onClick={() => setDialogOpen(true)}
              style={{
                padding: '6px 14px',
                borderRadius: 6,
                background: 'var(--accent)',
                border: 'none',
                color: '#0A0A0F',
                fontFamily: 'Inter',
                fontSize: 12,
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              + Bilgisayar Ekle
            </button>
          )}
          <GridLegend />
        </div>
      </header>

      {selectedLabId && (
        <AddComputerDialog
          labId={selectedLabId}
          open={dialogOpen}
          onClose={() => setDialogOpen(false)}
        />
      )}

      <div style={{ flex: 1, overflow: 'auto' }}>
        {renderContent()}
      </div>
    </div>
  );
}

export default GridPage;
