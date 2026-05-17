import { useQuery } from '@tanstack/react-query'
import { getSummary } from '../services/analyticsService'
import { fetchReportSummary } from '@/lib/api/reports'
import { ReportRangeRequest } from '@/types/reports.types'

export const analyticsKeys = {
  summary: (labId?: string) => ['analytics', 'summary', labId] as const,
  dashboard: (labId?: string) => ['analytics', 'dashboard', labId ?? 'all'] as const,
  reportSummary: (p: ReportRangeRequest) =>
    ['analytics', 'report', p.period, p.labId ?? 'all', p.dateFrom ?? '', p.dateTo ?? ''] as const,
}

// Dashboard page — hardware-focused summary via /analytics endpoint
export function useSummaryQuery(labId?: string) {
  return useQuery({
    queryKey: analyticsKeys.summary(labId),
    queryFn: () => getSummary(labId!),
    enabled: !!labId,
    staleTime: 60_000,
  })
}

// Dashboard page — issue-focused summary via /reports endpoint, auto-refreshes every minute
export function useDashboardQuery(labId?: string) {
  return useQuery({
    queryKey: analyticsKeys.dashboard(labId),
    queryFn: () => fetchReportSummary({ period: 'THIS_MONTH', ...(labId ? { labId } : {}) }),
    staleTime: 60_000,
    refetchInterval: 60_000,
    refetchIntervalInBackground: false,
  })
}

// Reports page — user-driven filters, always fresh, disabled until CUSTOM range is complete
export function useReportSummaryQuery(params: ReportRangeRequest, enabled = true) {
  const isCustomValid = params.period !== 'CUSTOM' || (!!params.dateFrom && !!params.dateTo)
  return useQuery({
    queryKey: analyticsKeys.reportSummary(params),
    queryFn: () => fetchReportSummary(params),
    enabled: enabled && isCustomValid,
    staleTime: 0,
  })
}
