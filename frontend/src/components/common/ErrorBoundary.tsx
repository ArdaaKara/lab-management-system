import { Component } from 'react'

interface Props {
  children: React.ReactNode
  fallback?: React.ReactNode
}

interface State {
  hasError: boolean
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(): State {
    return { hasError: true }
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback

      return (
        <div
          style={{
            padding: 32,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 8,
          }}
        >
          <p
            style={{
              fontFamily: 'Inter',
              fontWeight: 600,
              fontSize: 15,
              color: '#E8E8F0',
              margin: 0,
            }}
          >
            Beklenmeyen bir hata oluştu.
          </p>
          <button
            onClick={() => this.setState({ hasError: false })}
            style={{
              background: '#C9A84C',
              color: '#0A0A0F',
              fontFamily: 'Inter',
              fontWeight: 600,
              fontSize: 13,
              border: 'none',
              borderRadius: 6,
              padding: '8px 20px',
              cursor: 'pointer',
            }}
          >
            Tekrar Dene
          </button>
        </div>
      )
    }

    return this.props.children
  }
}
