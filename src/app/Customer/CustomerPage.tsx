import { faPerson } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import EmptyState from 'components/EmptyState'
import Input from 'components/Input'
import SpinningLoader from 'components/Loader/SpinningLoader'
import TableLoader from 'components/Loader/TableLoader'
import PageContainer from 'components/PageContainer'
import PaginationComponent from 'components/Pagination/Index'
import useGetCustomers from 'hooks/useGetCustomers'
import { Button, Card, Col, Row, Table } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'

const CustomerPage = () => {
  const {
    loading,
    customers,
    page,
    setPage,
    searchText,
    setSearchText,
    totalPages,
    totalEntries,
  } = useGetCustomers()
  const navigate = useNavigate()
  return (
    <PageContainer title="Customers">
      <Row>
        <Col>
          <Col sm="12" md={4} className="mb-3">
            <Card className="shadow-sm border-0 py-3  text-center">
              <Card.Body>
                <FontAwesomeIcon
                  icon={faPerson}
                  size="2x"
                  className="text-success mb-2"
                />
                <h6 className="text-muted">Total Customers</h6>
                <h4 className="fw-bold text-success">
                  {loading ? <SpinningLoader /> : totalEntries}
                </h4>
              </Card.Body>
            </Card>
          </Col>
        </Col>
      </Row>
      <Row className="d-block d-md-flex justify-content-md-between align-items-end pb-4">
        <Col sm={12} md={'auto'}>
          <Input
            label="Search Customer"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
        </Col>
        <Col sm={6} md={'auto'}>
          <Button disabled>Add Customer</Button>
        </Col>
      </Row>
      <Row>
        {!customers?.length && !loading ? (
          <EmptyState
            title="No Customer Found"
            info="There are no customer found. Please update your search"
          />
        ) : loading ? (
          <TableLoader />
        ) : (
          <>
            <Table striped responsive hover>
              <thead>
                <tr>
                  <th scope="col">ID</th>
                  <th scope="col">Name</th>
                  <th scope="col">Address</th>
                  <th scope="col">City</th>
                  <th scope="col">Country</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {customers?.map((customer) => (
                  <tr
                    key={customer.id}
                    className="py-1"
                    tabIndex={0}
                    role="button"
                    aria-label={`View invoice history for ${customer?.first_name} ${customer?.last_name}`}
                    onClick={() =>
                      navigate(`${customer?.id}`, {
                        state: customer,
                      })
                    }
                    onKeyDown={(e) =>
                      e.key === 'Enter' && navigate(`${customer?.id}`)
                    }
                  >
                    <td>{customer.id}</td>
                    <td>{`${customer.first_name} ${customer.last_name}`}</td>

                    <td>{customer.address}</td>
                    <td>{customer.city}</td>
                    <td>{customer.country}</td>
                    <td>
                      <Button variant="outline-primary">View</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
            {totalPages > 1 && (
              <PaginationComponent
                currentPage={page}
                totalPages={totalPages}
                setPage={setPage}
              />
            )}
          </>
        )}
      </Row>
    </PageContainer>
  )
}

export default CustomerPage
