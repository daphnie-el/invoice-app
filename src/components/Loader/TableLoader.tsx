import Placeholder from 'react-bootstrap/Placeholder'

function TableLoader({
  size,
  rows = 3,
}: {
  size?: 'sm' | 'lg'
  rows?: number
}) {
  return (
    <section aria-live="polite" aria-label="Fetching data">
      {Array.from({ length: rows }).map((_, idx) => (
        <Placeholder as="p" animation="glow" key={idx}>
          <Placeholder xs={12} size={size} />
        </Placeholder>
      ))}
    </section>
  )
}

export default TableLoader
