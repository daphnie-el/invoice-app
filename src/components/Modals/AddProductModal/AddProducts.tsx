import { faLightbulb, faTrash } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Container, Table } from 'react-bootstrap'
import { Invoice, InvoiceLineType } from 'types'
// import AddProduct from './AddProductComponent'

type Props<T extends InvoiceLineType> = {
  invoice?: Invoice
  showPrompt?: boolean
  children?: React.ReactNode
  invoice_lines_attributes: T[]
  setInvoiceLinesAttributes: React.Dispatch<React.SetStateAction<T[]>>
}
const AddProductsComponent = <T extends InvoiceLineType>({
  invoice_lines_attributes,
  children,
  showPrompt,
  setInvoiceLinesAttributes,
}: Props<T>) => {
  const removeProduct = (index: number) => {
    setInvoiceLinesAttributes(
      (prev) => prev.filter((_item, i: number) => i !== index) as typeof prev
    )
  }

  return (
    <Container className="w-full">
      {invoice_lines_attributes.length > 0 ? (
        <Table>
          <thead>
            <tr>
              <th scope="col">Product Name</th>
              <th scope="col">Quantity</th>
              <th scope="col">Delete</th>
            </tr>
          </thead>
          <tbody>
            {invoice_lines_attributes?.map((elem, ind) => {
              return (
                <tr className="" key={elem?.product_id}>
                  <td className="">{elem?.label}</td>
                  <td className="">{elem?.quantity}</td>
                  <td
                    className=""
                    aria-label="remove product button"
                    tabIndex={0}
                    role="button"
                    onClick={() => removeProduct(ind)}
                  >
                    <FontAwesomeIcon
                      icon={faTrash}
                      className="text-danger"
                      aria-hidden="true"
                    />
                  </td>
                </tr>
              )
            })}
          </tbody>
        </Table>
      ) : showPrompt ? (
        <p className="fs-6 fw-semibold">
          <FontAwesomeIcon
            icon={faLightbulb}
            aria-hidden="true"
            className="text-warning animate-flash"
          />{' '}
          Click the 'Add' button to populate product list
        </p>
      ) : null}

      {children}
    </Container>
  )
}

export default AddProductsComponent as <T extends InvoiceLineType>(
  props: Props<T>
) => JSX.Element
