import PageLoader from 'components/Loader/PageLoader'
import { lazy, Suspense } from 'react'

const InvoicePage = lazy(() => import('./Invoice'))
const InvoicePageLazy = () => {
  return (
    <Suspense fallback={<PageLoader />}>
      <InvoicePage />
    </Suspense>
  )
}

export default InvoicePageLazy
