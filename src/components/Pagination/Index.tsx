import { Pagination } from 'react-bootstrap'
type Props = {
  currentPage: number
  setPage: (val: number) => void
  totalPages: number
}
const PaginationComponent = ({ currentPage, setPage, totalPages }: Props) => {
  if (totalPages <= 1) return null

  // Calculate the range of pages to display
  const maxPagesToShow = 5
  let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2))
  let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1)

  // Adjust startPage if endPage is at the maximum
  if (endPage - startPage + 1 < maxPagesToShow) {
    startPage = Math.max(1, endPage - maxPagesToShow + 1)
  }

  const pageItems = []
  for (let page = startPage; page <= endPage; page++) {
    pageItems.push(
      <Pagination.Item
        key={page}
        active={page === currentPage}
        onClick={() => setPage(page)}
      >
        {page}
      </Pagination.Item>
    )
  }

  return (
    <Pagination className="justify-content-center mt-3" aria-live="polite">
      <Pagination.First
        onClick={() => setPage(1)}
        disabled={currentPage === 1}
      />
      <Pagination.Prev
        onClick={() => setPage(currentPage - 1)}
        disabled={currentPage === 1}
      />
      {pageItems}
      <Pagination.Next
        onClick={() => setPage(currentPage + 1)}
        disabled={currentPage === totalPages}
      />
      <Pagination.Last
        onClick={() => setPage(totalPages)}
        disabled={currentPage === totalPages}
      />
    </Pagination>
  )
}

export default PaginationComponent
