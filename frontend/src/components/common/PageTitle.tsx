interface PageTitleProps {
  title: string
  subtitle?: string
  right?: React.ReactNode
}

export default function PageTitle({ title, subtitle, right }: PageTitleProps) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        marginBottom: 24,
      }}
    >
      <div>
        <h1
          style={{
            fontFamily: 'Inter',
            fontWeight: 600,
            letterSpacing: '-0.02em',
            fontSize: 20,
            color: '#E8E8F0',
            margin: '0 0 4px 0',
          }}
        >
          {title}
        </h1>
        {subtitle && (
          <p style={{ fontFamily: 'Inter', fontSize: 13, color: '#6B6B80', margin: 0 }}>
            {subtitle}
          </p>
        )}
      </div>
      {right && <div>{right}</div>}
    </div>
  )
}
