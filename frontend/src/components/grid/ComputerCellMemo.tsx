import { memo } from 'react'
import ComputerCell from './ComputerCell'
import type { ComputerGridResponse } from '../../types/computer.types'

interface ComputerCellMemoProps {
  computer: ComputerGridResponse
  canDrag?: boolean
  onSelect?: (id: string) => void
}

// React.memo wrapper — re-renders only when computer reference or canDrag changes.
const ComputerCellMemo = memo(
  function ComputerCellMemo({ computer, canDrag, onSelect }: ComputerCellMemoProps) {
    return <ComputerCell computer={computer} canDrag={canDrag} onSelect={onSelect} />
  }
)

export default ComputerCellMemo
