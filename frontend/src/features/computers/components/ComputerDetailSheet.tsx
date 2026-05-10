import { useState } from 'react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import useComputerStore from '../store/useComputerStore';
import { useAuth } from '../../../hooks/useAuth';
import { ComputerStatus } from '../../../types/computer.types';

interface ComputerDetailSheetProps {
  computerId: string;
  open: boolean;
  onClose: () => void;
}

const statusColors: Record<ComputerStatus, string> = {
  ACTIVE: '#2D6A4F',
  FAULTY: '#8B1A1A',
  UNDER_REPAIR: '#7A5C00',
  DECOMMISSIONED: '#2A2A35',
};

export const ComputerDetailSheet = ({
  computerId,
  open,
  onClose,
}: ComputerDetailSheetProps) => {
  const computer = useComputerStore((state) => state.computers.get(computerId));
  const { isAdmin } = useAuth();
  const [confirmDecommission, setConfirmDecommission] = useState(false);

  if (!computer) {
    return (
      <Sheet open={open} onOpenChange={onClose}>
        <SheetContent style={{ width: '480px', maxWidth: '480px', backgroundColor: '#13131A', borderLeft: '1px solid #1E1E2E' }}>
          <div className="flex items-center justify-center h-full text-[#6B6B80]">
            Bilgisayar bulunamadı
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  const handleDecommission = async () => {
    if (!confirmDecommission) {
      setConfirmDecommission(true);
      return;
    }
    await useComputerStore.getState().updateComputer(computerId, { status: 'DECOMMISSIONED' });
    setConfirmDecommission(false);
    onClose();
  };

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent 
        style={{ 
          width: '480px', 
          maxWidth: '480px', 
          backgroundColor: '#13131A', 
          borderLeft: '1px solid #1E1E2E',
          color: '#E8E8F0'
        }}
      >
        <SheetHeader>
          <div className="flex items-center justify-between mt-4">
            <SheetTitle 
              style={{ 
                fontFamily: "'JetBrains Mono', monospace", 
                fontSize: '1.25rem',
                color: '#E8E8F0',
                letterSpacing: '-0.02em'
              }}
            >
              {computer.name}
            </SheetTitle>
            <Badge 
              style={{ 
                backgroundColor: statusColors[computer.status],
                color: '#FFFFFF',
                borderRadius: '4px',
                border: 'none'
              }}
            >
              {computer.status}
            </Badge>
          </div>
        </SheetHeader>

        <Separator className="my-6" style={{ backgroundColor: '#1E1E2E' }} />

        <div className="space-y-8">
          <section>
            <h3 style={{ fontFamily: 'Inter', fontWeight: 600, letterSpacing: '-0.02em', marginBottom: '12px', fontSize: '12px', color: '#6B6B80', textTransform: 'uppercase' }}>
              Donanım Özellikleri
            </h3>
            <div 
              style={{ 
                backgroundColor: '#13131A', 
                border: '1px solid #1E1E2E', 
                padding: '16px', 
                borderRadius: '8px',
                display: 'grid',
                gap: '12px'
              }}
            >
              {[
                { label: 'CPU', value: computer.hardwareSpecs.cpu },
                { label: 'RAM', value: `${computer.hardwareSpecs.ramGb} GB` },
                { label: 'Disk', value: `${computer.hardwareSpecs.diskGb} GB` },
                { label: 'OS', value: computer.hardwareSpecs.os },
              ].map((row) => (
                <div key={row.label} className="flex justify-between items-center">
                  <span style={{ fontFamily: 'Inter', fontSize: '12px', color: '#6B6B80' }}>{row.label}</span>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '13px', color: '#E8E8F0' }}>{row.value}</span>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h3 style={{ fontFamily: 'Inter', fontWeight: 600, letterSpacing: '-0.02em', marginBottom: '12px', fontSize: '12px', color: '#6B6B80', textTransform: 'uppercase' }}>
              Arıza Özeti
            </h3>
            <div className="flex items-center gap-3">
              <div 
                style={{ 
                  width: '8px', 
                  height: '8px', 
                  borderRadius: '50%', 
                  backgroundColor: computer.activeIssueCount > 0 ? '#8B1A1A' : '#2D6A4F' 
                }} 
              />
              <span style={{ color: computer.activeIssueCount > 0 ? '#8B1A1A' : '#2D6A4F', fontWeight: 500, fontSize: '14px' }}>
                {computer.activeIssueCount > 0 ? `${computer.activeIssueCount} aktif arıza` : 'Aktif arıza yok'}
              </span>
            </div>
          </section>

          {isAdmin && computer.status !== 'DECOMMISSIONED' && (
            <div className="pt-4">
              <Separator className="mb-6" style={{ backgroundColor: '#1E1E2E' }} />
              <div className="flex items-center gap-3">
                <Button
                  variant={confirmDecommission ? "destructive" : "outline"}
                  onClick={handleDecommission}
                  className="flex-1"
                  style={confirmDecommission ? {} : { borderColor: '#8B1A1A', color: '#8B1A1A' }}
                >
                  {confirmDecommission ? 'Emin misiniz? Onayla' : 'Hizmet Dışı Bırak'}
                </Button>
                {confirmDecommission && (
                  <Button 
                    variant="ghost" 
                    onClick={() => setConfirmDecommission(false)}
                    style={{ color: '#6B6B80' }}
                  >
                    İptal
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};
