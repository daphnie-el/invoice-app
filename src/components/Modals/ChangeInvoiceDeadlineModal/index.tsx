import DatePicker from 'components/DatePicker'
import { useState } from 'react'
import { EditInvoiceProps, Invoice } from 'types'
import ModalWrapper, { ModalInterface } from '..'

interface Props extends ModalInterface {
  invoice: Invoice
  editInvoice: (val: EditInvoiceProps) => Promise<void>
  loading: boolean
  onSuccess?: () => void
  refetch: () => void
}

const ChangeInvoiceDeadlineModal = ({
  closeModal,
  isOpen,
  loading,
  invoice,
  editInvoice,
  refetch,
}: Props) => {
  const [val, setVal] = useState<Date | null>(
    invoice?.deadline ? new Date(invoice.deadline) : null
  )
  const handleInvoiceAction = () => {
    if (!invoice) return

    const payload: EditInvoiceProps = {
      id: invoice.id,
      data: {
        invoice: {
          id: invoice.id,
          deadline: val?.toDateString(),
        },
      },
      onSuccessCallback: () => {
        refetch?.()
        closeModal()
      },
    }
    editInvoice(payload)
  }
  return (
    <ModalWrapper
      title="Change Deadline"
      closeModal={closeModal}
      buttonText="Update Deadline"
      isOpen={isOpen}
      btnLoading={loading}
      btnDisabled={!val}
      onClick={handleInvoiceAction}
      size="sm"
    >
      <div className="">
        <DatePicker
          label="Choose a deadline"
          onChange={(e) => {
            setVal(e)
          }}
          minDate={new Date()}
          selected={val}
        />
      </div>
    </ModalWrapper>
  )
}

export default ChangeInvoiceDeadlineModal
