import { HardwareSpecs } from '../../types/computer.types';

const rows = (specs: HardwareSpecs) => [
  { label: 'CPU',  value: specs.cpu ?? '—' },
  { label: 'RAM',  value: `${specs.ram_gb} GB` },
  { label: 'Disk', value: `${specs.disk_gb} GB` },
  { label: 'OS',   value: specs.os ?? '—' },
];

export function HardwareSpecsCard({ specs }: { specs: HardwareSpecs }) {
  const data = rows(specs);

  return (
    <div
      style={{
        backgroundColor: '#13131A',
        border: '1px solid #1E1E2E',
        borderRadius: '8px',
        padding: '16px',
      }}
    >
      <div
        style={{
          fontFamily: 'Inter',
          fontWeight: 600,
          fontSize: '12px',
          letterSpacing: '-0.02em',
          color: '#6B6B80',
          textTransform: 'uppercase',
          marginBottom: '12px',
        }}
      >
        Donanım Bilgileri
      </div>

      {data.map(({ label, value }, i) => (
        <div
          key={label}
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingTop: '8px',
            paddingBottom: '8px',
            borderBottom: i < data.length - 1 ? '1px solid #1E1E2E' : 'none',
          }}
        >
          <span style={{ fontFamily: 'Inter', fontSize: '12px', color: '#6B6B80' }}>
            {label}
          </span>
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '13px', color: '#E8E8F0' }}>
            {value}
          </span>
        </div>
      ))}
    </div>
  );
}
