import { Components, Paths } from 'api/gen/client'
import DatePicker from 'components/DatePicker'
import CustomerAutocomplete from 'components/Select/CustomerAutocomplete'
import useCreateInvoice from 'hooks/useCreateInvoice'
import { useState } from 'react'
import { Col, Container, Row } from 'react-bootstrap'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import { Customer } from 'types'
import ModalWrapper, { ModalInterface } from '..'
import AddProductComponent from '../AddProductModal/AddProductComponent'
import AddProductsComponent from '../AddProductModal/AddProducts'

type InvoiceFormValues = {
  customer_id: number
  date?: Date
  deadline?: Date
}

interface Props extends ModalInterface {
  refetch: () => void
}

const CreateInvoiceModal = ({ isOpen, closeModal, refetch }: Props) => {
  const [invoice_lines_attributes, setInvoiceLinesAttributes] = useState<
    Components.Schemas.InvoiceLineCreatePayload[]
  >([])
  const { control, handleSubmit } = useForm<InvoiceFormValues>({
    defaultValues: {
      customer_id: undefined,
      date: new Date(),
      deadline: undefined,
    },
  })
  const { creating, createInvoice } = useCreateInvoice()
  const [customer, setCustomer] = useState<Customer | null>(null)

  const onSubmit: SubmitHandler<InvoiceFormValues> = (data) => {
    const payload: Paths.PostInvoices.RequestBody = {
      invoice: {
        customer_id: data.customer_id,
        date: data.date?.toISOString(),
        deadline: data.deadline ? data.deadline?.toDateString() : undefined,
        invoice_lines_attributes,
      },
    }
    createInvoice({
      data: payload,
      callback: () => {
        refetch()
        closeModal()
      },
    })
  }

  return (
    <ModalWrapper
      title="Create Invoice"
      isOpen={isOpen}
      closeModal={closeModal}
      size="xl"
      buttonText="Create Invoice"
      btnType="submit"
      btnDisabled={!customer || !invoice_lines_attributes.length}
      onClick={handleSubmit(onSubmit)}
      btnLoading={creating}
    >
      <Container fluid>
        <Row className="g-3 flex-wrap gap-2 gap-3-lg d-flex align-items-end">
          <Col xs={12} md={'auto'}>
            <Controller
              name="customer_id"
              control={control}
              rules={{ required: 'Please select a client' }}
              render={({ field }) => (
                <CustomerAutocomplete
                  value={customer}
                  onChange={(val) => {
                    field.onChange(val?.id)
                    setCustomer(val)
                  }}
                  isClearable
                  required
                />
              )}
            />
          </Col>
          <Col xs={12} md={'auto'}>
            <Controller
              name="date"
              control={control}
              render={({ field }) => (
                <DatePicker
                  required
                  onChange={field.onChange}
                  maxDate={new Date()}
                  selected={field.value}
                />
              )}
            />
          </Col>
          <Col xs={12} md={'auto'}>
            <Controller
              name="deadline"
              control={control}
              render={({ field }) => (
                <DatePicker
                  label="Choose a deadline"
                  onChange={field.onChange}
                  minDate={new Date()}
                  selected={field.value}
                />
              )}
            />
          </Col>
        </Row>

        <section className="w-full mt-2 ">
          <hr />
          <p className="fw-semibold">Product Details</p>
          <AddProductsComponent<Components.Schemas.InvoiceLineCreatePayload>
            invoice_lines_attributes={invoice_lines_attributes}
            setInvoiceLinesAttributes={setInvoiceLinesAttributes}
            showPrompt
          />
        </section>

        <section className="py-2">
          <AddProductComponent
            handleAddProductToList={setInvoiceLinesAttributes}
          />
        </section>
      </Container>
    </ModalWrapper>
  )
}

export default CreateInvoiceModal
