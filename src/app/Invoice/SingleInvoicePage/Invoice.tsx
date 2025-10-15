import { useNavigate, useParams } from 'react-router'

import InvoiceLineTable from 'app/Invoice/components/InvoiceLineTable'
import EmptyState from 'components/EmptyState'
import PageLoader from 'components/Loader/PageLoader'
import AddProductsModal from 'components/Modals/AddProductModal'
import ChangeInvoiceDeadlineModal from 'components/Modals/ChangeInvoiceDeadlineModal'
import ConfirmationModal from 'components/Modals/ConfirmationModal'
import PayAndFinalizeModal from 'components/Modals/PayAndFinalizeModal'
import PageContainer from 'components/PageContainer'
import { useDisclosure } from 'hooks/useDisclosure'
import useGetInvoice from 'hooks/useGetInvoice'
import useManageInvoices from 'hooks/useManageInvoices'
import { Button, Card, Col, Container, Row, Table } from 'react-bootstrap'
import { Invoice } from 'types'
import { formatEuro } from 'utils'

const InvoicePage = () => {
  const { id } = useParams<{ id: string }>()
  const { invoice, loading, refetch, actionType, error } = useGetInvoice({
    id: id as string,
  })
  const navigate = useNavigate()
  const payAndFinalizeModalHandler = useDisclosure()
  const handleAddProductModal = useDisclosure()
  const { isOpen, onClose, onOpen } = useDisclosure()
  const {
    isOpen: isDeadlineOpen,
    onOpen: openDeadlineModal,
    onClose: closeDeadlineModal,
  } = useDisclosure()

  const {
    loading: editLoading,
    editInvoice,
    deleteInvoice,
  } = useManageInvoices()

  const { customer, invoice_lines, finalized } = invoice || {}

  const overdue = invoice?.deadline && new Date(invoice?.deadline) < new Date()

  return (
    <>
      {loading ? (
        <PageLoader />
      ) : (
        <PageContainer
          title={
            invoice
              ? `#${invoice?.id}-${customer?.first_name} ${customer?.last_name}`
              : 'Invoice not found'
          }
        >
          {!invoice && !loading ? (
            <EmptyState
              title={error?.label || 'Invoice does not exist'}
              info={error?.value || `There is no invoice wth this id (#${id})`}
            >
              <Button onClick={() => navigate('/invoice')} variant="primary">
                &#x2190; Go to Invoices
              </Button>
            </EmptyState>
          ) : (
            <>
              {/* Invoice & customer Info */}
              <Container fluid className="">
                <Row className="align-align-items-stretch">
                  <Col xs={12} md={6} className="mb-3">
                    <Card className="shadow-sm border-0">
                      <Card.Body>
                        <Card.Title>Invoice #{invoice?.id}</Card.Title>
                        <Card.Text>
                          <strong>Created At:</strong> {invoice?.date} <br />{' '}
                        </Card.Text>
                        <Card.Text>
                          <strong>Deadline:</strong>{' '}
                          {invoice?.deadline || '--/--'}
                        </Card.Text>
                        <Card.Text>
                          <strong>Status:</strong>{' '}
                          {invoice?.paid ? (
                            <span className="badge bg-success">Paid</span>
                          ) : invoice?.finalized ? (
                            overdue ? (
                              <span className="badge bg-danger">Overdue</span>
                            ) : (
                              <span className="badge bg-warning text-dark">
                                Unpaid
                              </span>
                            )
                          ) : (
                            <span className="badge bg-secondary">Draft</span>
                          )}{' '}
                          {overdue && !invoice?.finalized && (
                            <span className="badge bg-danger">Overdue</span>
                          )}
                        </Card.Text>
                      </Card.Body>
                    </Card>
                  </Col>
                  <Col xs={12} md={6} className="mb-3">
                    <Card className="shadow-sm border-0">
                      <Card.Body>
                        <Card.Title>Customer Info</Card.Title>
                        <Card.Text>
                          <strong>Name:</strong>{' '}
                          {`${customer?.first_name} ${customer?.last_name}` ||
                            '-'}{' '}
                        </Card.Text>
                        <Card.Text>
                          <strong>Address:</strong>{' '}
                          {customer
                            ? `${customer?.address},  ${customer?.city}.`
                            : '-'}
                        </Card.Text>
                        <Card.Text>
                          <strong>Zipcode:</strong> {customer?.zip_code}
                        </Card.Text>
                      </Card.Body>
                    </Card>
                  </Col>
                </Row>
              </Container>

              <Container
                fluid
                className=" d-flex gap-3 pt-5 justify-content-end"
              >
                {actionType && !invoice?.paid ? (
                  <Button
                    variant="outline-success"
                    onClick={() => {
                      payAndFinalizeModalHandler.onOpen()
                    }}
                  >
                    <span className="text-capitalize">{`Mark as ${actionType}`}</span>
                  </Button>
                ) : null}
                {invoice?.finalized ? (
                  <Button
                    className="-fit link-opacity-75-hover"
                    variant="outline-primary"
                    onClick={() => {
                      //todo: handle export
                    }}
                  >
                    Export Invoice
                  </Button>
                ) : (
                  <>
                    <Button
                      variant="outline-primary"
                      className="btn"
                      disabled={invoice?.finalized}
                      onClick={openDeadlineModal}
                    >
                      Change Deadline
                    </Button>
                    <Button
                      variant="outline-danger"
                      disabled={invoice?.finalized}
                      onClick={() => {
                        onOpen()
                      }}
                      className=""
                    >
                      Delete Invoice
                    </Button>
                  </>
                )}
              </Container>
              <>
                {invoice_lines?.length === 0 && !loading ? (
                  <Container>
                    <EmptyState
                      title="No products yet"
                      info="Please click on the button below to add products"
                    >
                      <section className="d-flex justify-content-center">
                        {!invoice?.finalized && (
                          <Button
                            variant="primary"
                            className=""
                            onClick={() => {
                              handleAddProductModal.onOpen()
                            }}
                          >
                            + Add Product
                          </Button>
                        )}
                      </section>
                    </EmptyState>
                  </Container>
                ) : (
                  <Container className="my-4" fluid>
                    <Table responsive striped>
                      <InvoiceLineTable
                        invoiceLines={invoice_lines || []}
                        finalized={invoice?.finalized!}
                        editInvoice={editInvoice}
                        editLoading={editLoading}
                        refetch={refetch}
                        editable={true}
                      />
                    </Table>
                    <div className="d-flex flex-column align-items-end border-bottom">
                      {!invoice?.finalized && (
                        <Button
                          variant="primary"
                          className="mt-2 mb-4"
                          onClick={() => {
                            handleAddProductModal.onOpen()
                          }}
                        >
                          + Add Product
                        </Button>
                      )}
                      <section>
                        <p className="text-end">
                          Sub-total:
                          <span className="">
                            {''}{' '}
                            {formatEuro(
                              Number(invoice?.total) - Number(invoice?.tax)
                            )}
                          </span>
                        </p>
                        <p className="text-end">
                          Tax:{' '}
                          <span className="">
                            {' '}
                            {formatEuro(Number(invoice?.tax))}
                          </span>
                        </p>
                      </section>

                      <section>
                        <p className="fw-semibold fs-3 ">
                          Invoice Total{' '}
                          <span className="fw-bold fs-3 border-2 px-2 border-bottom border-top border-black ">
                            {formatEuro(Number(invoice?.total))}
                          </span>
                        </p>
                      </section>
                    </div>
                  </Container>
                )}
              </>
            </>
          )}
        </PageContainer>
      )}
      {payAndFinalizeModalHandler.isOpen && actionType && (
        <PayAndFinalizeModal
          actionType={actionType}
          editInvoice={editInvoice}
          loading={editLoading}
          modalHandler={payAndFinalizeModalHandler}
          invoice={invoice as Invoice}
          onSuccess={refetch}
        />
      )}

      {isOpen && invoice && !finalized && (
        <ConfirmationModal
          onClose={onClose}
          isOpen={isOpen}
          title="Delete Invoice"
          warningText={
            <span>
              Are you sure you want to delete{' '}
              <strong>
                {invoice?.customer?.first_name} {invoice?.customer?.last_name}'s{' '}
              </strong>
              invoice? This action is irreversible!
            </span>
          }
          btnLoading={loading}
          onClick={() =>
            deleteInvoice({
              id: invoice?.id,
              callback: () => {
                navigate('/invoice')
                onClose()
              },
            })
          }
        />
      )}
      {handleAddProductModal.isOpen && invoice && (
        <AddProductsModal
          closeModal={handleAddProductModal.onClose}
          invoice={invoice}
          refetch={refetch}
          isOpen={handleAddProductModal.isOpen}
        />
      )}
      {isDeadlineOpen && !finalized && (
        <ChangeInvoiceDeadlineModal
          editInvoice={editInvoice}
          loading={editLoading}
          invoice={invoice as Invoice}
          refetch={refetch}
          isOpen={isDeadlineOpen}
          closeModal={closeDeadlineModal}
        />
      )}
    </>
  )
}

export default InvoicePage
