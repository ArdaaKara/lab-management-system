import { memo, type CSSProperties } from 'react';
import { useDraggable } from '@dnd-kit/core';
import useComputerStore from '../store/useComputerStore';
import { useAuth } from '../../../hooks/useAuth';
import { ComputerStatus } from '../../../types/computer.types';

interface ComputerCellProps {
  computerId: string;
  onSelect: (id: string) => void;
}

const statusColors: Record<ComputerStatus, string> = {
  ACTIVE: '#2D6A4F',
  FAULTY: '#8B1A1A',
  UNDER_REPAIR: '#7A5C00',
  DECOMMISSIONED: '#2A2A35',
};

export const ComputerCell = memo(({ computerId, onSelect }: ComputerCellProps) => {
  const computer = useComputerStore((state) => state.computers.get(computerId));
  const { isAdmin } = useAuth();

  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: computerId,
    disabled: !isAdmin,
  });

  if (!computer) return null;

  const style: CSSProperties = {
    backgroundColor: '#13131A',
    border: '1px solid #1E1E2E',
    borderLeft: `4px solid ${statusColors[computer.status]}`,
    padding: '12px',
    borderRadius: '4px',
    cursor: isAdmin ? 'grab' : 'pointer',
    opacity: isDragging ? 0.5 : 1,
    transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
    position: 'relative',
    transition: isDragging ? 'none' : 'transform 200ms cubic-bezier(0.2, 0, 0, 1)',
    zIndex: isDragging ? 999 : 1,
  };

  const nameStyle: CSSProperties = {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: '12px',
    color: '#E8E8F0',
    fontWeight: 500,
    display: 'block',
  };

  const badgeStyle: CSSProperties = {
    fontSize: '10px',
    color: '#6B6B80',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    marginTop: '4px',
    display: 'block',
  };

  const issueDotStyle: CSSProperties = {
    position: 'absolute',
    top: '4px',
    right: '4px',
    width: '6px',
    height: '6px',
    borderRadius: '50%',
    backgroundColor: '#8B1A1A',
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      onClick={() => onSelect(computerId)}
      {...listeners}
      {...attributes}
    >
      <span style={nameStyle}>{computer.name}</span>
      <span style={badgeStyle}>{computer.status}</span>
      {computer.activeIssueCount > 0 && <div style={issueDotStyle} />}
    </div>
  );
});
