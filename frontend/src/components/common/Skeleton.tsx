import clsx from 'clsx'

type SkeletonProps = {
  width?: string | number
  height?: string | number
  className?: string
}

export function Skeleton({ width = '100%', height = 16, className }: SkeletonProps) {
  return (
    <div
      role="status"
      aria-busy="true"
      aria-label="Yükleniyor"
      className={clsx('skeleton', className)}
      style={{ width, height }}
    />
  )
}

function SkeletonText({ className }: { className?: string }) {
  return <Skeleton width="70%" height={14} className={className} />
}

function SkeletonTitle({ className }: { className?: string }) {
  return <Skeleton width="40%" height={20} className={className} />
}

function SkeletonRect({
  width = '100%',
  height,
  className,
}: {
  width?: string | number
  height: string | number
  className?: string
}) {
  return <Skeleton width={width} height={height} className={className} />
}

Skeleton.Text = SkeletonText
Skeleton.Title = SkeletonTitle
Skeleton.Rect = SkeletonRect
