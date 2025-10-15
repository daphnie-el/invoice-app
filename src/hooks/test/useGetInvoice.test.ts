/* eslint-disable @typescript-eslint/no-unused-vars */

import { act, renderHook, waitFor } from '@testing-library/react'
import { useApi } from 'api'
import axios from 'axios'
import { Invoice } from 'types'
import { handleApiError } from 'utils'
import useGetInvoice from '../useGetInvoice'

// Mock dependencies
jest.mock('api', () => ({
  useApi: jest.fn(),
}))

jest.mock('sonner', () => ({
  toast: {
    error: jest.fn(),
  },
}))

jest.mock('utils', () => ({
  handleApiError: jest.fn(),
}))

jest.mock('axios', () => ({
  isAxiosError: jest.fn(),
}))

const mockedUseApi = useApi as jest.MockedFunction<typeof useApi>
const mockedHandleApiError = handleApiError as jest.MockedFunction<
  typeof handleApiError
>
const mockedAxios = axios as jest.Mocked<typeof axios>

describe('useGetInvoice', () => {
  const mockGetInvoice = jest.fn()
  const mockApi = {
    getInvoice: mockGetInvoice,
  }

  const mockInvoiceData: Invoice = {
    id: 1,
    customer_id: 1,
    date: '2024-03-15',
    deadline: '2024-04-15',
    total: '250.00',
    finalized: false,
    paid: false,
    tax: '',
    invoice_lines: [
      {
        id: 1,
        product_id: 1,
        quantity: 2,
        unit: 'day',
        tax: '20.00',
        invoice_id: 1,
        price: '',
        label: '',
        vat_rate: '0',
      },
    ],
  } as Invoice

  const mockFinalizedInvoice: Invoice = {
    ...mockInvoiceData,
    id: 2,
    finalized: true,
    paid: false,
    invoice_lines: [],
  } as Invoice

  const mockPaidInvoice: Invoice = {
    ...mockInvoiceData,
    id: 3,
    finalized: true,
    paid: true,
    invoice_lines: [],
  } as Invoice

  beforeEach(() => {
    jest.clearAllMocks()
    mockedUseApi.mockReturnValue(mockApi as any)
    mockGetInvoice.mockResolvedValue({ data: mockInvoiceData })
  })

  describe('Initialization', () => {
    it('should initialize with correct default state', () => {
      const { result } = renderHook(() => useGetInvoice({ id: '1' }))

      expect(result.current.invoice).toBeUndefined()
      expect(result.current.loading).toBe(true) // Should be loading on mount
      expect(result.current.error).toBe(null)
      expect(result.current.actionType).toBe(null)
      expect(typeof result.current.refetch).toBe('function')
    })

    it('should fetch invoice on mount', async () => {
      renderHook(() => useGetInvoice({ id: '1' }))

      await waitFor(() => {
        expect(mockGetInvoice).toHaveBeenCalledWith('1')
      })
    })
  })

  describe('Invoice fetching', () => {
    it('should fetch and set invoice successfully', async () => {
      const { result } = renderHook(() => useGetInvoice({ id: '1' }))

      await waitFor(() => {
        expect(result.current.loading).toBe(false)
      })

      expect(result.current.invoice).toEqual(mockInvoiceData)
      expect(result.current.error).toBe(null)
      expect(mockGetInvoice).toHaveBeenCalledWith('1')
    })

    it('should set loading state correctly during fetch', async () => {
      let resolvePromise: (value: any) => void
      const promise = new Promise((resolve) => {
        resolvePromise = resolve
      })
      mockGetInvoice.mockReturnValue(promise)

      const { result } = renderHook(() => useGetInvoice({ id: '1' }))

      // Should be loading initially
      expect(result.current.loading).toBe(true)

      // Resolve the promise
      await act(async () => {
        resolvePromise!({ data: mockInvoiceData })
        await promise
      })

      // Should not be loading after completion
      expect(result.current.loading).toBe(false)
    })

    it('should refetch invoice when refetch is called', async () => {
      const { result } = renderHook(() => useGetInvoice({ id: '1' }))

      await waitFor(() => {
        expect(result.current.loading).toBe(false)
      })

      expect(mockGetInvoice).toHaveBeenCalledTimes(1)

      // Call refetch
      await act(async () => {
        await result.current.refetch()
      })

      expect(mockGetInvoice).toHaveBeenCalledTimes(2)
      expect(mockGetInvoice).toHaveBeenCalledWith('1')
    })
  })

  describe('Action type determination', () => {
    it('should set actionType to "finalized" for draft invoice', async () => {
      const draftInvoice = { ...mockInvoiceData, finalized: false, paid: false }
      mockGetInvoice.mockResolvedValueOnce({ data: draftInvoice })

      const { result } = renderHook(() => useGetInvoice({ id: '1' }))

      await waitFor(() => {
        expect(result.current.loading).toBe(false)
      })

      expect(result.current.actionType).toBe('finalized')
      expect(result.current.invoice).toEqual(draftInvoice)
    })

    it('should set actionType to "paid" for finalized but unpaid invoice', async () => {
      mockGetInvoice.mockResolvedValueOnce({ data: mockFinalizedInvoice })

      const { result } = renderHook(() => useGetInvoice({ id: '2' }))

      await waitFor(() => {
        expect(result.current.loading).toBe(false)
      })

      expect(result.current.actionType).toBe('paid')
      expect(result.current.invoice).toEqual(mockFinalizedInvoice)
    })

    it('should not set actionType for fully completed invoice', async () => {
      mockGetInvoice.mockResolvedValueOnce({ data: mockPaidInvoice })

      const { result } = renderHook(() => useGetInvoice({ id: '3' }))

      await waitFor(() => {
        expect(result.current.loading).toBe(false)
      })

      expect(result.current.actionType).toBe(null)
      expect(result.current.invoice).toEqual(mockPaidInvoice)
    })

    it('should handle invoice with only finalized=true and paid=undefined', async () => {
      const partialInvoice = {
        ...mockInvoiceData,
        finalized: true,
        paid: undefined,
      }
      mockGetInvoice.mockResolvedValueOnce({ data: partialInvoice })

      const { result } = renderHook(() => useGetInvoice({ id: '1' }))

      await waitFor(() => {
        expect(result.current.loading).toBe(false)
      })

      expect(result.current.actionType).toBe('paid')
    })
  })

  describe('Error handling', () => {
    it('should handle API errors correctly', async () => {
      const apiError = new Error('API Error')
      mockGetInvoice.mockRejectedValueOnce(apiError)

      const { result } = renderHook(() => useGetInvoice({ id: '1' }))

      await waitFor(() => {
        expect(result.current.loading).toBe(false)
      })

      expect(mockedHandleApiError).toHaveBeenCalledWith(apiError)
      expect(result.current.invoice).toBeUndefined()
    })

    it('should handle network errors and set error state', async () => {
      const networkError = { response: null }
      mockGetInvoice.mockRejectedValueOnce(networkError)
      mockedAxios.isAxiosError.mockReturnValue(true)

      const { result } = renderHook(() => useGetInvoice({ id: '1' }))

      await waitFor(() => {
        expect(result.current.loading).toBe(false)
      })

      expect(mockedHandleApiError).toHaveBeenCalledWith(networkError)
      expect(result.current.error).toEqual({
        label: 'Network Error',
        value: 'Please check your internet connection and try again',
      })
    })

    it('should handle axios errors with response data', async () => {
      const axiosError = { response: { data: 'Server error' } }
      mockGetInvoice.mockRejectedValueOnce(axiosError)
      mockedAxios.isAxiosError.mockReturnValue(true)

      const { result } = renderHook(() => useGetInvoice({ id: '1' }))

      await waitFor(() => {
        expect(result.current.loading).toBe(false)
      })

      expect(mockedHandleApiError).toHaveBeenCalledWith(axiosError)
      expect(result.current.error).toBe(null) // Should not set custom error for server errors
    })

    it('should stop loading even if API call throws', async () => {
      const apiError = new Error('Network Error')
      mockGetInvoice.mockRejectedValueOnce(apiError)

      const { result } = renderHook(() => useGetInvoice({ id: '1' }))

      await waitFor(() => {
        expect(result.current.loading).toBe(false)
      })

      expect(mockedHandleApiError).toHaveBeenCalledWith(apiError)
    })
  })

  describe('ID changes', () => {
    it('should refetch invoice when ID changes', async () => {
      const { result, rerender } = renderHook(
        ({ id }) => useGetInvoice({ id }),
        { initialProps: { id: '1' } }
      )

      await waitFor(() => {
        expect(result.current.loading).toBe(false)
      })

      expect(mockGetInvoice).toHaveBeenCalledWith('1')
      expect(mockGetInvoice).toHaveBeenCalledTimes(1)

      // Change ID
      const newInvoiceData = { ...mockInvoiceData, id: 2 }
      mockGetInvoice.mockResolvedValueOnce({ data: newInvoiceData })

      rerender({ id: '2' })

      await waitFor(() => {
        expect(mockGetInvoice).toHaveBeenCalledWith('2')
      })

      expect(mockGetInvoice).toHaveBeenCalledTimes(2)
    })

    it('should handle rapid ID changes correctly', async () => {
      const { rerender } = renderHook(({ id }) => useGetInvoice({ id }), {
        initialProps: { id: '1' },
      })

      // Rapid ID changes
      rerender({ id: '2' })
      rerender({ id: '3' })
      rerender({ id: '4' })

      await waitFor(() => {
        expect(mockGetInvoice).toHaveBeenCalledWith('4')
      })

      // Should have been called for each ID change
      expect(mockGetInvoice).toHaveBeenCalledTimes(4)
    })
  })

  describe('Edge cases', () => {
    it('should handle empty string ID', async () => {
      renderHook(() => useGetInvoice({ id: '' }))

      await waitFor(() => {
        expect(mockGetInvoice).toHaveBeenCalledWith('')
      })

      expect(mockGetInvoice).toHaveBeenCalledTimes(1)
    })

    it('should handle non-numeric ID strings', async () => {
      renderHook(() => useGetInvoice({ id: 'abc123' }))

      await waitFor(() => {
        expect(mockGetInvoice).toHaveBeenCalledWith('abc123')
      })

      expect(mockGetInvoice).toHaveBeenCalledTimes(1)
    })

    it('should handle null data response', async () => {
      mockGetInvoice.mockResolvedValueOnce({ data: null })

      const { result } = renderHook(() => useGetInvoice({ id: '1' }))

      await waitFor(() => {
        expect(result.current.loading).toBe(false)
      })

      expect(result.current.invoice).toBe(null)
      expect(result.current.actionType).toBe('finalized')
    })

    it('should handle undefined data response', async () => {
      mockGetInvoice.mockResolvedValueOnce({ data: undefined })

      const { result } = renderHook(() => useGetInvoice({ id: '1' }))

      await waitFor(() => {
        expect(result.current.loading).toBe(false)
      })

      expect(result.current.invoice).toBe(undefined)
      expect(result.current.actionType).toBe('finalized')
    })

    it('should handle invoice with missing finalized/paid properties', async () => {
      const incompleteInvoice = { ...mockInvoiceData }
      delete (incompleteInvoice as Partial<Invoice>).finalized
      delete (incompleteInvoice as Partial<Invoice>).paid
      mockGetInvoice.mockResolvedValueOnce({ data: incompleteInvoice })

      const { result } = renderHook(() => useGetInvoice({ id: '1' }))

      await waitFor(() => {
        expect(result.current.loading).toBe(false)
      })

      expect(result.current.actionType).toBe('finalized')
    })
  })

  describe('Function reference stability', () => {
    it('should maintain refetch function reference stability', () => {
      const { result, rerender } = renderHook(() => useGetInvoice({ id: '1' }))

      const firstRenderRefetch = result.current.refetch

      rerender()

      expect(result.current.refetch).toBe(firstRenderRefetch)
    })

    it('should update refetch function when dependencies change', async () => {
      const { result, rerender } = renderHook(
        ({ id }) => useGetInvoice({ id }),
        { initialProps: { id: '1' } }
      )

      await waitFor(() => {
        expect(result.current.loading).toBe(false)
      })

      const firstRefetch = result.current.refetch

      rerender({ id: '2' })

      await waitFor(() => {
        expect(result.current.loading).toBe(false)
      })

      // Function should change when ID dependency changes
      expect(result.current.refetch).not.toBe(firstRefetch)
    })
  })

  describe('Concurrent operations', () => {
    it('should handle multiple concurrent refetch calls', async () => {
      let resolvePromise1: (value: any) => void
      let resolvePromise2: (value: any) => void

      const promise1 = new Promise((resolve) => {
        resolvePromise1 = resolve
      })
      const promise2 = new Promise((resolve) => {
        resolvePromise2 = resolve
      })

      mockGetInvoice.mockReturnValueOnce(promise1).mockReturnValueOnce(promise2)

      const { result } = renderHook(() => useGetInvoice({ id: '1' }))

      // Wait for initial load
      await act(async () => {
        resolvePromise1!({ data: mockInvoiceData })
        await promise1
      })

      // Make concurrent refetch calls
      const refetchPromise1 = result.current.refetch()
      const refetchPromise2 = result.current.refetch()

      // Resolve both promises
      await act(async () => {
        resolvePromise2!({ data: mockInvoiceData })
        await Promise.all([refetchPromise1, refetchPromise2])
      })

      expect(mockGetInvoice).toHaveBeenCalledTimes(3) // Initial + 2 refetch calls
    })
  })

  describe('Complex invoice states', () => {
    it('should handle invoice with complex invoice lines', async () => {
      const complexInvoice: Invoice = {
        ...mockInvoiceData,
        invoice_lines: [
          {
            id: 1,
            product_id: 1,
            quantity: 2,
            unit: 'day',
            tax: '20.00',
            invoice_id: 1,
            price: '100',
            label: '',
            vat_rate: '0',
          },
          {
            id: 2,
            product_id: 2,
            quantity: '1',
            price: '299.99',
            tax: '59.99',
            unit: 'piece',
            invoice_id: 1,
            label: '',
            vat_rate: '0',
          },
        ],
        total: '759.96',
      } as Invoice

      mockGetInvoice.mockResolvedValueOnce({ data: complexInvoice })

      const { result } = renderHook(() => useGetInvoice({ id: '1' }))

      await waitFor(() => {
        expect(result.current.loading).toBe(false)
      })

      expect(result.current.invoice).toEqual(complexInvoice)
      expect(result.current.invoice?.invoice_lines).toHaveLength(2)
    })

    it('should clear error state on successful fetch after error', async () => {
      const apiError = { response: null }
      mockGetInvoice.mockRejectedValueOnce(apiError)
      mockedAxios.isAxiosError.mockReturnValue(true)

      const { result } = renderHook(() => useGetInvoice({ id: '1' }))

      // Wait for error to occur
      await waitFor(() => {
        expect(result.current.error).toEqual({
          label: 'Network Error',
          value: 'Please check your internet connection and try again',
        })
      })

      // Mock successful response for refetch
      mockGetInvoice.mockResolvedValueOnce({ data: mockInvoiceData })

      // Refetch
      await act(async () => {
        await result.current.refetch()
      })

      // Error should be cleared
      expect(result.current.error).toBe(null)
      expect(result.current.invoice).toEqual(mockInvoiceData)
    })
  })
})
