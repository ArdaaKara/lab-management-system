const ITEMS = [
  { color: '#2D6A4F', label: 'Aktif' },
  { color: '#8B1A1A', label: 'Arızalı' },
  { color: '#7A5C00', label: 'Onarımda' },
  { color: '#2A2A35', label: 'Hizmet Dışı' },
];

export function GridLegend() {
  return (
    <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '16px' }}>
      {ITEMS.map(({ color, label }) => (
        <div key={label} style={{ display: 'flex', alignItems: 'center' }}>
          <span
            style={{
              display: 'inline-block',
              width: '12px',
              height: '12px',
              borderRadius: '2px',
              backgroundColor: color,
            }}
          />
          <span
            style={{
              fontFamily: 'Inter',
              fontSize: '12px',
              color: '#6B6B80',
              marginLeft: '6px',
            }}
          >
            {label}
          </span>
        </div>
      ))}
    </div>
  );
}
