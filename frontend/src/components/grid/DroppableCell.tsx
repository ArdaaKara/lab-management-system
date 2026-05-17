import { useDroppable } from '@dnd-kit/core';

export function DroppableCell({ row, col }: { row: number; col: number }) {
  const { isOver, setNodeRef } = useDroppable({ id: `cell-${row}-${col}` });

  return (
    <div
      ref={setNodeRef}
      style={{
        width: '100%',
        minHeight: '56px',
        backgroundColor: isOver ? '#1A1A24' : '#13131A',
        border: `1px dashed ${isOver ? '#C9A84C' : '#1E1E2E'}`,
        borderRadius: '4px',
        transition: 'background 150ms ease, border-color 150ms ease',
      }}
    />
  );
}
