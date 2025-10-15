import React from 'react'
import { Spinner } from 'react-bootstrap'

interface LoaderProps {
  message?: string
}

const PageLoader: React.FC<LoaderProps> = ({ message = 'Please wait...' }) => {
  return (
    <div
      className="page-loader d-flex flex-column justify-content-center align-items-center"
      aria-live="polite"
    >
      <Spinner
        animation="border"
        role="status"
        className="loader-spinner mb-3"
        aria-label={message}
      />
      <span className="">{message}</span>
    </div>
  )
}

export default PageLoader
