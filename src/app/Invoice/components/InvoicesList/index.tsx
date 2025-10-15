import {
  faAngleDoubleDown,
  faChevronDown,
  faChevronRight,
  faCircleInfo,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import EmptyState from 'components/EmptyState'
import TableLoader from 'components/Loader/TableLoader'
import MenuDropdown from 'components/MenuDropdown'
import ConfirmationModal from 'components/Modals/ConfirmationModal'
import { NestedRow, NestedTable } from 'components/Tables/NestedTables'
import { useDisclosure } from 'hooks/useDisclosure'
import { useCallback, useState } from 'react'
import { Button, Tooltip } from 'react-bootstrap'
import OverlayTrigger from 'react-bootstrap/OverlayTrigger'
import { useNavigate } from 'react-router-dom'
import { EditInvoiceProps, Invoice, InvoiceAction } from 'types'
import { formatEuro, isOverdue, todayDateString } from 'utils'
import PayAndFinalizeModal from '../../../../components/Modals/PayAndFinalizeModal'
import InvoiceLineTable from '../InvoiceLineTable'
type Props = {
  invoicesList: Invoice[]
  loading: boolean
  firstPage: boolean
  editLoading?: boolean
  clearFilters?: () => void
  editInvoice: (val: EditInvoiceProps) => Promise<void>
  deleteInvoice: ({
    id,
    callback,
  }: {
    id: number
    callback: (val?: unknown) => void
  }) => Promise<void>
}

const InvoicesList = ({
  invoicesList = [],
  loading,
  editLoading,
  editInvoice,
  deleteInvoice,
  firstPage,
  clearFilters,
}: Props) => {
  const [openRowId, setOpenRowId] = useState<string | number | null>(null)
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null)
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null)
  const [actionType, setActionType] = useState<InvoiceAction | null>(null)

  const ConfirmationModalToggle = useDisclosure()
  const { isOpen, onOpen, onClose } = useDisclosure()

  const navigate = useNavigate()

  const buildMenuList = useCallback(
    (invoice: Invoice) => {
      const openConfirmation = (invoice: Invoice, action: InvoiceAction) => {
        setSelectedInvoice(invoice)
        setActionType(action)
        ConfirmationModalToggle.onOpen()
      }
      const isOpen = openRowId === invoice.id
      const isFinalized = invoice.finalized
      const isPaid = invoice.paid

      const menu = [
        {
          label: isOpen ? 'Hide Products' : 'Show Products',
          onClick: () => setOpenRowId(isOpen ? null : invoice.id),
        },
        {
          label: 'View Invoice',
          onClick: () => navigate(`/invoice/${invoice.id}`),
        },

        !isFinalized &&
          !isPaid && {
            label: 'Delete Invoice',
            onClick: onOpen,
          },

        !isFinalized && {
          label: 'Finalize Invoice',
          onClick: () => openConfirmation(invoice, 'finalized'),
        },

        isFinalized &&
          !isPaid && {
            label: 'Mark as Paid',
            onClick: () => openConfirmation(invoice, 'paid'),
          },
      ]

      // remove falsy values (from conditions above)
      return menu.filter(Boolean) as {
        label: string
        onClick: () => void
      }[]
    },
    [navigate, onOpen, openRowId, ConfirmationModalToggle]
  )

  return (
    <>
      {loading && firstPage ? (
        <TableLoader size="lg" rows={5} />
      ) : invoicesList?.length === 0 ? (
        <EmptyState
          title="No Invoices Found"
          info="There are no invoices to display at the moment. Please update your filters or create a new invoice."
        >
          <Button
            variant="secondary"
            onClick={() => {
              clearFilters?.()
            }}
          >
            Clear Filters
          </Button>
        </EmptyState>
      ) : (
        <section className="h-full">
          <NestedTable>
            <thead className="bg-info ">
              <tr className="bg-info">
                <th scope="col">
                  <OverlayTrigger
                    placement="top"
                    overlay={
                      <Tooltip id="tooltip-invoice-id">
                        Click any row to expand and see invoice details
                      </Tooltip>
                    }
                  >
                    <span>
                      {' '}
                      <FontAwesomeIcon
                        icon={faAngleDoubleDown}
                        aria-hidden="true"
                      />{' '}
                      ID
                    </span>
                  </OverlayTrigger>
                </th>
                <th scope="col">
                  <OverlayTrigger
                    placement="top"
                    overlay={
                      <Tooltip id="tooltip-finalized">
                        Click any customer's name to view invoice details
                      </Tooltip>
                    }
                  >
                    <span>
                      {' '}
                      <FontAwesomeIcon
                        icon={faCircleInfo}
                        aria-hidden="true"
                      />{' '}
                      Customer
                    </span>
                  </OverlayTrigger>
                </th>
                <th scope="col">Date</th>
                <th>Total (EUR)</th>
                <th scope="col">Status</th>
                <th scope="col">Deadline</th>
                <th scope="col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {invoicesList?.map((invoice) => {
                const tooltipId = `tooltip-${invoice.id}`
                const isOverdueAndUnpaid =
                  isOverdue(invoice.deadline) && !invoice.paid
                return (
                  <NestedRow
                    tooltipId={tooltipId}
                    key={invoice.id}
                    hasChildren={invoice.invoice_lines.length > 0}
                    childTables={
                      <InvoiceLineTable
                        finalized={invoice?.finalized}
                        invoiceLines={invoice?.invoice_lines}
                        editInvoice={editInvoice}
                        editLoading={loading}
                        editable={false}
                      />
                    }
                    rowId={invoice.id}
                    openRowId={openRowId}
                    setOpenRowId={setOpenRowId}
                  >
                    <td>
                      <span>
                        {invoice.invoice_lines.length > 0 && (
                          <FontAwesomeIcon
                            aria-hidden="true"
                            icon={
                              invoice.id === openRowId
                                ? faChevronDown
                                : faChevronRight
                            }
                            className="me-1"
                          />
                        )}
                        {invoice.id}
                      </span>
                    </td>
                    <td
                      className="text-decoration-underline link-underline-opacity-10-hover"
                      onClick={(e) => e.stopPropagation()}
                      role="button"
                      tabIndex={0}
                    >
                      <OverlayTrigger
                        placement="top"
                        overlay={
                          <Tooltip id={`${tooltipId}-inv`}>
                            Click to view invoice
                          </Tooltip>
                        }
                      >
                        <a
                          href={`/invoice/${invoice.id}`}
                          className="text-decoration-underline link-underline-opacity-10-hover"
                          aria-label={`View invoice for ${invoice.customer?.first_name} ${invoice.customer?.last_name}`}
                        >
                          {invoice.customer?.first_name}{' '}
                          {invoice.customer?.last_name}
                        </a>
                      </OverlayTrigger>
                    </td>
                    <td>{invoice.date}</td>
                    <td>{formatEuro(Number(invoice.total)) || 0}</td>
                    <td className="" aria-live="polite">
                      {invoice.paid ? (
                        <span className="badge text-success bg-success-subtle">
                          Paid
                        </span>
                      ) : invoice.finalized && !invoice.paid ? (
                        <span className="badge bg-warning-subtle text-warning-emphasis">
                          Unpaid
                        </span>
                      ) : (
                        <span className="badge bg-dark-subtle text-dark">
                          Draft
                        </span>
                      )}
                    </td>

                    <td>
                      {isOverdueAndUnpaid ? (
                        <OverlayTrigger
                          placement="left"
                          overlay={
                            <Tooltip id={`${tooltipId}-overdue`}>
                              This invoice is overdue
                            </Tooltip>
                          }
                        >
                          <span className="badge bg-danger-subtle text-danger">
                            {invoice.deadline}
                          </span>
                        </OverlayTrigger>
                      ) : invoice.deadline === todayDateString ? (
                        <OverlayTrigger
                          placement="left"
                          overlay={
                            <Tooltip id={`${tooltipId}-today`}>
                              This invoice is due today
                            </Tooltip>
                          }
                        >
                          <span className="badge bg-warning text-black ">
                            Today
                          </span>
                        </OverlayTrigger>
                      ) : invoice.deadline ? (
                        invoice.deadline
                      ) : (
                        '--/--'
                      )}
                    </td>

                    <td
                      role="button"
                      tabIndex={0}
                      onClick={(e) => {
                        e.stopPropagation()
                        setSelectedInvoice(invoice)
                      }}
                    >
                      <MenuDropdown
                        menuList={buildMenuList(invoice)}
                        title="Menu"
                        openDropdownId={String(openDropdownId)}
                        setOpenDropdownId={setOpenDropdownId}
                        id={String(invoice.id)}
                      />
                    </td>
                  </NestedRow>
                )
              })}
            </tbody>
          </NestedTable>
        </section>
      )}

      {ConfirmationModalToggle.isOpen && selectedInvoice && actionType && (
        <PayAndFinalizeModal
          actionType={actionType}
          editInvoice={editInvoice}
          loading={editLoading}
          invoice={selectedInvoice}
          setSelectedInvoice={setSelectedInvoice}
          modalHandler={ConfirmationModalToggle}
        />
      )}
      {isOpen && selectedInvoice && (
        <ConfirmationModal
          onClose={onClose}
          isOpen={isOpen}
          title="Delete Invoice"
          warningText={
            <span>
              Are you sure you want to delete{' '}
              <strong>
                {selectedInvoice?.customer?.first_name}{' '}
                {selectedInvoice?.customer?.last_name}'s{' '}
              </strong>
              invoice? This action is irreversible!
            </span>
          }
          btnLoading={loading}
          onClick={() =>
            deleteInvoice({
              id: selectedInvoice?.id,
              callback: () => onClose(),
            })
          }
        />
      )}
    </>
  )
}

export default InvoicesList
