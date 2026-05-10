import { useEffect, useState, useCallback } from 'react';
import { DndContext, type DragEndEvent } from '@dnd-kit/core';
import useLabStore from '../../../features/labs/store/useLabStore';
import useComputerStore from '../store/useComputerStore';
import { useAuth } from '../../../hooks/useAuth';
import { usePolling } from '../../../hooks/usePolling';
import { ComputerCell } from './ComputerCell';
import { DroppableCell } from './DroppableCell';
import { ComputerDetailSheet } from './ComputerDetailSheet';

interface LabGridProps {
  labId: string;
}

export const LabGrid = ({ labId }: LabGridProps) => {
  const lab = useLabStore((state) => state.labs.find((l) => l.id === labId));
  const computers = useComputerStore((state) => state.computers);
  const fetchComputers = useComputerStore((state) => state.fetchComputers);
  const isLoading = useComputerStore((state) => state.isLoading);
  const { isAdmin } = useAuth();
  
  const [selectedComputerId, setSelectedComputerId] = useState<string | null>(null);

  const fetchComputersMemo = useCallback(() => {
    fetchComputers(labId).catch(() => {});
  }, [fetchComputers, labId]);

  useEffect(() => {
    fetchComputersMemo();
  }, [fetchComputersMemo]);

  usePolling(fetchComputersMemo, 30000);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;
    
    const [, rowStr, colStr] = String(over.id).split('-');
    
    useComputerStore.getState().updateComputer(String(active.id), {
      gridRow: parseInt(rowStr, 10),
      gridCol: parseInt(colStr, 10),
    }).catch(() => {});
  };

  if (!lab) {
    return null;
  }

  const cells = [];
  const computersArray = Array.from(computers.values());

  for (let row = 0; row < lab.maxRows; row++) {
    for (let col = 0; col < lab.maxCols; col++) {
      const pc = computersArray.find((c) => c.gridRow === row && c.gridCol === col);

      if (pc) {
        cells.push(
          <ComputerCell 
            key={`cell-${row}-${col}`} 
            computerId={pc.id} 
            onSelect={setSelectedComputerId} 
          />
        );
      } else if (isAdmin) {
        cells.push(
          <DroppableCell 
            key={`cell-${row}-${col}`} 
            row={row} 
            col={col} 
          />
        );
      } else {
        cells.push(
          <div
            key={`cell-${row}-${col}`}
            style={{
              border: '1px dashed #1E1E2E',
              backgroundColor: '#13131A',
              minHeight: '56px',
              borderRadius: '4px',
              width: '100%',
              height: '100%',
            }}
          />
        );
      }
    }
  }

  const content = (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${lab.maxCols}, 1fr)`,
        gap: '8px',
        padding: '16px',
        position: 'relative',
        minHeight: '200px',
      }}
    >
      {cells}
      
      {computers.size === 0 && isLoading && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundColor: 'rgba(19, 19, 26, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 50,
          }}
        >
          <div className="border-4 border-t-[#C9A84C] border-gray-700 rounded-full w-8 h-8 animate-spin" />
        </div>
      )}
    </div>
  );

  return (
    <>
      {isAdmin ? (
        <DndContext onDragEnd={handleDragEnd}>
          {content}
        </DndContext>
      ) : (
        content
      )}

      <ComputerDetailSheet
        computerId={selectedComputerId ?? ''}
        open={selectedComputerId !== null}
        onClose={() => setSelectedComputerId(null)}
      />
    </>
  );
};
