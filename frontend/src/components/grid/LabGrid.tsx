import { useState } from 'react';
import { Monitor } from 'lucide-react';
import { DndContext, DragEndEvent } from '@dnd-kit/core';
import useLabStore from '../../stores/useLabStore';
import { useAuth } from '../../hooks/useAuth';
import { useComputersQuery, useComputerMove } from '../../hooks/useComputersQuery';
import ComputerCell from './ComputerCell';
import { DroppableCell } from './DroppableCell';
import { EmptyCell } from './EmptyCell';
import { ComputerDetailSheet } from '../computer/ComputerDetailSheet';
import EmptyState from '../common/EmptyState';

type Density = 'comfortable' | 'compact';

const CELL_WIDTH: Record<Density, number> = { comfortable: 120, compact: 96 };
const GRID_GAP: Record<Density, number> = { comfortable: 12, compact: 8 };

export function LabGrid({
  labId,
  onAddComputer,
  density = 'comfortable',
}: {
  labId: string;
  onAddComputer?: () => void;
  density?: Density;
}) {
  const labs = useLabStore((state) => state.labs);
  const lab = labs.find((l) => l.id === labId);

  const { data: computers = [], isLoading } = useComputersQuery(labId);
  const moveMutation = useComputerMove(labId);

  const { isAdmin, isTeacher } = useAuth();
  const canDrag = isAdmin || isTeacher;

  const [selectedComputerId, setSelectedComputerId] = useState<string | null>(null);

  const getComputerAt = (row: number, col: number) =>
    computers.find((c) => c.gridRow === row && c.gridCol === col);

  const onDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;
    const parts = (over.id as string).split('-');
    const gridRow = parseInt(parts[1]);
    const gridCol = parseInt(parts[2]);
    moveMutation.mutate({ computerId: active.id as string, gridRow, gridCol });
  };

  if (!lab) {
    return <p style={{ color: 'var(--text-secondary)', padding: 24 }}>Lab bilgisi yüklenemedi.</p>;
  }

  if (!isLoading && computers.length === 0) {
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
        }}
      >
        <EmptyState
          icon={Monitor}
          title="Bu lab'da bilgisayar yok"
          description="Bilgisayar eklemek için '+' butonunu kullanın."
          action={
            (isAdmin || isTeacher) && onAddComputer
              ? { label: 'PC Ekle', onClick: onAddComputer }
              : undefined
          }
        />
      </div>
    );
  }

  const { maxRows, maxCols } = lab;
  const cellWidth = CELL_WIDTH[density];
  const gridGap = GRID_GAP[density];

  const grid = (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${maxCols}, ${cellWidth}px)`,
          gap: `${gridGap}px`,
          padding: '16px',
        }}
      >
        {Array.from({ length: maxRows }, (_, row) =>
          Array.from({ length: maxCols }, (_, col) => {
            const pc = getComputerAt(row, col);
            const key = `cell-${row}-${col}`;

            if (pc) {
              return (
                <ComputerCell
                  key={key}
                  computer={pc}
                  density={density}
                  canDrag={canDrag && pc.status !== 'DECOMMISSIONED'}
                  onSelect={setSelectedComputerId}
                />
              );
            }
            if (canDrag) {
              return <DroppableCell key={key} row={row} col={col} />;
            }
            return <EmptyCell key={key} />;
          })
        )}
      </div>

      {computers.length === 0 && isLoading && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'rgba(10, 10, 15, 0.7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10,
          }}
        >
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: '50%',
              border: '4px solid var(--border-subtle)',
              borderTopColor: 'var(--accent)',
              animation: 'spin 0.8s linear infinite',
            }}
          />
        </div>
      )}
    </div>
  );

  return (
    <>
      {canDrag ? (
        <DndContext onDragEnd={onDragEnd}>{grid}</DndContext>
      ) : (
        grid
      )}

      <ComputerDetailSheet
        computerId={selectedComputerId}
        open={selectedComputerId !== null}
        onClose={() => setSelectedComputerId(null)}
      />
    </>
  );
}
