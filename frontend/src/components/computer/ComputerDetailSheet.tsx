import { useState } from 'react';
import { CheckCircle2 } from 'lucide-react';
import IssueCreateForm from '@/components/issues/IssueCreateForm';
import { useQueryClient } from '@tanstack/react-query';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '../../hooks/useAuth';
import { HardwareSpecsCard } from './HardwareSpecsCard';
import { useComputersQuery, computerKeys } from '../../hooks/useComputersQuery';
import { decommission } from '../../services/computerService';
import useLabStore from '../../stores/useLabStore';
import { ComputerStatus } from '../../types/computer.types';
import EmptyState from '../common/EmptyState';

const STATUS_LABELS: Record<ComputerStatus, { label: string; color: string; bg: string }> = {
  ACTIVE:         { label: 'Aktif',        color: 'var(--status-active-text)',  bg: 'var(--status-active-bg)' },
  FAULTY:         { label: 'Arızalı',      color: 'var(--status-faulty-text)', bg: 'var(--status-faulty-bg)' },
  UNDER_REPAIR:   { label: 'Onarımda',     color: 'var(--status-repair-text)', bg: 'var(--status-repair-bg)' },
  DECOMMISSIONED: { label: 'Hizmet Dışı',  color: 'var(--status-decomm-text)', bg: 'var(--status-decomm-bg)' },
};

interface ComputerDetailSheetProps {
  computerId: string | null;
  open: boolean;
  onClose: () => void;
}

export function ComputerDetailSheet({ computerId, open, onClose }: ComputerDetailSheetProps) {
  const selectedLabId = useLabStore((s) => s.selectedLabId);
  const { data: computers = [] } = useComputersQuery(selectedLabId);
  const computer = computers.find((c) => c.id === computerId);
  const queryClient = useQueryClient();
  const { isAdmin, isTeacher } = useAuth();
  const canReport = isAdmin || isTeacher;
  const [confirmDecommission, setConfirmDecommission] = useState(false);
  const [showIssueForm, setShowIssueForm] = useState(false);

  if (!computerId) return null;

  const sheetStyle = {
    width: '480px',
    maxWidth: '480px',
    background: 'var(--bg-surface)',
    borderLeft: '1px solid var(--border-subtle)',
  };

  if (!computer) {
    return (
      <Sheet open={open} onOpenChange={onClose}>
        <SheetContent style={sheetStyle}>
          <p style={{ color: 'var(--text-secondary)', padding: 24 }}>Bilgisayar bulunamadı.</p>
        </SheetContent>
      </Sheet>
    );
  }

  const { label, color, bg } = STATUS_LABELS[computer.status];

  return (
    <>
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent style={sheetStyle}>
        <SheetHeader>
          <SheetTitle
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 'var(--text-lg)',
              color: 'var(--text-primary)',
            }}
          >
            {computer.assetTag}
          </SheetTitle>
          <div>
            <span
              style={{
                background: bg,
                color,
                padding: '2px 8px',
                borderRadius: 'var(--radius-sm)',
                fontSize: 'var(--text-xs)',
                fontFamily: 'var(--font-ui)',
              }}
            >
              {label}
            </span>
          </div>
        </SheetHeader>

        <Separator style={{ background: 'var(--border-subtle)', margin: '16px 0' }} />

        {computer.hardwareSpecs && <HardwareSpecsCard specs={computer.hardwareSpecs} />}

        <div style={{ marginTop: '24px' }}>
          <div
            style={{
              fontFamily: 'var(--font-ui)',
              fontWeight: 600,
              fontSize: 'var(--text-xs)',
              letterSpacing: '-0.02em',
              textTransform: 'uppercase',
              color: 'var(--text-secondary)',
              marginBottom: '8px',
            }}
          >
            Aktif Arızalar
          </div>
          {!computer.activeIssueCount ? (
            <EmptyState
              icon={CheckCircle2}
              title="Arıza geçmişi yok"
              description="Bu bilgisayar için kayıtlı arıza bulunmuyor."
              compact
            />
          ) : (
            <span style={{ color: 'var(--status-faulty-text)', fontFamily: 'var(--font-mono)', fontSize: 'var(--text-sm)' }}>
              {computer.activeIssueCount} aktif arıza
            </span>
          )}
        </div>

        {canReport && (
          <>
            <Separator style={{ background: 'var(--border-subtle)', margin: '24px 0' }} />
            <Button
              variant="outline"
              onClick={() => setShowIssueForm(true)}
              style={{ borderColor: 'var(--border-default)', color: 'var(--text-primary)', background: 'transparent' }}
            >
              Arıza Bildir
            </Button>
          </>
        )}

        {isAdmin && (
          <>
            <Separator style={{ background: 'var(--border-subtle)', margin: '24px 0' }} />
            {!confirmDecommission ? (
              <Button
                variant="outline"
                onClick={() => setConfirmDecommission(true)}
                style={{ borderColor: 'var(--status-faulty)', color: 'var(--status-faulty)', background: 'transparent' }}
              >
                Hizmet Dışı Bırak
              </Button>
            ) : (
              <div style={{ display: 'flex', gap: 8 }}>
                <Button
                  onClick={async () => {
                    await decommission(computerId);
                    queryClient.invalidateQueries({ queryKey: computerKeys.byLab(selectedLabId!) });
                    onClose();
                  }}
                  style={{ background: 'var(--status-faulty)', color: 'var(--text-primary)' }}
                >
                  Onayla
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => setConfirmDecommission(false)}
                  style={{ color: 'var(--text-secondary)' }}
                >
                  İptal
                </Button>
              </div>
            )}
          </>
        )}
      </SheetContent>
    </Sheet>

    <IssueCreateForm
      open={showIssueForm && !!selectedLabId}
      computerId={computer?.id ?? ''}
      labId={selectedLabId ?? computer?.labId ?? ''}
      onClose={() => setShowIssueForm(false)}
      onSuccess={() => {
        setShowIssueForm(false)
        queryClient.invalidateQueries({ queryKey: ['issues'] })
      }}
    />
  </>
  );
}
