import { Component, type ReactNode } from 'react';
import useLabStore from '../../labs/store/useLabStore';
import { LabGrid } from '../components/LabGrid';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

const legendItems = [
  { color: '#2D6A4F', label: 'Aktif' },
  { color: '#8B1A1A', label: 'Arızalı' },
  { color: '#7A5C00', label: 'Onarımda' },
  { color: '#2A2A35', label: 'Hizmet Dışı' },
];

const GridLegend = () => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
    {legendItems.map((item) => (
      <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
        <div style={{ width: '12px', height: '12px', borderRadius: '2px', backgroundColor: item.color }} />
        <span style={{ fontSize: '12px', color: '#6B6B80' }}>{item.label}</span>
      </div>
    ))}
  </div>
);

export const ComputerGridPage = () => {
  const labs = useLabStore((state) => state.labs);
  const selectedLabId = useLabStore((state) => state.selectedLabId);

  const labName = labs.find((l) => l.id === selectedLabId)?.name ?? 'Lab';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', backgroundColor: '#0A0A0F' }}>
      <header
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: '56px',
          backgroundColor: '#13131A',
          borderBottom: '1px solid #1E1E2E',
          padding: '0 24px',
        }}
      >
        <h1
          style={{
            fontFamily: 'Inter',
            fontWeight: 600,
            letterSpacing: '-0.02em',
            color: '#E8E8F0',
            fontSize: '18px',
            margin: 0,
          }}
        >
          {labName}
        </h1>
        <GridLegend />
      </header>

      <main style={{ flex: 1, overflow: 'auto', position: 'relative' }}>
        {!selectedLabId ? (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#6B6B80',
              fontSize: '14px',
            }}
          >
            Lab seçilmedi
          </div>
        ) : (
          <ErrorBoundary
            fallback={
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: '100%',
                  color: '#8B1A1A',
                }}
              >
                Grid yüklenirken bir hata oluştu.
              </div>
            }
          >
            <LabGrid labId={selectedLabId} />
          </ErrorBoundary>
        )}
      </main>
    </div>
  );
};
