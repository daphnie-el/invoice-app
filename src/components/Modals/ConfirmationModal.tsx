import { faWarning } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import ModalWrapper from '.'
type Props = {
  title?: string
  onClose: () => void
  warningText?: React.ReactNode | string
  btnText?: string
  btnLoading?: boolean
  isOpen: boolean
  onClick: () => void
}

const ConfirmationModal = ({
  title,
  onClose,
  warningText,
  btnText,
  btnLoading,
  onClick,
  isOpen,
}: Props) => {
  return (
    <ModalWrapper
      title={title || 'Confirm Action'}
      closeModal={onClose}
      buttonText={btnText || 'Yes Proceed'}
      btnLoading={btnLoading}
      onClick={onClick}
      isOpen={isOpen}
      btnVariant="danger"
    >
      <div className="p-3 flex-column d-flex justify-content-center align-items-center gap-3">
        <FontAwesomeIcon
          role="img"
          icon={faWarning}
          className="text-danger  pb-3"
          style={{ fontSize: '80px' }}
          aria-label="Warning"
        />
        <p className="fs-6 w-100 px-5 text-center">
          {warningText || 'Are you sure you want to proceed with this action?'}
        </p>
      </div>
    </ModalWrapper>
  )
}

export default ConfirmationModal
