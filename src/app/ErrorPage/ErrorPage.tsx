import PageError from 'assets/page-error.svg'
import { Button, Col, Container } from 'react-bootstrap'
import { useNavigate, useRouteError } from 'react-router-dom'

interface TError {
  statusText?: string
  message?: string
}

const ErrorPage = () => {
  const error = useRouteError() as TError
  const navigate = useNavigate()

  return (
    <Container
      fluid
      className="d-flex flex-column justify-content-center align-items-center vh-100 text-center gap-3"
    >
      <img
        src={PageError}
        alt="Illustration indicating an error occurred"
        className="img-fluid"
      />

      <div>
        <p className="fs-3 fw-bold">Oops!</p>
        <p className="fs-6 fw-medium">
          Sorry, an unexpected error has occurred.
        </p>

        {error && (
          <Container fluid>
            <Col xs={12} md={10} lg={8}>
              <p className="mx-auto px-3 pt-2 text-truncate">
                <i>{error?.statusText || error?.message}</i>
              </p>
            </Col>
          </Container>
        )}
      </div>

      <Button onClick={() => navigate(-1)} variant="primary">
        &#x2190; Go Back
      </Button>
    </Container>
  )
}

export default ErrorPage
