import { type CSSProperties } from 'react';
import { useDroppable } from '@dnd-kit/core';
import { useAuth } from '../../../hooks/useAuth';

interface DroppableCellProps {
  row: number;
  col: number;
  onDrop?: (row: number, col: number) => void;
}

export const DroppableCell = ({ row, col }: DroppableCellProps) => {
  const { isOver, setNodeRef } = useDroppable({
    id: `cell-${row}-${col}`,
  });
  const { isAdmin } = useAuth();

  if (!isAdmin) return null;

  const style: CSSProperties = {
    width: '100%',
    height: '100%',
    minHeight: '56px',
    backgroundColor: isOver ? '#1A1A24' : '#13131A',
    border: `1px dashed ${isOver ? '#C9A84C' : '#1E1E2E'}`,
    borderRadius: '4px',
    transition: 'background 150ms ease, border-color 150ms ease',
  };

  return <div ref={setNodeRef} style={style} />;
};
