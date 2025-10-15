import PageLoader from 'components/Loader/PageLoader'
import { lazy, Suspense } from 'react'

const InvoicePage = lazy(() => import('./InvoiceDashboard'))
const InvoicePageLazy = () => {
  return (
    <Suspense fallback={<PageLoader message="Loading invoices" />}>
      <InvoicePage />
    </Suspense>
  )
}

export default InvoicePageLazy
