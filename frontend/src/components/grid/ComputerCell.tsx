import { memo, useState } from 'react';
import { useDraggable } from '@dnd-kit/core';
import { ComputerGridResponse, ComputerStatus } from '../../types/computer.types';

type Density = 'comfortable' | 'compact';

const STATUS_COLORS: Record<ComputerStatus, { border: string; bg: string; text: string }> = {
  ACTIVE:         { border: 'var(--status-active)',  bg: 'var(--status-active-bg)',  text: 'var(--status-active-text)' },
  FAULTY:         { border: 'var(--status-faulty)',  bg: 'var(--status-faulty-bg)',  text: 'var(--status-faulty-text)' },
  UNDER_REPAIR:   { border: 'var(--status-repair)',  bg: 'var(--status-repair-bg)',  text: 'var(--status-repair-text)' },
  DECOMMISSIONED: { border: 'var(--status-decomm)',  bg: 'var(--status-decomm-bg)',  text: 'var(--status-decomm-text)' },
};

function formatStatus(status: ComputerStatus): string {
  return status.toLowerCase().replace(/_/g, ' ');
}

function CellContent({
  computer,
  density,
  onClick,
}: {
  computer: ComputerGridResponse;
  density: Density;
  onClick?: () => void;
}) {
  const [hovered, setHovered] = useState(false);
  const colors = STATUS_COLORS[computer.status];
  const compact = density === 'compact';

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        width: '100%',
        height: compact ? '60px' : '72px',
        backgroundColor: hovered ? 'var(--bg-raised)' : 'var(--bg-surface)',
        border: '1px solid var(--border-subtle)',
        borderLeft: `4px solid ${colors.border}`,
        borderRadius: '4px',
        padding: compact ? '6px 8px' : '8px 10px',
        cursor: 'pointer',
        position: 'relative',
        transition: 'border-color 120ms ease',
        boxSizing: 'border-box',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: compact ? '10px' : '12px',
          color: 'var(--text-primary)',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }}
      >
        {computer.assetTag}
      </div>
      <div
        style={{
          fontSize: compact ? '9px' : '11px',
          color: 'var(--text-secondary)',
          marginTop: '2px',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }}
      >
        {formatStatus(computer.status)}
      </div>
      {(computer.activeIssueCount ?? 0) > 0 && (
        <div
          style={{
            position: 'absolute',
            top: '6px',
            right: '6px',
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            backgroundColor: 'var(--status-faulty)',
          }}
        />
      )}
    </div>
  );
}

function DraggableCell({
  computer,
  density,
  onClick,
}: {
  computer: ComputerGridResponse;
  density: Density;
  onClick?: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: computer.id,
  });

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      style={{
        opacity: isDragging ? 0.5 : 1,
        cursor: isDragging ? 'grabbing' : 'grab',
        transform: transform
          ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
          : undefined,
      }}
    >
      <CellContent computer={computer} density={density} onClick={onClick} />
    </div>
  );
}

const ComputerCell = memo(function ComputerCell({
  computer,
  canDrag,
  density = 'comfortable',
  onSelect,
}: {
  computer: ComputerGridResponse;
  canDrag?: boolean;
  density?: Density;
  onSelect?: (id: string) => void;
}) {
  const handleClick = () => onSelect?.(computer.id);

  if (canDrag) {
    return <DraggableCell computer={computer} density={density} onClick={handleClick} />;
  }

  return (
    <div>
      <CellContent computer={computer} density={density} onClick={handleClick} />
    </div>
  );
});

export default ComputerCell;
