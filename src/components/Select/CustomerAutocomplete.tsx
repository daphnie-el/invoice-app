import { useCallback } from 'react'
import { AsyncPaginate, LoadOptions } from 'react-select-async-paginate'

import { useApi } from 'api'
import { GroupBase } from 'react-select'
import { Customer } from 'types'

interface Props {
  value: Customer | null
  onChange: (Customer: Customer | null) => void
  disabled?: boolean
  required?: boolean
  isClearable?: boolean
  label?: string
}

const defaultAdditional = { page: 1 }

const getCustomerLabel = (customer: Customer) => {
  return `${customer.first_name} ${customer.last_name}`
}

const CustomerAutocomplete = ({
  value,
  onChange,
  isClearable,
  required,
  disabled,
  label = 'Customer',
}: Props) => {
  const api = useApi()

  const loadOptions: LoadOptions<
    Customer,
    GroupBase<Customer>,
    { page: number }
  > = useCallback(
    async (search, _loadedOptions, additional) => {
      const page = additional?.page ?? 1
      const { data } = await api.getSearchCustomers({
        query: search,
        per_page: 10,
        page,
      })

      return {
        options: data.customers,
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
        className="text-secondary text-xs mb-1 text-uppercase "
        htmlFor="CustomerAutocomplete"
      >
        {label} {required && <span className="text-danger">*</span>}
      </label>
      <AsyncPaginate
        placeholder="Search a customer"
        getOptionLabel={getCustomerLabel}
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

export default CustomerAutocomplete
