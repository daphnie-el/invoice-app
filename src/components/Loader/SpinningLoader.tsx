import { Spinner } from 'react-bootstrap'

const SpinningLoader = () => {
  return (
    <section aria-hidden="true">
      <Spinner animation="border" size="sm" aria-hidden="true" />
    </section>
  )
}

export default SpinningLoader
