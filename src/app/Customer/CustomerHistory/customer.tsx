import { faFileInvoice } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import InvoicesList from 'app/Invoice/components/InvoicesList'
import DatePicker from 'components/DatePicker'
import EmptyState from 'components/EmptyState'
import PageContainer from 'components/PageContainer'
import PaginationComponent from 'components/Pagination/Index'
import CustomSelect, { paidStatusOptions } from 'components/Select'
import ProductAutocomplete from 'components/Select/ProductAutocomplete'
import { useFilters } from 'hooks/useFilters'
import useManageInvoices from 'hooks/useManageInvoices'
import { Button, Card, Col, Row } from 'react-bootstrap'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { FieldEnum, FilterProps, Operator } from 'types'

const CustomerInvoiceHistory = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const _filters: FilterProps[] = [
    {
      field: FieldEnum.CUSTOMER_ID,
      operator: Operator.EQ,
      value: Number(id),
    },
  ]
  const {
    filters,
    product,
    paidStatus,
    handleProductChange,
    handleStatusChange,
    dateField,
    handleDateChange,
  } = useFilters(_filters)
  const {
    invoicesList,
    loading,
    editInvoice,
    deleteInvoice,
    fetching,
    page,
    setPage,
    totalPages,
    error,
    totalEntries,
  } = useManageInvoices(filters)

  const location = useLocation()

  const customerInfo =
    location.state || (invoicesList && invoicesList?.[0]?.customer!)

  console.log({ customerInfo, location })

  return (
    <PageContainer
      title={
        invoicesList?.length > 0 && !loading
          ? `${customerInfo?.first_name} ${customerInfo?.last_name}`
          : 'User has no records'
      }
    >
      <section>
        <Row className="align-items-stretch">
          <Col xs={12} md={6} className="mb-3">
            <Card
              className="shadow-sm border-0 h-100"
              role="region"
              aria-label="Customer Information"
            >
              <Card.Body>
                <Card.Title>Customer Info</Card.Title>
                <Card.Text>
                  <strong>Name:</strong>{' '}
                  {`${customerInfo?.first_name} ${customerInfo?.last_name}` ||
                    '-'}{' '}
                </Card.Text>
                <Card.Text>
                  <strong>Address:</strong>{' '}
                  {customerInfo
                    ? `${customerInfo?.address}, ${customerInfo?.city}.`
                    : '-'}
                </Card.Text>
                <Card.Text>
                  <strong>Zipcode:</strong> {customerInfo?.zip_code}
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>

          <Col xs={12} md={6} className="mb-3">
            <Card
              className="shadow-sm border-0 text-center h-100"
              role="region"
              aria-label="total number of invoices"
            >
              <Card.Body className="d-flex flex-column justify-content-center">
                <FontAwesomeIcon
                  icon={faFileInvoice}
                  size="2x"
                  className="text-success mb-2"
                />
                <h6 className="text-muted">Total Invoices</h6>
                <h4 className="fw-bold">{totalEntries}</h4>
              </Card.Body>
            </Card>
          </Col>
        </Row>
        {!invoicesList?.length && !fetching ? (
          <EmptyState
            title={error?.label || 'No record found'}
            info={error?.value || `This user has no invoices`}
          >
            <section className="d-flex justify-content-center">
              {filters.length > 1 ? (
                <Button
                  onClick={() => {
                    handleDateChange(null, FieldEnum.DATE)
                    handleProductChange(null)
                    handleStatusChange(null)
                  }}
                  variant="primary"
                >
                  Clear Filters
                </Button>
              ) : (
                <Button onClick={() => navigate('/customer')} variant="primary">
                  &#x2190; Back to Customers
                </Button>
              )}
            </section>
          </EmptyState>
        ) : (
          <>
            <section>
              <Row className="d-flex flex-column pb-md-4 flex-md-row gap-2  w-full  align-items-end">
                <Col xs={12} md={'auto'}>
                  <ProductAutocomplete
                    value={product}
                    onChange={handleProductChange}
                    isClearable
                  />
                </Col>

                <Col xs={12} md={'auto'}>
                  <CustomSelect
                    label="Invoice Status"
                    placeholder="Paid/ Due / Draft..."
                    value={
                      paidStatusOptions.find(
                        (elem) => paidStatus === elem.value
                      ) || null
                    }
                    onChange={(val) => handleStatusChange(val?.value ?? null)}
                    options={paidStatusOptions}
                    isClearable
                  />{' '}
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
              </Row>
            </section>
            <h3>Invoice history</h3>
            <InvoicesList
              invoicesList={invoicesList}
              loading={fetching}
              editInvoice={editInvoice}
              editLoading={loading}
              deleteInvoice={deleteInvoice}
              firstPage={page === 1}
            />
            {totalPages > 1 && (
              <PaginationComponent
                currentPage={page}
                totalPages={totalPages}
                setPage={setPage}
              />
            )}
          </>
        )}
      </section>
    </PageContainer>
  )
}

export default CustomerInvoiceHistory
