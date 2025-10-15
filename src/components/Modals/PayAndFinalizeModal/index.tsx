import ConfirmationModal from 'components/Modals/ConfirmationModal'
import React from 'react'
import { EditInvoiceProps, Invoice, InvoiceAction } from 'types'

type Props = {
  loading: boolean | undefined
  actionType: InvoiceAction
  invoice: Invoice
  setSelectedInvoice?: (val: React.SetStateAction<Invoice | null>) => void
  editInvoice: (val: EditInvoiceProps) => Promise<void>
  onSuccess?: () => void
  modalHandler: {
    isOpen: boolean
    onOpen: () => void
    onClose: () => void
    onToggle: () => void
  }
}

const PayAndFinalizeModal = ({
  modalHandler,
  actionType,
  loading,
  invoice,
  editInvoice,
  setSelectedInvoice,
  onSuccess,
}: Props) => {
  const handleInvoiceAction = () => {
    if (!invoice) return

    const payload: EditInvoiceProps = {
      id: invoice.id,
      data: {
        invoice: {
          id: invoice.id,
          [actionType]: true,
        },
      },

      onSuccessCallback: () => {
        onSuccess?.()
        setSelectedInvoice?.(null)
        modalHandler.onClose()
      },
      successMessage:
        actionType === 'finalized'
          ? 'Payment finalized'
          : 'Payment completed successfully',
    }

    editInvoice(payload)
  }
  return (
    <ConfirmationModal
      onClose={modalHandler.onClose}
      isOpen={modalHandler.isOpen}
      title={actionType === 'paid' ? 'Confirm Payment' : 'Confirm Finalization'}
      warningText={
        actionType === 'paid'
          ? 'Are you sure you want to mark this payment as collected? This action cannot be undone.'
          : 'Are you sure you want to finalize this invoice? This action cannot be undone.'
      }
      btnLoading={loading}
      onClick={() => handleInvoiceAction()}
    />
  )
}

export default PayAndFinalizeModal
