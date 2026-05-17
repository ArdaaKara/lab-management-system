import axiosInstance from '@/services/axiosInstance'
import { ApiResponse } from '@/types/api.types'
import { LabSummaryResponse } from '@/types/analytics.types'

export async function getSummary(labId: string): Promise<LabSummaryResponse> {
  const res = await axiosInstance.get<ApiResponse<LabSummaryResponse>>(
    `/analytics/labs/${labId}/summary`,
  )
  return res.data.data
}
