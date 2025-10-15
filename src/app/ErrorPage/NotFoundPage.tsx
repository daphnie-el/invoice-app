import PageError from 'assets/error_warning.svg'
import PageContainer from 'components/PageContainer'
import { Button, Container } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
export default function NotFoundPage() {
  const navigate = useNavigate()
  return (
    <PageContainer title="Page Not Found">
      <Container
        fluid
        className="d-flex flex-column justify-content-center align-items-center pt-3 mt-lg-3 pt-lg-5 text-center gap-3"
      >
        <img
          src={PageError}
          alt="Illustration indicating an error occurred"
          className="img-fluid"
        />

        <div>
          <p className="fs-3 fw-bold">Page Not Found (404)</p>
          <p className="fs-6 fw-medium">
            Hmm… looks like you’re lost. Let’s get you back on track.
          </p>
        </div>

        <Button onClick={() => navigate(-1)} variant="primary">
          &#x2190; Go Back
        </Button>
      </Container>
    </PageContainer>
  )
}
