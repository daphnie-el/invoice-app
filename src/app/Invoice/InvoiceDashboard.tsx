import DatePicker from 'components/DatePicker'
import CreateInvoiceModal from 'components/Modals/CreateInvoiceModal'
import PageContainer from 'components/PageContainer'
import PaginationComponent from 'components/Pagination/Index'
import CustomSelect, { paidStatusOptions } from 'components/Select'
import CustomerAutocomplete from 'components/Select/CustomerAutocomplete'
import ProductAutocomplete from 'components/Select/ProductAutocomplete'
import { useDisclosure } from 'hooks/useDisclosure'
import { useFilters } from 'hooks/useFilters'
import useManageInvoices from 'hooks/useManageInvoices'
import { useState } from 'react'
import { Button, Col, Row } from 'react-bootstrap'
import { FieldEnum } from 'types'
import InvoicesList from './components/InvoicesList'

export default function Dashboard() {
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const {
    filters,
    customer,
    product,
    paidStatus,
    handleCustomerChange,
    handleProductChange,
    handleStatusChange,
    clearFilters,
    dateField,
    deadline,
    handleDateChange,
  } = useFilters()
  const {
    invoicesList,
    loading,
    editInvoice,
    deleteInvoice,
    fetching,
    refetch,
    page,
    setPage,
    totalPages,
  } = useManageInvoices(filters)
  const { onClose, isOpen, onOpen } = useDisclosure()

  return (
    <PageContainer title="Invoices">
      <section className="pt-3 pb-2 d-block d-md-flex justify-content-between">
        <div className="d-flex flex-column flex-md-row gap-2 gap-lg-3 w-full">
          <CustomerAutocomplete
            value={customer}
            onChange={handleCustomerChange}
            isClearable
          />

          <CustomSelect
            label="Invoice Status"
            placeholder="Paid/ Due / Draft..."
            value={
              paidStatusOptions.find((elem) => paidStatus === elem.value) ||
              null
            }
            onChange={(val) => handleStatusChange(val?.value ?? null)}
            options={paidStatusOptions}
            isClearable
          />
          <div className="py-0 py-md-4 ">
            <Button
              onClick={() => setIsFilterOpen((prev) => !prev)}
              variant="link"
              className="grow-btn"
              aria-controls="filters-section"
            >
              {isFilterOpen ? ' Hide Filters' : 'More Filters'}
            </Button>
          </div>
        </div>

        <div className="d-none d-md-inline-flex py-md-4">
          <Button className="link-opacity-75-hover h-auto" onClick={onOpen}>
            Create Invoice
          </Button>
        </div>
      </section>

      {isFilterOpen && (
        <section id="filters-section">
          <Row className="d-flex flex-column pb-md-4 flex-md-row gap-2  w-full  align-items-end">
            <Col xs={12} md={'auto'}>
              <ProductAutocomplete
                value={product}
                onChange={handleProductChange}
                isClearable
              />
            </Col>

            <Col xs={12} md={'auto'}>
              <DatePicker
                isClearable
                label="Filter by Date"
                onChange={(e) => {
                  handleDateChange(e, FieldEnum.DATE)
                }}
                selected={dateField}
              />
            </Col>
            <Col xs={12} md={'auto'}>
              <DatePicker
                isClearable
                selected={deadline}
                label="Filter by Deadline"
                onChange={(e) => {
                  handleDateChange(e, FieldEnum.DEADLINE)
                }}
              />
            </Col>
            <Col xs={12} md={'auto'} className="pb-4 pb-md-0">
              <Button
                variant="secondary"
                onClick={() => {
                  clearFilters()
                  setIsFilterOpen(false)
                }}
              >
                Clear Filters
              </Button>
            </Col>
          </Row>
        </section>
      )}
      <>
        <div className="d-md-none pb-4 d-flex justify-content-end ">
          <Button className="link-opacity-75-hover h-auto" onClick={onOpen}>
            Create Invoice
          </Button>
        </div>
      </>
      <section>
        <InvoicesList
          invoicesList={invoicesList}
          loading={fetching}
          editInvoice={editInvoice}
          editLoading={loading}
          deleteInvoice={deleteInvoice}
          firstPage={page === 1}
          clearFilters={() => {
            clearFilters()
            setIsFilterOpen(false)
          }}
        />
        {totalPages > 1 && (
          <PaginationComponent
            currentPage={page}
            totalPages={totalPages}
            setPage={setPage}
          />
        )}
      </section>
      {isOpen && (
        <CreateInvoiceModal
          isOpen={isOpen}
          closeModal={onClose}
          refetch={refetch}
        />
      )}
    </PageContainer>
  )
}
