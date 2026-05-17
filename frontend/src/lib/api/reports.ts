import axiosInstance from '@/services/axiosInstance'
import { ApiResponse } from '@/types/api.types'
import { DashboardSummary, ReportRangeRequest } from '@/types/reports.types'

function cleanParams(p: ReportRangeRequest) {
  return Object.fromEntries(
    Object.entries(p).filter(([, v]) => v != null && v !== '')
  )
}

export async function fetchReportSummary(params: ReportRangeRequest): Promise<DashboardSummary> {
  const res = await axiosInstance.get<ApiResponse<DashboardSummary>>('/reports/summary', {
    params: cleanParams(params),
  })
  return res.data.data
}

export const getReportSummary = fetchReportSummary
