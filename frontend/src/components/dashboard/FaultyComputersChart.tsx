import { useEffect, useRef } from 'react'
import * as Chart from 'chart.js'
import { LabSummaryResponse } from '@/types/analytics.types'

Chart.Chart.register(...Chart.registerables)

interface FaultyChartProps {
  summary: LabSummaryResponse
}

export default function FaultyChart({ summary }: FaultyChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const chartRef = useRef<Chart.Chart | null>(null)

  useEffect(() => {
    if (!canvasRef.current) return
    if (summary.topFaultyComputers.length === 0) return

    if (chartRef.current) {
      chartRef.current.destroy()
    }

    const ctx = canvasRef.current.getContext('2d')
    if (!ctx) return

    const style = getComputedStyle(document.documentElement)
    const faultyColor = style.getPropertyValue('--status-faulty-text').trim()
    const axisColor   = style.getPropertyValue('--text-secondary').trim()
    const labelColor  = style.getPropertyValue('--text-primary').trim()
    const gridColor   = style.getPropertyValue('--border-subtle').trim()

    chartRef.current = new Chart.Chart(ctx, {
      type: 'bar',
      data: {
        labels: summary.topFaultyComputers.map(c => c.hostname ?? c.assetTag),
        datasets: [
          {
            data: summary.topFaultyComputers.map(c => c.issueCount),
            backgroundColor: faultyColor + '66',
            borderColor: faultyColor,
            borderWidth: 1,
            borderRadius: 4,
          },
        ],
      },
      options: {
        indexAxis: 'y',
        plugins: { legend: { display: false } },
        scales: {
          x: {
            ticks: { color: axisColor },
            grid: { color: gridColor },
          },
          y: {
            ticks: {
              color: labelColor,
              font: { family: 'JetBrains Mono' },
            },
            grid: { color: 'transparent' },
          },
        },
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
        En Çok Arıza Bildirilen Bilgisayarlar
      </p>

      {summary.topFaultyComputers.length === 0 ? (
        <p
          style={{
            fontFamily: 'var(--font-ui)',
            color: 'var(--text-muted)',
            textAlign: 'center',
            padding: 32,
            margin: 0,
            fontSize: 13,
          }}
        >
          Veri yok
        </p>
      ) : (
        <div style={{ height: 220 }}>
          <canvas ref={canvasRef} />
        </div>
      )}
    </div>
  )
}
