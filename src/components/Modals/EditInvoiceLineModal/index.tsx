import { Components } from 'api/gen/client'
import Input from 'components/Input'
import ProductAutocomplete from 'components/Select/ProductAutocomplete'
import { useState } from 'react'
import { Container } from 'react-bootstrap'
import { InvoiceLine } from 'types'
import { totalProductPrice } from 'utils'
import ModalWrapper, { ModalInterface } from '..'

interface Props extends ModalInterface {
  invoiceLine: InvoiceLine
  updateInvoiceLine: (val: {
    invoiceLineId: number
    updatedItem?: Partial<Components.Schemas.InvoiceLine> | undefined
    callback?: () => void
  }) => void
}

const EditInvoiceLineModal = ({
  closeModal,
  isOpen,
  invoiceLine,
  updateInvoiceLine,
}: Props) => {
  const [quantity, setQuantity] = useState<string>('')
  return (
    <ModalWrapper
      buttonText="Save"
      title="Edit Invoice Line"
      closeModal={closeModal}
      isOpen={isOpen}
      btnDisabled={!quantity}
      onClick={() => {
        const qty = Number(quantity)
        const _price = totalProductPrice(
          quantity,
          invoiceLine?.product?.unit_price
        )
        updateInvoiceLine({
          invoiceLineId: invoiceLine?.id,
          updatedItem: { quantity: qty, price: String(_price) },
          callback: () => closeModal,
        })
      }}
    >
      <Container className="block d-md-flex gap-3 py-2">
        <ProductAutocomplete value={invoiceLine?.product} disabled />
        <Input
          type="text"
          label="quantity"
          name="quantity"
          value={quantity}
          required
          onChange={(e) => {
            const cleaned = e.target.value.replace(/[^0-9]/g, '')
            setQuantity(cleaned)
          }}
          placeholder="Enter qty"
        />
      </Container>
    </ModalWrapper>
  )
}

export default EditInvoiceLineModal
