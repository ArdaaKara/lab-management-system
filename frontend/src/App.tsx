import { Component, Suspense } from 'react'
import { RouterProvider } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { Toaster } from '@/components/ui/sonner'
import router from './routes'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
})

function LoadingFallback() {
  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#0A0A0F',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div
        style={{
          width: 40,
          height: 40,
          border: '4px solid #1E1E2E',
          borderTopColor: '#C9A84C',
          borderRadius: '50%',
          animation: 'spin 0.7s linear infinite',
        }}
      />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}

interface ErrorBoundaryState {
  hasError: boolean
}

class ErrorBoundary extends Component<
  { children: React.ReactNode },
  ErrorBoundaryState
> {
  constructor(props: { children: React.ReactNode }) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            minHeight: '100vh',
            background: '#0A0A0F',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
          }}
        >
          <p
            style={{
              fontFamily: 'Inter',
              fontWeight: 600,
              fontSize: 18,
              color: '#E8E8F0',
              margin: 0,
            }}
          >
            Beklenmeyen bir hata oluştu.
          </p>
          <p
            style={{
              fontFamily: 'Inter',
              fontSize: 14,
              color: '#6B6B80',
              margin: 0,
            }}
          >
            Sayfayı yenileyin.
          </p>
          <button
            onClick={() => window.location.reload()}
            style={{
              marginTop: 8,
              background: '#C9A84C',
              color: '#0A0A0F',
              fontFamily: 'Inter',
              fontWeight: 600,
              fontSize: 14,
              border: 'none',
              borderRadius: 6,
              padding: '10px 24px',
              cursor: 'pointer',
            }}
          >
            Yenile
          </button>
        </div>
      )
    }

    return this.props.children
  }
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ErrorBoundary>
        <Suspense fallback={<LoadingFallback />}>
          <RouterProvider router={router} />
        </Suspense>
      </ErrorBoundary>
      <Toaster position="bottom-right" richColors />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}
