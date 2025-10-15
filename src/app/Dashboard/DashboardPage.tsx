import {
  faCheckCircle,
  faCircle,
  faClock,
  faEuro,
  faExclamationTriangle,
  faFileAlt,
  faFileInvoice,
  faInfoCircle,
  faTimesCircle,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import SpinningLoader from 'components/Loader/SpinningLoader'
import PayAndFinalizeModal from 'components/Modals/PayAndFinalizeModal'
import PageContainer from 'components/PageContainer'
import { useDisclosure } from 'hooks/useDisclosure'
import useManageInvoices from 'hooks/useManageInvoices'
import React, { useState } from 'react'
import {
  Button,
  Card,
  Col,
  Container,
  OverlayTrigger,
  Row,
  Table,
  Tooltip,
} from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import { FieldEnum, Invoice, Operator } from 'types'
import { daysOverdue, formatEuro, getTotal, todayDateString } from 'utils'

const _filters = [
  { field: FieldEnum.PAID, operator: Operator.EQ, value: false },
  {
    field: FieldEnum.DEADLINE,
    operator: Operator.LTEQ,
    value: todayDateString,
  },
]
const Dashboard: React.FC = () => {
  const { invoicesList, fetching, loading, editInvoice, totalEntries } =
    useManageInvoices(_filters, 200)
  const payAndFinalizeModalHandler = useDisclosure()
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null)
  const navigate = useNavigate()

  return (
    <PageContainer title="Dashboard">
      <Container fluid className="p-md-4">
        <h4 className="mb-4">
          Revenue Generated (YTD){' '}
          <OverlayTrigger
            placement="top-start"
            overlay={<Tooltip id={'tooltipId-rev'}>Year to Date(2025)</Tooltip>}
          >
            <FontAwesomeIcon
              aria-hidden="true"
              icon={faInfoCircle}
              className="text-xs"
            />
          </OverlayTrigger>
        </h4>
        {/* mock data, no api provided */}
        <Row className="pb-4">
          <Col sm="12" md={4} className="mb-3 mb-md-0">
            <Card className="shadow-sm border-0 text-center">
              <Card.Body>
                <FontAwesomeIcon
                  aria-hidden="true"
                  icon={faEuro}
                  size="2x"
                  className="text-success mb-2"
                />
                <h6 className="text-muted">Revenue Received</h6>
                <h4 className="fw-bold text-success">{formatEuro(17920500)}</h4>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4} className="mb-2 mb-md-0">
            <Card className="shadow-sm border-0 text-center">
              <Card.Body>
                <FontAwesomeIcon
                  aria-hidden="true"
                  icon={faClock}
                  size="2x"
                  className="text-warning mb-2"
                />
                <h6 className="text-muted">Pending</h6>
                <h4 className="fw-bold text-warning">{formatEuro(5430000)}</h4>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4} className="mb-3 mb-md-0">
            <Card className="shadow-sm border-0 text-center">
              <Card.Body>
                <FontAwesomeIcon
                  aria-hidden="true"
                  icon={faExclamationTriangle}
                  size="2x"
                  className="text-danger mb-2"
                />
                <h6 className="text-muted">Overdue</h6>
                <h4 className="fw-bold text-danger">
                  {fetching ? (
                    <SpinningLoader />
                  ) : (
                    formatEuro(getTotal(invoicesList))
                  )}
                </h4>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <h4 className="py-3">
          Invoice Overview (YTD){' '}
          <OverlayTrigger
            placement="top-start"
            overlay={
              <Tooltip id={'tooltipId-invoice-stats'}>
                Invoice statistics for 2025
              </Tooltip>
            }
          >
            <FontAwesomeIcon
              aria-hidden="true"
              icon={faInfoCircle}
              className="text-xs"
            />
          </OverlayTrigger>
        </h4>
        {/* mock data, no api provided */}
        <Row className="mb-4">
          <Col md={3} className="mb-3 mb-md-0">
            <Card className="shadow-sm border-0 text-center">
              <Card.Body>
                <FontAwesomeIcon
                  aria-hidden="true"
                  icon={faFileInvoice}
                  size="2x"
                  className="text-primary mb-2"
                />
                <h6 className="text-muted">Total Invoices</h6>
                <h4 className="fw-bold">200</h4>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3} className="mb-3 mb-md-0">
            <Card className="shadow-sm border-0 text-center">
              <Card.Body>
                <FontAwesomeIcon
                  aria-hidden="true"
                  icon={faFileAlt}
                  size="2x"
                  className="text-secondary mb-2"
                />
                <h6 className="text-muted">Drafts</h6>
                <h4 className="fw-bold">45</h4>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3} className="mb-3 mb-md-0">
            <Card className="shadow-sm border-0 text-center">
              <Card.Body>
                <FontAwesomeIcon
                  icon={faCheckCircle}
                  size="2x"
                  className="text-success mb-2"
                  aria-hidden="true"
                />
                <FontAwesomeIcon
                  icon={faTimesCircle}
                  size="2x"
                  className="text-danger ms-2 mb-2"
                  aria-hidden="true"
                />
                <h6 className="text-muted">Paid / Unpaid</h6>
                <h4 className="fw-bold">
                  <span className="text-success">110</span> /{' '}
                  <span className="text-danger">45</span>
                </h4>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="shadow-sm border-0 text-center">
              <Card.Body>
                <FontAwesomeIcon
                  aria-hidden="true"
                  icon={faExclamationTriangle}
                  size="2x"
                  className="text-danger mb-2"
                />
                <h6 className="text-muted">Overdue</h6>
                <h4 className="fw-bold text-danger">
                  {fetching ? <SpinningLoader /> : totalEntries}
                </h4>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {invoicesList?.length > 0 ? (
          <Card className="shadow-sm border-0 pt-1">
            <Card.Body>
              <h5 className="mb-3">Overdue Invoices</h5>
              <Table striped bordered hover responsive>
                <thead>
                  <tr>
                    <th scope="col">#</th>
                    <th scope="col">Invoice ID</th>
                    <th scope="col">Customer</th>
                    <th scope="col">Date Due</th>
                    <th scope="col">Balance(EUR)</th>
                    <th scope="col">Status</th>
                    <th scope="col" className="">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {invoicesList?.map((invoice, index) => {
                    const tooltipId = `tooltip-${invoice.id}`
                    return (
                      <OverlayTrigger
                        key={invoice.id}
                        placement="top"
                        overlay={
                          <Tooltip id={`${tooltipId}-inv`}>
                            Click to view invoice
                          </Tooltip>
                        }
                      >
                        <tr
                          key={invoice.id}
                          role="button"
                          tabIndex={0}
                          aria-label={`View invoice for ${invoice.customer?.first_name} ${invoice.customer?.last_name}`}
                          onClick={() => navigate(`/invoice/${invoice.id}`)}
                          onKeyDown={(e) =>
                            e.key === 'Enter' &&
                            navigate(`/invoice/${invoice.id}`)
                          }
                        >
                          <td>{index + 1}</td>
                          <td>{invoice.id}</td>
                          <td>
                            {invoice.customer?.first_name}{' '}
                            {invoice.customer?.last_name}
                          </td>
                          <td>{invoice.deadline}</td>
                          <td>{formatEuro(Number(invoice.total)) || 0}</td>
                          <td>
                            <span className="text-danger text-sm">
                              <FontAwesomeIcon
                                icon={faCircle}
                                className="text-xxs"
                                aria-hidden="true"
                              />{' '}
                              {invoice.deadline === todayDateString
                                ? 'Due Today'
                                : `${daysOverdue(
                                    invoice.deadline!
                                  )} days past due`}
                            </span>
                            <span>
                              {' '}
                              {invoice.finalized ? (
                                <span className="badge text-primary bg-primary-subtle">
                                  Finalized
                                </span>
                              ) : (
                                <span className="badge bg-dark-subtle  text-dark">
                                  Draft
                                </span>
                              )}
                            </span>
                          </td>
                          <td
                            role="link"
                            tabIndex={0}
                            onClick={(e) => {
                              e.stopPropagation()
                              setSelectedInvoice(invoice)
                            }}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                e.stopPropagation() // prevent row navigation
                                setSelectedInvoice(invoice)
                              }
                            }}
                          >
                            <Button
                              variant="outline-primary"
                              onClick={() => {
                                payAndFinalizeModalHandler.onOpen()
                              }}
                              onKeyDown={(e) => {
                                if (
                                  e.key === 'Enter' ||
                                  e.key === ' ' ||
                                  e.key === 'Spacebar' ||
                                  e.code === 'Space'
                                ) {
                                  payAndFinalizeModalHandler.onOpen()
                                }
                              }}
                            >
                              <span className="text-capitalize">{`Mark as ${
                                !invoice?.finalized ? 'finalized' : 'paid'
                              }`}</span>
                            </Button>
                          </td>
                        </tr>
                      </OverlayTrigger>
                    )
                  })}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        ) : (
          <section className="text center mx-auto">
            <h2>No Overdue invoices</h2>
          </section>
        )}
      </Container>
      {payAndFinalizeModalHandler.isOpen && selectedInvoice && (
        <PayAndFinalizeModal
          actionType={!selectedInvoice?.finalized ? 'finalized' : 'paid'}
          editInvoice={editInvoice}
          loading={loading}
          modalHandler={payAndFinalizeModalHandler}
          invoice={selectedInvoice}
        />
      )}
    </PageContainer>
  )
}

export default Dashboard
