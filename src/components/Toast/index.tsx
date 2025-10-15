import { useState } from 'react'
import { ToastContainer } from 'react-bootstrap'
import Toast from 'react-bootstrap/Toast'
import { VariantEnum } from 'types'

type ToastProps = {
  message: string
  variant: VariantEnum
}
export default function ToastNotification({ message, variant }: ToastProps) {
  const [show, setShow] = useState(true)
  return (
    <ToastContainer className="p-3" position="top-end" style={{ zIndex: 100 }}>
      <Toast
        className="d-inline-block m-1"
        bg={variant.toLowerCase()}
        show={show}
        onClose={() => setShow(false)}
        delay={10000} // 10 seconds = 10000ms
        autohide
      >
        <Toast.Header>
          <strong className="me-auto text-capitalize">
            {variant === 'Danger' ? 'Error' : variant}
          </strong>
        </Toast.Header>
        <Toast.Body className="text-white">{message}</Toast.Body>
      </Toast>
    </ToastContainer>
  )
}
