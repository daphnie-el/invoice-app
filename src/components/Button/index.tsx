import React from 'react'
import Button, { ButtonProps } from 'react-bootstrap/Button'
import Spinner from 'react-bootstrap/Spinner'

interface ButtonWithLoaderProps extends ButtonProps {
  loading?: boolean
}

const ButtonWithLoader: React.FC<ButtonWithLoaderProps> = ({
  loading = false,
  children,
  disabled,
  ...rest
}) => {
  return (
    <Button
      disabled={disabled || loading}
      {...rest}
      className={`${disabled ? 'cursor-not-allowed' : ''}`}
    >
      {loading && (
        <Spinner
          as="span"
          animation="border"
          size="sm"
          role="status"
          aria-hidden="true"
          className="me-2 "
        />
      )}
      {children}
    </Button>
  )
}

export default ButtonWithLoader
