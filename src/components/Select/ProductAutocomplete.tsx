import { useCallback } from 'react'
import { AsyncPaginate, LoadOptions } from 'react-select-async-paginate'

import { useApi } from 'api'
import { GroupBase } from 'react-select'
import { Product } from 'types'

interface Props {
  value: Product | null
  onChange?: (product: Product | null) => void
  disabled?: boolean
  required?: boolean
  isClearable?: boolean
}

const defaultAdditional = { page: 1 }

const ProductAutocomplete = ({
  value,
  onChange,
  disabled,
  required,
  isClearable,
}: Props) => {
  const api = useApi()

  const loadOptions: LoadOptions<
    Product,
    GroupBase<Product>,
    { page: number }
  > = useCallback(
    async (search, _loadedOptions, additional) => {
      const page = additional?.page ?? 1
      const { data } = await api.getSearchProducts({
        query: search,
        per_page: 10,
        page,
      })

      return {
        options: data.products,
        hasMore: data.pagination.page < data.pagination.total_pages,
        additional: {
          page: page + 1,
        },
      }
    },
    [api]
  )

  const customStyles = {
    container: (provided: any) => ({
      ...provided,
      width: '100%',
      minWidth: '0px',
      maxWidth: '100%',
      height: '38px',
    }),
    control: (provided: any) => ({
      ...provided,
      width: '100% !important',
      minWidth: '0px',
      maxWidth: '100%',
      justifyContent: 'space-between',
    }),
    indicatorsContainer: (provided: any) => ({
      ...provided,
      flexShrink: 0, // prevents icon container from forcing width
    }),
    valueContainer: (provided: any) => ({
      ...provided,
      paddingRight: 0, // remove extra padding that causes stretch
    }),
    menu: (provided: any) => ({
      ...provided,
      width: '100%', // menu matches input width
    }),
  }

  return (
    <section
      className="flex-grow-1 flex-md-grow-0"
      style={{
        maxWidth: 'none',
        minWidth: '200px',
      }}
    >
      <label
        className="text-secondary text-xs mb-1 text-uppercase"
        htmlFor="ProductAutocomplete"
      >
        Product {required && <span className="text-danger">*</span>}
      </label>

      <AsyncPaginate
        placeholder="Search a product"
        additional={defaultAdditional}
        value={value}
        onChange={onChange}
        loadOptions={loadOptions}
        isClearable={isClearable}
        styles={customStyles}
        isDisabled={disabled}
        required={required}
      />
    </section>
  )
}

export default ProductAutocomplete
