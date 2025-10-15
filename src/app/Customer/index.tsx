import PageLoader from 'components/Loader/PageLoader'
import { lazy, Suspense } from 'react'

const CustomerPage = lazy(() => import('./CustomerPage'))
const CustomerPageLazy = () => {
  return (
    <Suspense fallback={<PageLoader message="loading customer page" />}>
      <CustomerPage />
    </Suspense>
  )
}

export default CustomerPageLazy
