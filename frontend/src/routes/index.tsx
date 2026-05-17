import { lazy, Suspense } from 'react'
import { createBrowserRouter, Navigate } from 'react-router-dom'
import AppShell from '@/components/layout/AppShell'
import ProtectedRoute from './ProtectedRoute'
import DashboardPage from '@/routes/dashboard/DashboardPage'
import GridPage from './grid/GridPage'
import IssuesPage from '@/routes/issues/IssuesPage'
import PublicReportPage from '@/routes/report/PublicReportPage'
import PublicReportSuccessPage from '@/routes/report/PublicReportSuccessPage'

const LoginPage = lazy(() => import('@/routes/auth/LoginPage'))
const ChangePasswordPage = lazy(() => import('@/routes/auth/ChangePasswordPage'))
const LabListPage = lazy(() => import('@/routes/labs/LabListPage'))
const LabDetailPage = lazy(() => import('@/routes/labs/LabDetailPage'))
const QrSheetPage = lazy(() => import('@/routes/labs/QrSheetPage'))
const UserListPage = lazy(() => import('@/routes/users/UserListPage'))
const ReportsPage = lazy(() => import('@/routes/reports/ReportsPage'))
const ProfileSettingsPage = lazy(() => import('@/routes/settings/ProfileSettingsPage'))

const LoadingFallback = () => (
  <div
    style={{
      minHeight: '100vh',
      background: 'var(--bg-base)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}
  >
    <div
      style={{
        width: 40,
        height: 40,
        border: '4px solid var(--border-subtle)',
        borderTopColor: 'var(--accent)',
        borderRadius: '50%',
        animation: 'spin 0.7s linear infinite',
      }}
    />
    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
  </div>
)

const UnauthorizedPage = () => (
  <div
    style={{
      minHeight: '100vh',
      background: 'var(--bg-base)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 16,
    }}
  >
    <p
      style={{
        fontFamily: 'Inter',
        fontSize: 18,
        fontWeight: 600,
        color: 'var(--text-primary)',
        margin: 0,
      }}
    >
      Erişim yetkiniz yok.
    </p>
    <button
      onClick={() => window.history.back()}
      style={{
        background: 'transparent',
        border: '1px solid var(--accent)',
        color: 'var(--accent)',
        fontFamily: 'Inter',
        fontSize: 13,
        padding: '8px 20px',
        borderRadius: 6,
        cursor: 'pointer',
      }}
    >
      Geri Dön
    </button>
  </div>
)

const NotFoundPage = () => (
  <div
    style={{
      minHeight: '100vh',
      background: 'var(--bg-base)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 16,
    }}
  >
    <p
      style={{
        fontFamily: 'Inter',
        fontSize: 18,
        fontWeight: 600,
        color: 'var(--text-primary)',
        margin: 0,
      }}
    >
      Sayfa bulunamadı.
    </p>
    <button
      onClick={() => window.history.back()}
      style={{
        background: 'transparent',
        border: '1px solid var(--accent)',
        color: 'var(--accent)',
        fontFamily: 'Inter',
        fontSize: 13,
        padding: '8px 20px',
        borderRadius: 6,
        cursor: 'pointer',
      }}
    >
      Geri Dön
    </button>
  </div>
)

const router = createBrowserRouter([
  {
    path: '/',
    element: <AppShell />,
    children: [
      {
        index: true,
        element: <Navigate to="/dashboard" replace />,
      },
      {
        element: <ProtectedRoute allowedRoles={['ADMIN', 'TEACHER']} />,
        children: [
          { path: 'dashboard', element: <DashboardPage /> },
        ],
      },
      {
        element: <ProtectedRoute />,
        children: [
          { path: 'grid', element: <GridPage /> },
          { path: 'issues', element: <IssuesPage /> },
          {
            path: 'change-password',
            element: (
              <Suspense fallback={<LoadingFallback />}>
                <ChangePasswordPage />
              </Suspense>
            ),
          },
          {
            path: 'settings/profile',
            element: (
              <Suspense fallback={<LoadingFallback />}>
                <ProfileSettingsPage />
              </Suspense>
            ),
          },
        ],
      },
      {
        element: <ProtectedRoute allowedRoles={['ADMIN', 'TEACHER']} />,
        children: [
          {
            path: 'reports',
            element: (
              <Suspense fallback={<LoadingFallback />}>
                <ReportsPage />
              </Suspense>
            ),
          },
        ],
      },
      {
        element: <ProtectedRoute allowedRoles={['ADMIN']} />,
        children: [
          {
            path: 'labs',
            element: (
              <Suspense fallback={<LoadingFallback />}>
                <LabListPage />
              </Suspense>
            ),
          },
          {
            path: 'labs/:labId',
            element: (
              <Suspense fallback={<LoadingFallback />}>
                <LabDetailPage />
              </Suspense>
            ),
          },
          {
            path: 'labs/:labId/qr-sheet',
            element: (
              <Suspense fallback={<LoadingFallback />}>
                <QrSheetPage />
              </Suspense>
            ),
          },
          {
            path: 'users',
            element: (
              <Suspense fallback={<LoadingFallback />}>
                <UserListPage />
              </Suspense>
            ),
          },
        ],
      },
    ],
  },
  {
    path: '/login',
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <LoginPage />
      </Suspense>
    ),
  },
  {
    path: '/report/:computerId',
    element: <PublicReportPage />,
  },
  {
    path: '/report/:computerId/success',
    element: <PublicReportSuccessPage />,
  },
  {
    path: '/unauthorized',
    element: <UnauthorizedPage />,
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
])

export default router
