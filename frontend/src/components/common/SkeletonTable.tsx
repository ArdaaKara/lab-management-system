import { Skeleton } from './Skeleton'

type SkeletonTableProps = {
  columns: number
  rows?: number
}

const WIDTH_PATTERN = ['60%', '80%', '40%']

export function SkeletonTable({ columns, rows = 5 }: SkeletonTableProps) {
  return (
    <div aria-label="İçerik yükleniyor">
      {Array.from({ length: rows }, (_, rowIdx) => (
        <div
          key={rowIdx}
          style={{
            display: 'flex',
            gap: 'var(--space-4)',
            padding: '12px 16px',
            borderBottom: '1px solid var(--border-subtle)',
          }}
        >
          {Array.from({ length: columns }, (_, colIdx) => (
            <div key={colIdx} style={{ flex: 1, minWidth: 0 }}>
              <Skeleton
                width={WIDTH_PATTERN[colIdx % WIDTH_PATTERN.length]}
                height={14}
              />
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}
