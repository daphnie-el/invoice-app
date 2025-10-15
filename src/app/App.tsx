import { RouterProvider, createBrowserRouter } from 'react-router-dom'

import InvoicePage from 'app/Invoice/SingleInvoicePage'
import { Toaster } from 'sonner'

import InvoiceDashboard from 'app/Invoice'
import CustomerPage from './Customer'
import CustomerInvoiceHistory from './Customer/CustomerHistory'
import Dashboard from './Dashboard'
import ErrorPage from './ErrorPage/ErrorPage'
import NotFoundPage from './ErrorPage/NotFoundPage'
import SidebarLayout from './Layout/SidebarLayout'

const routes = createBrowserRouter([
  {
    path: '/',
    errorElement: <ErrorPage />,
    element: <SidebarLayout />,
    children: [
      {
        index: true,
        element: <Dashboard />,
      },
      {
        path: 'invoice',
        element: <InvoiceDashboard />,
      },
      { path: 'invoice/:id', element: <InvoicePage /> },
      { path: 'customer', element: <CustomerPage /> },
      { path: 'customer/:id', element: <CustomerInvoiceHistory /> },
      {
        path: '*',
        element: <NotFoundPage />,
      },
    ],
  },
])

function App() {
  return (
    <>
      <RouterProvider router={routes} />
      <Toaster closeButton position="top-center" richColors />
    </>
  )
}

export default App
