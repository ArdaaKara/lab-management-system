import { useEffect, useRef } from 'react'
import * as Chart from 'chart.js'
import { LabSummaryResponse } from '@/types/analytics.types'

Chart.Chart.register(...Chart.registerables)

interface HealthDonutChartProps {
  summary: LabSummaryResponse
}

export default function HealthDonutChart({ summary }: HealthDonutChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const chartRef = useRef<Chart.Chart | null>(null)

  useEffect(() => {
    if (!canvasRef.current) return

    if (chartRef.current) {
      chartRef.current.destroy()
    }

    const ctx = canvasRef.current.getContext('2d')
    if (!ctx) return

    const style = getComputedStyle(document.documentElement)
    const activeColor   = style.getPropertyValue('--status-active-text').trim()
    const faultyColor   = style.getPropertyValue('--status-faulty-text').trim()
    const repairColor   = style.getPropertyValue('--status-repair-text').trim()
    const borderColor   = style.getPropertyValue('--border-subtle').trim()
    const legendColor   = style.getPropertyValue('--text-secondary').trim()

    chartRef.current = new Chart.Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Aktif', 'Arızalı', 'Onarımda'],
        datasets: [
          {
            data: [summary.activeCount, summary.faultyCount, summary.underRepairCount],
            backgroundColor: [activeColor, faultyColor, repairColor],
            borderColor,
            borderWidth: 2,
          },
        ],
      },
      options: {
        plugins: {
          legend: {
            labels: {
              color: legendColor,
              font: { family: 'Inter' },
            },
          },
        },
        cutout: '65%',
        responsive: true,
        maintainAspectRatio: false,
      },
    })

    return () => {
      chartRef.current?.destroy()
      chartRef.current = null
    }
  }, [summary])

  return (
    <div
      style={{
        background: 'var(--bg-surface)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-lg)',
        padding: 16,
      }}
    >
      <p
        style={{
          fontFamily: 'var(--font-ui)',
          fontWeight: 600,
          fontSize: 11,
          color: 'var(--text-muted)',
          textTransform: 'uppercase',
          letterSpacing: '0.06em',
          margin: '0 0 12px 0',
        }}
      >
        Lab Sağlığı
      </p>
      <div style={{ height: 200 }}>
        <canvas ref={canvasRef} />
      </div>
    </div>
  )
}
