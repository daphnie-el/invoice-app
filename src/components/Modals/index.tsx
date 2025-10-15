import ButtonWithLoader from 'components/Button'
import React from 'react'
import Button from 'react-bootstrap/Button'
import { Variant } from 'react-bootstrap/esm/types'
import Modal from 'react-bootstrap/Modal'

export interface ModalInterface {
  isOpen: boolean
  closeModal: () => void
  btnLoading?: boolean
}

interface ModalWrapperProps extends ModalInterface {
  buttonText?: string
  children: React.ReactNode
  title: string
  onClick?: () => void
  showSaveButton?: boolean
  btnDisabled?: boolean
  fullscreen?: string | true | undefined
  btnVariant?: Variant
  size?: 'sm' | 'lg' | 'xl' | undefined
  btnType?: 'button' | 'submit' | 'reset' | undefined
}

export default function ModalWrapper({
  buttonText = 'Save Changes',
  children,
  closeModal,
  title,
  onClick,
  showSaveButton = true,
  btnLoading,
  isOpen,
  btnVariant,
  btnDisabled,
  size,
  btnType,
  fullscreen = undefined,
}: ModalWrapperProps) {
  return (
    <Modal
      show={isOpen}
      onHide={closeModal}
      size={size}
      centered
      fullscreen={fullscreen}
    >
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>

      <Modal.Body>{children}</Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={closeModal}>
          Close
        </Button>
        {showSaveButton && (
          <ButtonWithLoader
            loading={btnLoading}
            variant={btnVariant || 'primary'}
            onClick={onClick}
            disabled={btnDisabled}
            type={btnType}
            className={`${btnDisabled ? 'cursor-not-allowed' : ''}`}
          >
            {buttonText}
          </ButtonWithLoader>
        )}
      </Modal.Footer>
    </Modal>
  )
}
