import ButtonWithLoader from 'components/Button'
import Input from 'components/Input'
import ProductAutocomplete from 'components/Select/ProductAutocomplete'
import { useState } from 'react'
import { Container } from 'react-bootstrap'
import { InvoiceLineType, Product } from 'types'
import { totalProductPrice } from 'utils'

type Props<T extends InvoiceLineType> = {
  handleAddProductToList: React.Dispatch<React.SetStateAction<T[]>>
}
const AddProductComponent = <T extends InvoiceLineType>({
  handleAddProductToList,
}: Props<T>) => {
  const [product, setProduct] = useState<Product | null>(null)
  const [quantity, setQuantity] = useState<string>('')

  const resetFields = () => {
    setQuantity('')
    setProduct(null)
  }

  return (
    <Container
      fluid
      className="d-flex w-100 flex-column flex-md-row gap-2 gap-md-2 gap-lg-4 align-items-md-end flex-md-wrap flex-lg-nowrap"
    >
      <ProductAutocomplete
        onChange={(val) => {
          setProduct(val)
        }}
        value={product}
        isClearable
        required
      />

      <Input
        label={`Quantity ${product ? product.unit : ''}`}
        type="text"
        name="quantity"
        value={quantity}
        required
        onChange={(e) => {
          const cleaned = e.target.value.replace(/[^0-9]/g, '')
          setQuantity(cleaned)
        }}
        placeholder="Enter qty"
        error={!quantity ? 'Please enter a quantity. ' : ''}
      />

      {product && (
        <Input
          minWidth="90px"
          type="text"
          value={product?.unit_price}
          disabled
          readOnly
          label="Unit Price(EUR)"
        />
      )}
      {quantity && product && (
        <Input
          minWidth="90px"
          readOnly
          label="amount(EUR)"
          type="text"
          value={totalProductPrice(quantity, product?.unit_price as string)}
        />
      )}
      <section className="pt-1 pt-md-0">
        <ButtonWithLoader
          disabled={!quantity || !product}
          variant="info"
          title={
            !product || !quantity
              ? 'Select a product and enter a valid quantity'
              : ''
          }
          onClick={() => {
            if (!product) return
            handleAddProductToList((prev) => {
              const newProduct = {
                product_id: product?.id,
                quantity: Number(quantity),
                label: product?.label,
              } as T
              return [...prev, newProduct]
            })

            resetFields()
          }}
        >
          Add
        </ButtonWithLoader>
      </section>
    </Container>
  )
}

export default AddProductComponent
