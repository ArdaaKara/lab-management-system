interface LoadingSpinnerProps {
  size?: number
}

export default function LoadingSpinner({ size = 32 }: LoadingSpinnerProps) {
  return (
    <div
      style={{
        width: size,
        height: size,
        border: `${Math.max(2, size / 10)}px solid #1E1E2E`,
        borderTopColor: '#C9A84C',
        borderRadius: '50%',
        animation: 'spin 0.7s linear infinite',
        flexShrink: 0,
      }}
    />
  )
}
