import { useState } from 'react'
import { Customer, FieldEnum, FilterProps, Operator, Product } from 'types'
import { formatDate, todayDateString } from 'utils'

interface UseFiltersReturn {
  filters: FilterProps[]
  customer: Customer | null
  product: Product | null
  paidStatus: boolean | string | null
  handleCustomerChange: (value: Customer | null) => void
  handleProductChange: (value: Product | null) => void
  handleStatusChange: (value: string | null) => void
  clearFilters: () => void
  handleSortChange: (field: string) => void
  sort: string[]
  dateField: Date | null
  deadline: Date | null
  handleDateChange: (val: Date | null, field: FieldEnum) => void
  setFilters: React.Dispatch<React.SetStateAction<FilterProps[]>>
}

export function useFilters(_filter?: FilterProps[]): UseFiltersReturn {
  const [filters, setFilters] = useState<FilterProps[]>(_filter || [])
  const [customer, setCustomer] = useState<Customer | null>(null)
  const [product, setProduct] = useState<Product | null>(null)
  const [paidStatus, setPaidStatus] = useState<boolean | string | null>(null)
  const [sort, setSort] = useState<string[]>([])
  const [dateField, setDate] = useState<Date | null>(null)
  const [deadline, setDeadline] = useState<Date | null>(null)

  const handleSortChange = (field: string) => {
    setSort((prev) => {
      const existing = prev.find((s) => s.endsWith(field))

      if (!existing) {
        return [...prev, `+${field}`]
      }

      if (existing.startsWith('+')) {
        return prev.map((s) => (s === existing ? `-${field}` : s))
      }

      if (existing.startsWith('-')) {
        return prev.filter((s) => s !== existing)
      }

      return prev
    })
  }

  const handleCustomerChange = (value: Customer | null) => {
    setCustomer(value)
    setFilters((prev) => {
      const otherFilters = prev.filter(
        (filter) => filter.field !== FieldEnum.CUSTOMER_ID
      )
      if (!value) return otherFilters
      return [
        ...otherFilters,
        {
          field: FieldEnum.CUSTOMER_ID,
          operator: Operator.EQ,
          value: value.id,
        },
      ]
    })
  }

  const handleProductChange = (value: Product | null) => {
    setProduct(value)
    setFilters((prev) => {
      const otherFilters = prev.filter(
        (filter) => filter.field !== FieldEnum.PRODUCT_ID
      )
      if (!value) return otherFilters
      return [
        ...otherFilters,
        {
          field: FieldEnum.PRODUCT_ID,
          operator: Operator.EQ,
          value: value.id,
        },
      ]
    })
  }

  const handleStatusChange = (value: string | null) => {
    setPaidStatus(value)

    let _filter: FilterProps[] = []

    switch (value) {
      case 'isPaid':
        _filter = [
          {
            field: FieldEnum.PAID,
            operator: Operator.EQ,
            value: true,
          },
        ]
        break

      case 'unpaid':
        _filter = [
          {
            field: FieldEnum.PAID,
            operator: Operator.EQ,
            value: false,
          },
          {
            field: FieldEnum.FINALIZED,
            operator: Operator.EQ,
            value: true,
          },
        ]
        break

      case 'draft':
        _filter = [
          {
            field: FieldEnum.FINALIZED,
            operator: Operator.EQ,
            value: false,
          },
        ]
        break

      case 'overdue':
        _filter = [
          {
            field: FieldEnum.PAID,
            operator: Operator.EQ,
            value: false,
          },
          {
            field: FieldEnum.DEADLINE,
            operator: Operator.LTEQ,
            value: todayDateString,
          },
        ]
        break

      case 'dueToday':
        _filter = [
          {
            field: FieldEnum.PAID,
            operator: Operator.EQ,
            value: false,
          },
          {
            field: FieldEnum.DEADLINE,
            operator: Operator.EQ,
            value: todayDateString,
          },
        ]
        break

      default:
        _filter = []
    }

    setFilters((prev) => {
      const otherFilters = prev.filter(
        (filter) =>
          filter.field !== FieldEnum.PAID &&
          filter.field !== FieldEnum.FINALIZED &&
          filter.field !== FieldEnum.DEADLINE
      )
      if (value === null) return otherFilters
      return [...otherFilters, ..._filter]
    })
  }
  const handleDateChange = (val: Date | null, field: FieldEnum) => {
    field === FieldEnum?.DATE ? setDate(val) : setDeadline(val)
    setFilters((prev) => {
      const otherFilters = prev.filter((filter) => filter.field !== field)
      if (val === null) return otherFilters
      return [
        ...otherFilters,
        {
          field,
          operator: Operator.EQ,
          value: formatDate(val),
        },
      ]
    })
  }

  const clearFilters = () => {
    setFilters([])
    setCustomer(null)
    setProduct(null)
    setPaidStatus(null)
    setSort([])
    setDeadline(null)
    setDate(null)
  }

  return {
    filters,
    customer,
    product,
    paidStatus,
    handleCustomerChange,
    handleProductChange,
    handleStatusChange,
    clearFilters,
    handleSortChange,
    setFilters,
    sort,
    dateField,
    handleDateChange,
    deadline,
  }
}
