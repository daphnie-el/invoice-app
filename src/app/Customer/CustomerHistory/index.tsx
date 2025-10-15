import PageLoader from 'components/Loader/PageLoader'
import { lazy, Suspense } from 'react'

const CustomerInvoiceHistory = lazy(() => import('./customer'))
const CustomerInvoiceHistoryLazy = () => {
  return (
    <Suspense
      fallback={<PageLoader message="loading customer invoice history" />}
    >
      <CustomerInvoiceHistory />
    </Suspense>
  )
}

export default CustomerInvoiceHistoryLazy
