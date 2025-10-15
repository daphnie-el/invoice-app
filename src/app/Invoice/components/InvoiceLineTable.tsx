import { faPen, faTrash } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Components } from 'api/gen/client'
import SpinningLoader from 'components/Loader/SpinningLoader'
import ConfirmationModal from 'components/Modals/ConfirmationModal'
import EditInvoiceLineModal from 'components/Modals/EditInvoiceLineModal'
import { useDisclosure } from 'hooks/useDisclosure'
import React, { useCallback, useState } from 'react'
import { Button, OverlayTrigger, Tooltip } from 'react-bootstrap'
import { EditInvoiceProps, InvoiceLine } from 'types'
import { formatEuro } from 'utils'

type Props = {
  invoiceLines: InvoiceLine[]
  finalized: boolean
  refetch?: (val?: unknown) => void
  editInvoice: (val: EditInvoiceProps) => Promise<void>
  editLoading?: boolean
  editable?: boolean
}

const InvoiceLineTable = ({
  invoiceLines,
  finalized,
  refetch,
  editInvoice,
  editLoading,
  editable,
}: Props) => {
  const [selectedLine, setSelectedLine] = useState<InvoiceLine | null>(null)

  const handleDeleteModal = useDisclosure()
  const { isOpen, onClose, onOpen } = useDisclosure()

  const handleEdit = useCallback((line: InvoiceLine) => {
    setSelectedLine(line)
  }, [])

  const updateInvoiceLine = ({
    invoiceLineId,
    updatedItem,
    callback,
  }: {
    invoiceLineId: number
    updatedItem?: Components.Schemas.InvoiceLineUpdatePayload
    callback?: () => void
  }) => {
    const list = invoiceLines?.map((line) =>
      line.id === invoiceLineId
        ? { ...line, ...updatedItem, _destroy: !updatedItem }
        : line
    )

    editInvoice({
      id: selectedLine?.invoice_id!,
      data: {
        invoice: {
          id: selectedLine?.invoice_id!,
          invoice_lines_attributes: list,
        },
      },
      onSuccessCallback: () => {
        refetch?.(selectedLine?.invoice_id!)
        setSelectedLine(null)
        callback?.()
      },
    })
  }

  return (
    <>
      <thead className="p-1 bg-info-subtle">
        <tr>
          <th scope="col">Product Name</th>
          <th scope="col">Quantity</th>
          <th scope="col">Unit Price(EUR)</th>
          <th scope="col">Tax</th>
          <th scope="col">
            <span>Amount(EUR)</span>
          </th>
          {!finalized && <th scope="col">Actions</th>}
        </tr>
      </thead>
      <tbody>
        {invoiceLines?.map((invoiceLine) => {
          const tooltipId = `tooltip-${invoiceLine.id}`
          return (
            <tr key={invoiceLine.id}>
              <td>{invoiceLine?.label}</td>
              <td className=" ">
                <span>{`${invoiceLine.quantity} ${invoiceLine.unit} `}</span>
                {!finalized && editable && (
                  <span className="px-2">
                    <OverlayTrigger
                      placement="top"
                      overlay={
                        <Tooltip id={tooltipId}>Click to edit quantity</Tooltip>
                      }
                    >
                      <Button
                        className="p-1 grow-btn"
                        variant="line"
                        onClick={() => {
                          handleEdit(invoiceLine)
                          onOpen()
                        }}
                      >
                        {' '}
                        <FontAwesomeIcon
                          aria-hidden="true"
                          className="text-primary "
                          icon={faPen}
                        />
                      </Button>
                    </OverlayTrigger>
                  </span>
                )}
              </td>

              <td> {formatEuro(Number(invoiceLine.product.unit_price))}</td>
              <td>
                {invoiceLine?.vat_rate ? `${invoiceLine?.vat_rate}%` : '-'}
              </td>
              <td>
                <span> {formatEuro(Number(invoiceLine.price))}</span>
              </td>
              {!finalized && editable && (
                <td className="px-3">
                  {editLoading ? (
                    <SpinningLoader />
                  ) : (
                    <>
                      <Button
                        className="p-1 grow-btn"
                        variant="none"
                        onClick={() => {
                          handleEdit(invoiceLine)
                          handleDeleteModal.onOpen()
                        }}
                      >
                        <FontAwesomeIcon
                          aria-hidden="true"
                          className="text-danger"
                          icon={faTrash}
                        />
                      </Button>
                    </>
                  )}
                </td>
              )}
            </tr>
          )
        })}
      </tbody>
      {handleDeleteModal.isOpen && selectedLine && (
        <ConfirmationModal
          title="Delete Product from Invoice"
          isOpen={handleDeleteModal.isOpen}
          onClick={() =>
            updateInvoiceLine({ invoiceLineId: selectedLine?.id as number })
          }
          btnLoading={editLoading}
          onClose={handleDeleteModal.onClose}
          btnText="Yes, Delete Product"
        />
      )}
      {selectedLine && isOpen && (
        <EditInvoiceLineModal
          isOpen={isOpen}
          closeModal={onClose}
          btnLoading={editLoading}
          updateInvoiceLine={updateInvoiceLine}
          invoiceLine={selectedLine}
        />
      )}
    </>
  )
}

export default React.memo(InvoiceLineTable)
