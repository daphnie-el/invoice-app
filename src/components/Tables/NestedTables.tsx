import React from 'react'
import { OverlayTrigger, Table, Tooltip } from 'react-bootstrap'

interface NestedTableProps {
  children: React.ReactNode
}

export function NestedTable({ children }: NestedTableProps) {
  return (
    <Table bordered hover responsive>
      {children}
    </Table>
  )
}

interface NestedRowProps {
  children: React.ReactNode
  hasChildren?: boolean
  openRowId?: string | number | null
  rowId: string | number
  childTables?: React.ReactNode
  setOpenRowId: (id: string | number | null) => void
  tooltipId: string
}

export function NestedRow({
  children,
  childTables,
  hasChildren = false,
  openRowId,
  rowId,
  setOpenRowId,
  tooltipId,
}: NestedRowProps) {
  const isOpen = openRowId === rowId

  const handleToggle = () => {
    if (!hasChildren) return
    setOpenRowId(isOpen ? null : rowId)
  }

  return (
    <>
      <OverlayTrigger
        placement="top"
        overlay={<Tooltip id={tooltipId}>Click to expand</Tooltip>}
      >
        <tr
          tabIndex={0}
          style={{ cursor: hasChildren ? 'pointer' : 'default' }}
          onClick={() => hasChildren && handleToggle()}
          aria-expanded={isOpen}
          role="button"
          aria-label="Click to expand"
          onKeyDown={(e) => e.key === 'Enter' && hasChildren && handleToggle()}
        >
          {children}
        </tr>
      </OverlayTrigger>
      {hasChildren && (
        <tr>
          <td colSpan={100} className="p-0 border-0">
            {isOpen ? (
              <Table size="sm" striped bordered className="m-0">
                {childTables}
              </Table>
            ) : null}
          </td>
        </tr>
      )}
    </>
  )
}
