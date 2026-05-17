import { useState } from 'react'
import { toast } from 'sonner'
import axiosInstance from '@/services/axiosInstance'
import { ReportRangeRequest } from '@/types/reports.types'
import { AxiosError } from 'axios'

export function useReportExport() {
  const [isExporting, setIsExporting] = useState(false)

  async function exportCsv(params: ReportRangeRequest): Promise<void> {
    setIsExporting(true)
    try {
      const res = await axiosInstance.get('/reports/issues/export', {
        params: { format: 'csv', ...params },
        responseType: 'blob',
      })

      const disposition = res.headers['content-disposition'] as string | undefined
      let filename = `arizalar-${new Date().toISOString().slice(0, 7)}.csv`
      if (disposition) {
        const match = disposition.match(/filename="([^"]+)"/)
        if (match?.[1]) filename = match[1]
      }

      const url = URL.createObjectURL(new Blob([res.data as BlobPart]))
      const a = document.createElement('a')
      a.href = url
      a.download = filename
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch (err) {
      const status = (err as AxiosError).response?.status
      if (status === 403) {
        toast.error('Bu raporu dışa aktarma yetkiniz yok.')
      } else {
        toast.error('Dışa aktarım başarısız.')
      }
    } finally {
      setIsExporting(false)
    }
  }

  return { isExporting, exportCsv }
}
