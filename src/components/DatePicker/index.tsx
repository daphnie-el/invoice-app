// components/DatePicker.tsx
import React from 'react'
import ReactDatePicker, { ReactDatePickerProps } from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'

interface DatePickerProps extends ReactDatePickerProps {
  error?: string
  required?: boolean
  label?: string
}

const DatePicker: React.FC<DatePickerProps> = ({
  error,
  required = false,
  className,
  label = 'Select Purchase Date',
  ...rest
}) => {
  return (
    <div
      className="d-flex flex-column"
      style={{
        maxWidth: 'none',
        minWidth: '200px',
      }}
    >
      <label
        className="text-secondary text-xs mb-1 text-uppercase"
        htmlFor="datepicker"
      >
        {label} {required && <span className="text-danger">*</span>}
      </label>
      <ReactDatePicker
        {...rest}
        required={required}
        className={`form-control ${error ? 'is-invalid' : ''} ${
          className || ''
        }`}
      />
      {error && <span className="text-danger text-xxs mt-1">{error}</span>}
    </div>
  )
}

export default DatePicker
