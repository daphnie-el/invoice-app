import React from 'react'
import { FormControlProps } from 'react-bootstrap'
import Form from 'react-bootstrap/Form'

interface Props {
  label?: string
  error?: string
  minWidth?: string
}
type FormControlInputProps = Props &
  FormControlProps &
  React.InputHTMLAttributes<HTMLInputElement>

const Input = React.forwardRef<HTMLInputElement, FormControlInputProps>(
  ({ label, required, minWidth = '150px', error, ...props }, ref) => {
    return (
      <Form.Group style={{ minWidth: minWidth }}>
        {label && label.trim() !== '' && (
          <Form.Label className="text-secondary text-xs mb-1 text-uppercase">
            {label} {required && <span className="text-danger">*</span>}
          </Form.Label>
        )}
        <Form.Control ref={ref} required={required} {...props} />
      </Form.Group>
    )
  }
)

Input.displayName = 'Input'

export default Input
