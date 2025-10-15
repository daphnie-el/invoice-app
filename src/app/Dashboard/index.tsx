import PageLoader from 'components/Loader/PageLoader'
import { lazy, Suspense } from 'react'

const Dashboard = lazy(() => import('./DashboardPage'))
const DashboardPageLazy = () => {
  return (
    <Suspense fallback={<PageLoader message="loading dashboard" />}>
      <Dashboard />
    </Suspense>
  )
}

export default DashboardPageLazy
