import { Components } from 'api/gen/client'
import useManageInvoices from 'hooks/useManageInvoices'
import { useState } from 'react'
import { Invoice } from 'types'
import ModalWrapper, { ModalInterface } from '..'
import AddProductComponent from './AddProductComponent'
import AddProductsComponent from './AddProducts'

interface Props extends ModalInterface {
  invoice: Invoice
  onSuccess?: () => void
  refetch: (val: number) => void
}
//use this fot invoice page
const AddProductsModal = ({
  isOpen,
  closeModal,
  invoice,
  refetch,
  onSuccess,
}: Props) => {
  const [invoice_lines_attributes, setInvoiceLinesAttributes] = useState<
    Components.Schemas.InvoiceLineUpdatePayload[]
  >([])

  const { editInvoice, loading } = useManageInvoices()
  return (
    <ModalWrapper
      title="Add Products to Invoice"
      size="xl"
      isOpen={isOpen}
      buttonText="Save Changes"
      closeModal={closeModal}
      btnLoading={loading}
      btnDisabled={invoice_lines_attributes.length === 0}
      onClick={() => {
        editInvoice({
          id: invoice?.id,
          data: {
            invoice: {
              id: invoice.id,
              invoice_lines_attributes: invoice_lines_attributes,
            },
          },
          onSuccessCallback: () => {
            refetch(invoice?.id)
            onSuccess?.()
            closeModal()
          },
        })
      }}
    >
      <section className="w-full">
        <AddProductsComponent
          invoice_lines_attributes={invoice_lines_attributes}
          setInvoiceLinesAttributes={setInvoiceLinesAttributes}
          showPrompt
        />
        <section className="py-2">
          <AddProductComponent
            handleAddProductToList={setInvoiceLinesAttributes}
          />
        </section>
      </section>
    </ModalWrapper>
  )
}

export default AddProductsModal
