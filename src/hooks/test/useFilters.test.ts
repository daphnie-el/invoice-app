import { act, renderHook } from '@testing-library/react'
import { Customer, FieldEnum, FilterProps, Operator, Product } from 'types'
import * as utils from 'utils'
import { useFilters } from '../useFilters'

// Mock the utils module
jest.mock('utils', () => ({
  formatDate: jest.fn(),
  todayDateString: '2024-03-15',
}))

const mockedUtils = utils as jest.Mocked<typeof utils>

describe('useFilters', () => {
  const mockCustomer: Customer = {
    id: 1,
    first_name: 'Test ',
    last_name: 'Customer',
  } as Customer

  const mockProduct: Product = {
    id: 2,
    label: 'Tesla Model S',
    vat_rate: '0',
    unit: 'piece',
    unit_price: '1980',
    unit_price_without_tax: '1800',
    unit_tax: '180',
  } as Product

  beforeEach(() => {
    jest.clearAllMocks()
    mockedUtils.formatDate.mockImplementation((date: Date) => {
      return date.toISOString().split('T')[0]
    })
  })

  describe('Initialization', () => {
    it('should initialize with default state', () => {
      const { result } = renderHook(() => useFilters())

      expect(result.current.filters).toEqual([])
      expect(result.current.customer).toBe(null)
      expect(result.current.product).toBe(null)
      expect(result.current.paidStatus).toBe(null)
      expect(result.current.sort).toEqual([])
      expect(result.current.dateField).toBe(null)
      expect(result.current.deadline).toBe(null)
      expect(typeof result.current.handleCustomerChange).toBe('function')
      expect(typeof result.current.handleProductChange).toBe('function')
      expect(typeof result.current.handleStatusChange).toBe('function')
      expect(typeof result.current.clearFilters).toBe('function')
      expect(typeof result.current.handleSortChange).toBe('function')
      expect(typeof result.current.handleDateChange).toBe('function')
      expect(typeof result.current.setFilters).toBe('function')
    })

    it('should initialize with provided filters', () => {
      const initialFilters: FilterProps[] = [
        {
          field: FieldEnum.CUSTOMER_ID,
          operator: Operator.EQ,
          value: 1,
        },
      ]

      const { result } = renderHook(() => useFilters(initialFilters))

      expect(result.current.filters).toEqual(initialFilters)
    })
  })

  describe('handleCustomerChange', () => {
    it('should add customer filter when customer is selected', () => {
      const { result } = renderHook(() => useFilters())

      act(() => {
        result.current.handleCustomerChange(mockCustomer)
      })

      expect(result.current.customer).toBe(mockCustomer)
      expect(result.current.filters).toEqual([
        {
          field: FieldEnum.CUSTOMER_ID,
          operator: Operator.EQ,
          value: 1,
        },
      ])
    })

    it('should remove customer filter when customer is cleared', () => {
      const initialFilters: FilterProps[] = [
        {
          field: FieldEnum.CUSTOMER_ID,
          operator: Operator.EQ,
          value: 1,
        },
        {
          field: FieldEnum.PAID,
          operator: Operator.EQ,
          value: true,
        },
      ]

      const { result } = renderHook(() => useFilters(initialFilters))

      act(() => {
        result.current.handleCustomerChange(null)
      })

      expect(result.current.customer).toBe(null)
      expect(result.current.filters).toEqual([
        {
          field: FieldEnum.PAID,
          operator: Operator.EQ,
          value: true,
        },
      ])
    })

    it('should replace existing customer filter when new customer is selected', () => {
      const { result } = renderHook(() => useFilters())

      const firstCustomer: Customer = { ...mockCustomer, id: 1 }
      const secondCustomer: Customer = { ...mockCustomer, id: 2 }

      act(() => {
        result.current.handleCustomerChange(firstCustomer)
      })

      expect(result.current.filters).toEqual([
        {
          field: FieldEnum.CUSTOMER_ID,
          operator: Operator.EQ,
          value: 1,
        },
      ])

      act(() => {
        result.current.handleCustomerChange(secondCustomer)
      })

      expect(result.current.customer).toBe(secondCustomer)
      expect(result.current.filters).toEqual([
        {
          field: FieldEnum.CUSTOMER_ID,
          operator: Operator.EQ,
          value: 2,
        },
      ])
    })
  })

  describe('handleProductChange', () => {
    it('should add product filter when product is selected', () => {
      const { result } = renderHook(() => useFilters())

      act(() => {
        result.current.handleProductChange(mockProduct)
      })

      expect(result.current.product).toBe(mockProduct)
      expect(result.current.filters).toEqual([
        {
          field: FieldEnum.PRODUCT_ID,
          operator: Operator.EQ,
          value: 2,
        },
      ])
    })

    it('should remove product filter when product is cleared', () => {
      const initialFilters: FilterProps[] = [
        {
          field: FieldEnum.PRODUCT_ID,
          operator: Operator.EQ,
          value: 2,
        },
        {
          field: FieldEnum.PAID,
          operator: Operator.EQ,
          value: true,
        },
      ]

      const { result } = renderHook(() => useFilters(initialFilters))

      act(() => {
        result.current.handleProductChange(null)
      })

      expect(result.current.product).toBe(null)
      expect(result.current.filters).toEqual([
        {
          field: FieldEnum.PAID,
          operator: Operator.EQ,
          value: true,
        },
      ])
    })

    it('should replace existing product filter when new product is selected', () => {
      const { result } = renderHook(() => useFilters())

      const firstProduct: Product = { ...mockProduct, id: 1 }
      const secondProduct: Product = { ...mockProduct, id: 2 }

      act(() => {
        result.current.handleProductChange(firstProduct)
      })

      expect(result.current.filters).toEqual([
        {
          field: FieldEnum.PRODUCT_ID,
          operator: Operator.EQ,
          value: 1,
        },
      ])

      act(() => {
        result.current.handleProductChange(secondProduct)
      })

      expect(result.current.product).toBe(secondProduct)
      expect(result.current.filters).toEqual([
        {
          field: FieldEnum.PRODUCT_ID,
          operator: Operator.EQ,
          value: 2,
        },
      ])
    })
  })

  describe('handleStatusChange', () => {
    it('should add isPaid filter when isPaid status is selected', () => {
      const { result } = renderHook(() => useFilters())

      act(() => {
        result.current.handleStatusChange('isPaid')
      })

      expect(result.current.paidStatus).toBe('isPaid')
      expect(result.current.filters).toEqual([
        {
          field: FieldEnum.PAID,
          operator: Operator.EQ,
          value: true,
        },
      ])
    })

    it('should add unpaid filter when unpaid status is selected', () => {
      const { result } = renderHook(() => useFilters())

      act(() => {
        result.current.handleStatusChange('unpaid')
      })

      expect(result.current.paidStatus).toBe('unpaid')
      expect(result.current.filters).toEqual([
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
      ])
    })

    it('should add draft filter when draft status is selected', () => {
      const { result } = renderHook(() => useFilters())

      act(() => {
        result.current.handleStatusChange('draft')
      })

      expect(result.current.paidStatus).toBe('draft')
      expect(result.current.filters).toEqual([
        {
          field: FieldEnum.FINALIZED,
          operator: Operator.EQ,
          value: false,
        },
      ])
    })

    it('should add overdue filter when overdue status is selected', () => {
      const { result } = renderHook(() => useFilters())

      act(() => {
        result.current.handleStatusChange('overdue')
      })

      expect(result.current.paidStatus).toBe('overdue')
      expect(result.current.filters).toEqual([
        {
          field: FieldEnum.PAID,
          operator: Operator.EQ,
          value: false,
        },
        {
          field: FieldEnum.DEADLINE,
          operator: Operator.LTEQ,
          value: '2024-03-15',
        },
      ])
    })

    it('should add dueToday filter when dueToday status is selected', () => {
      const { result } = renderHook(() => useFilters())

      act(() => {
        result.current.handleStatusChange('dueToday')
      })

      expect(result.current.paidStatus).toBe('dueToday')
      expect(result.current.filters).toEqual([
        {
          field: FieldEnum.PAID,
          operator: Operator.EQ,
          value: false,
        },
        {
          field: FieldEnum.DEADLINE,
          operator: Operator.EQ,
          value: '2024-03-15',
        },
      ])
    })

    it('should clear status filters when null is passed', () => {
      const initialFilters: FilterProps[] = [
        {
          field: FieldEnum.PAID,
          operator: Operator.EQ,
          value: true,
        },
        {
          field: FieldEnum.CUSTOMER_ID,
          operator: Operator.EQ,
          value: 1,
        },
      ]

      const { result } = renderHook(() => useFilters(initialFilters))

      act(() => {
        result.current.handleStatusChange(null)
      })

      expect(result.current.paidStatus).toBe(null)
      expect(result.current.filters).toEqual([
        {
          field: FieldEnum.CUSTOMER_ID,
          operator: Operator.EQ,
          value: 1,
        },
      ])
    })

    it('should handle unknown status values', () => {
      const { result } = renderHook(() => useFilters())

      act(() => {
        result.current.handleStatusChange('unknown')
      })

      expect(result.current.paidStatus).toBe('unknown')
      expect(result.current.filters).toEqual([])
    })

    it('should replace existing status filters when new status is selected', () => {
      const { result } = renderHook(() => useFilters())

      act(() => {
        result.current.handleStatusChange('isPaid')
      })

      expect(result.current.filters).toEqual([
        {
          field: FieldEnum.PAID,
          operator: Operator.EQ,
          value: true,
        },
      ])

      act(() => {
        result.current.handleStatusChange('draft')
      })

      expect(result.current.paidStatus).toBe('draft')
      expect(result.current.filters).toEqual([
        {
          field: FieldEnum.FINALIZED,
          operator: Operator.EQ,
          value: false,
        },
      ])
    })
  })

  describe('handleDateChange', () => {
    it('should add date filter when date is selected', () => {
      const { result } = renderHook(() => useFilters())
      const testDate = new Date('2024-03-20')

      act(() => {
        result.current.handleDateChange(testDate, FieldEnum.DATE)
      })

      expect(result.current.dateField).toBe(testDate)
      expect(mockedUtils.formatDate).toHaveBeenCalledWith(testDate)
      expect(result.current.filters).toEqual([
        {
          field: FieldEnum.DATE,
          operator: Operator.EQ,
          value: '2024-03-20',
        },
      ])
    })

    it('should add deadline filter when deadline is selected', () => {
      const { result } = renderHook(() => useFilters())
      const testDate = new Date('2024-04-15')

      act(() => {
        result.current.handleDateChange(testDate, FieldEnum.DEADLINE)
      })

      expect(result.current.deadline).toBe(testDate)
      expect(mockedUtils.formatDate).toHaveBeenCalledWith(testDate)
      expect(result.current.filters).toEqual([
        {
          field: FieldEnum.DEADLINE,
          operator: Operator.EQ,
          value: '2024-04-15',
        },
      ])
    })

    it('should remove date filter when date is cleared', () => {
      const initialFilters: FilterProps[] = [
        {
          field: FieldEnum.DATE,
          operator: Operator.EQ,
          value: '2024-03-20',
        },
        {
          field: FieldEnum.CUSTOMER_ID,
          operator: Operator.EQ,
          value: 1,
        },
      ]

      const { result } = renderHook(() => useFilters(initialFilters))

      act(() => {
        result.current.handleDateChange(null, FieldEnum.DATE)
      })

      expect(result.current.dateField).toBe(null)
      expect(result.current.filters).toEqual([
        {
          field: FieldEnum.CUSTOMER_ID,
          operator: Operator.EQ,
          value: 1,
        },
      ])
    })

    it('should replace existing date filter when new date is selected', () => {
      const { result } = renderHook(() => useFilters())
      const firstDate = new Date('2024-03-20')
      const secondDate = new Date('2024-03-25')

      act(() => {
        result.current.handleDateChange(firstDate, FieldEnum.DATE)
      })

      expect(result.current.filters).toEqual([
        {
          field: FieldEnum.DATE,
          operator: Operator.EQ,
          value: '2024-03-20',
        },
      ])

      act(() => {
        result.current.handleDateChange(secondDate, FieldEnum.DATE)
      })

      expect(result.current.dateField).toBe(secondDate)
      expect(result.current.filters).toEqual([
        {
          field: FieldEnum.DATE,
          operator: Operator.EQ,
          value: '2024-03-25',
        },
      ])
    })
  })

  describe('clearFilters', () => {
    it('should clear all filters and reset state', () => {
      const initialFilters: FilterProps[] = [
        {
          field: FieldEnum.CUSTOMER_ID,
          operator: Operator.EQ,
          value: 1,
        },
        {
          field: FieldEnum.PAID,
          operator: Operator.EQ,
          value: true,
        },
      ]

      const { result } = renderHook(() => useFilters(initialFilters))

      // Set some state
      act(() => {
        result.current.handleCustomerChange(mockCustomer)
        result.current.handleProductChange(mockProduct)
        result.current.handleStatusChange('isPaid')
        result.current.handleSortChange('name')
      })

      // Clear all filters
      act(() => {
        result.current.clearFilters()
      })

      expect(result.current.filters).toEqual([])
      expect(result.current.customer).toBe(null)
      expect(result.current.product).toBe(null)
      expect(result.current.paidStatus).toBe(null)
      expect(result.current.sort).toEqual([])
    })
  })

  describe('Complex filtering scenarios', () => {
    it('should handle multiple filters simultaneously', () => {
      const { result } = renderHook(() => useFilters())

      act(() => {
        result.current.handleCustomerChange(mockCustomer)
        result.current.handleProductChange(mockProduct)
        result.current.handleStatusChange('unpaid')
        result.current.handleDateChange(new Date('2024-03-20'), FieldEnum.DATE)
      })

      expect(result.current.filters).toEqual([
        {
          field: FieldEnum.CUSTOMER_ID,
          operator: Operator.EQ,
          value: 1,
        },
        {
          field: FieldEnum.PRODUCT_ID,
          operator: Operator.EQ,
          value: 2,
        },
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
        {
          field: FieldEnum.DATE,
          operator: Operator.EQ,
          value: '2024-03-20',
        },
      ])
    })

    it('should preserve non-conflicting filters when updating', () => {
      const { result } = renderHook(() => useFilters())

      act(() => {
        result.current.handleCustomerChange(mockCustomer)
        result.current.handleProductChange(mockProduct)
      })

      expect(result.current.filters).toHaveLength(2)

      act(() => {
        result.current.handleStatusChange('isPaid')
      })

      expect(result.current.filters).toEqual([
        {
          field: FieldEnum.CUSTOMER_ID,
          operator: Operator.EQ,
          value: 1,
        },
        {
          field: FieldEnum.PRODUCT_ID,
          operator: Operator.EQ,
          value: 2,
        },
        {
          field: FieldEnum.PAID,
          operator: Operator.EQ,
          value: true,
        },
      ])
    })

    it('should handle filter conflicts correctly', () => {
      const { result } = renderHook(() => useFilters())

      act(() => {
        result.current.handleStatusChange('isPaid')
      })

      expect(result.current.filters).toEqual([
        {
          field: FieldEnum.PAID,
          operator: Operator.EQ,
          value: true,
        },
      ])

      act(() => {
        result.current.handleStatusChange('unpaid')
      })

      expect(result.current.filters).toEqual([
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
      ])
    })

    it('should maintain referential stability for useState setters', () => {
      const { result, rerender } = renderHook(() => useFilters())

      const firstRenderSetFilters = result.current.setFilters

      rerender()

      // setFilters should maintain reference stability as it's from useState
      expect(result.current.setFilters).toBe(firstRenderSetFilters)

      // Other functions may change as they are not memoized
      expect(typeof result.current.handleCustomerChange).toBe('function')
      expect(typeof result.current.handleProductChange).toBe('function')
      expect(typeof result.current.handleStatusChange).toBe('function')
      expect(typeof result.current.clearFilters).toBe('function')
      expect(typeof result.current.handleSortChange).toBe('function')
      expect(typeof result.current.handleDateChange).toBe('function')
    })
  })

  describe('Edge cases', () => {
    it('should handle empty initial filters array', () => {
      const { result } = renderHook(() => useFilters([]))

      expect(result.current.filters).toEqual([])
    })

    it('should handle undefined initial filters', () => {
      const { result } = renderHook(() => useFilters(undefined))

      expect(result.current.filters).toEqual([])
    })

    it('should handle formatDate being called correctly', () => {
      const { result } = renderHook(() => useFilters())
      const testDate = new Date('2024-03-20')

      act(() => {
        result.current.handleDateChange(testDate, FieldEnum.DATE)
      })

      expect(mockedUtils.formatDate).toHaveBeenCalledWith(testDate)
      expect(result.current.dateField).toBe(testDate)
    })

    it('should handle malformed customer object', () => {
      const { result } = renderHook(() => useFilters())
      const malformedCustomer = { first_name: 'Test' } as Customer

      act(() => {
        result.current.handleCustomerChange(malformedCustomer)
      })

      expect(result.current.customer).toBe(malformedCustomer)
      expect(result.current.filters).toEqual([
        {
          field: FieldEnum.CUSTOMER_ID,
          operator: Operator.EQ,
          value: undefined,
        },
      ])
    })

    it('should handle malformed product object', () => {
      const { result } = renderHook(() => useFilters())
      const malformedProduct = { label: 'Test Product' } as Product

      act(() => {
        result.current.handleProductChange(malformedProduct)
      })

      expect(result.current.product).toBe(malformedProduct)
      expect(result.current.filters).toEqual([
        {
          field: FieldEnum.PRODUCT_ID,
          operator: Operator.EQ,
          value: undefined,
        },
      ])
    })
  })
})
