import { Toaster as Sonner, ToasterProps } from 'sonner'

export function Toaster(props: ToasterProps) {
  return (
    <Sonner
      theme="dark"
      className="toaster"
      style={
        {
          '--normal-bg': 'var(--bg-raised)',
          '--normal-border': 'var(--border-subtle)',
          '--normal-text': 'var(--text-primary)',
        } as React.CSSProperties
      }
      {...props}
    />
  )
}
