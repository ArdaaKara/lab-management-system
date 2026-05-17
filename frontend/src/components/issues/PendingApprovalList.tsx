import { useState } from 'react'
import { usePendingApprovalsQuery, useIssueMutations } from '@/hooks/useIssuesQuery'
import useLabStore from '@/stores/useLabStore'
import IssueStatusBadge from './IssueStatusBadge'
import { Button } from '@/components/ui/button'
import RejectIssueDialog from './RejectIssueDialog'
import { IssueResponse } from '@/types/issue.types'

const CATEGORY_LABELS: Record<string, string> = {
  NO_DISPLAY: 'Ekran Yok',
  NO_INTERNET: 'İnternet Yok',
  NO_POWER: 'Güç Yok',
  SLOW_PERFORMANCE: 'Yavaş Performans',
  PERIPHERAL_FAILURE: 'Çevre Birimi Arızası',
  OS_ERROR: 'İS Hatası',
  OTHER: 'Diğer',
}

export default function PendingApprovalList() {
  const labId = useLabStore(s => s.selectedLabId)
  const { data: pending = [], isLoading } = usePendingApprovalsQuery(labId)
  const { approve } = useIssueMutations(labId ?? '')

  const [rejectTarget, setRejectTarget] = useState<IssueResponse | null>(null)

  return (
    <>
      <div style={{ marginBottom: 16 }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 12,
          }}
        >
          <span
            style={{
              fontFamily: 'var(--font-ui)',
              fontWeight: 600,
              letterSpacing: '-0.02em',
              color: 'var(--text-primary)',
              fontSize: 'var(--text-base)',
            }}
          >
            Onay Bekleyen Arızalar
          </span>
          <span
            style={{
              background: 'var(--accent-muted)',
              color: 'var(--accent)',
              border: '1px solid rgba(201,168,76,0.33)',
              borderRadius: 'var(--radius-sm)',
              padding: '2px 10px',
              fontFamily: 'var(--font-ui)',
              fontSize: 'var(--text-sm)',
              fontWeight: 600,
            }}
          >
            {pending.length}
          </span>
        </div>

        {isLoading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {[0, 1, 2].map(i => (
              <div
                key={i}
                style={{
                  background: 'var(--bg-raised)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-lg)',
                  height: 72,
                }}
              />
            ))}
          </div>
        ) : pending.length === 0 ? (
          <p
            style={{
              color: 'var(--text-secondary)',
              fontSize: 'var(--text-base)',
              padding: '24px 0',
              textAlign: 'center',
            }}
          >
            Onay bekleyen arıza bulunmuyor.
          </p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {pending.map(issue => (
              <div
                key={issue.id}
                style={{
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--border-subtle)',
                  borderLeft: '4px solid var(--status-repair)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '12px 16px',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: 4,
                  }}
                >
                  <span
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: 'var(--text-sm)',
                      color: 'var(--text-primary)',
                    }}
                  >
                    {issue.computerName}
                  </span>
                  <IssueStatusBadge status={issue.status} />
                </div>

                <p
                  style={{
                    fontFamily: 'var(--font-ui)',
                    fontSize: 'var(--text-sm)',
                    color: 'var(--text-secondary)',
                    marginBottom: issue.description ? 4 : 0,
                  }}
                >
                  {CATEGORY_LABELS[issue.category] ?? issue.category}
                  {' · '}
                  {new Date(issue.createdAt).toLocaleDateString('tr-TR')}
                </p>

                {issue.description && (
                  <p
                    style={{
                      fontFamily: 'var(--font-ui)',
                      fontStyle: 'italic',
                      fontSize: 'var(--text-sm)',
                      color: 'var(--text-secondary)',
                      overflow: 'hidden',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      marginBottom: 4,
                    }}
                  >
                    {issue.description}
                  </p>
                )}

                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                    gap: 4,
                    marginTop: 8,
                  }}
                >
                  <Button
                    variant="ghost"
                    style={{ fontSize: 12, color: 'var(--status-active)' }}
                    onClick={() => approve.mutate(issue.id)}
                    disabled={approve.isPending}
                  >
                    Onayla
                  </Button>
                  <Button
                    variant="ghost"
                    style={{ fontSize: 12, color: 'var(--status-faulty)' }}
                    onClick={() => setRejectTarget(issue)}
                  >
                    Reddet
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <RejectIssueDialog
        issue={rejectTarget}
        open={rejectTarget !== null}
        onClose={() => setRejectTarget(null)}
      />
    </>
  )
}
