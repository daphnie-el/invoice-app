import { act, renderHook, waitFor } from '@testing-library/react'
import { useApi } from 'api'
import axios from 'axios'
import { toast } from 'sonner'
import { FieldEnum, FilterProps, Operator } from 'types'
import { handleApiError } from 'utils'
import useManageInvoices from '../useManageInvoices'

// Mock dependencies
jest.mock('api', () => ({
  useApi: jest.fn(),
}))

jest.mock('sonner', () => ({
  toast: {
    success: jest.fn(),
  },
}))

jest.mock('utils', () => ({
  handleApiError: jest.fn(),
}))

jest.mock('axios', () => ({
  isAxiosError: jest.fn(),
}))

const mockedUseApi = useApi as jest.MockedFunction<typeof useApi>
const mockedToast = toast as jest.Mocked<typeof toast>
const mockedHandleApiError = handleApiError as jest.MockedFunction<
  typeof handleApiError
>
const mockedAxios = axios as jest.Mocked<typeof axios>

describe('useManageInvoices', () => {
  const mockGetInvoices = jest.fn()
  const mockPutInvoice = jest.fn()
  const mockDeleteInvoice = jest.fn()

  const mockApi = {
    getInvoices: mockGetInvoices,
    putInvoice: mockPutInvoice,
    deleteInvoice: mockDeleteInvoice,
  }

  const mockInvoicesData = {
    invoices: [
      {
        id: 1,
        customer_id: 1,
        date: '2024-03-15',
        deadline: '2024-04-15',
        total: '100.00',
        finalized: false,
        paid: false,
        invoice_lines: [],
      },
      {
        id: 2,
        customer_id: 2,
        date: '2024-03-16',
        deadline: '2024-04-16',
        total: '200.00',
        finalized: true,
        paid: false,
        invoice_lines: [],
      },
    ],
    pagination: {
      page: 1,
      page_size: 20,
      total_pages: 1,
      total_entries: 2,
    },
  }

  beforeEach(() => {
    jest.clearAllMocks()
    mockedUseApi.mockReturnValue(mockApi as any)
    mockGetInvoices.mockResolvedValue({ data: mockInvoicesData })
  })

  describe('Initialization', () => {
    it('should initialize with correct default state', async () => {
      const { result } = renderHook(() => useManageInvoices())

      // Wait for useEffect to complete
      await waitFor(() => {
        expect(result.current.fetching).toBe(false)
      })

      expect(result.current.loading).toBe(false)
      expect(result.current.error).toBe(null)
      expect(result.current.page).toBe(1)
      expect(typeof result.current.setPage).toBe('function')
      expect(typeof result.current.refetch).toBe('function')
      expect(typeof result.current.editInvoice).toBe('function')
      expect(typeof result.current.deleteInvoice).toBe('function')
    })

    it('should fetch invoices on mount', async () => {
      const { result } = renderHook(() => useManageInvoices())

      await waitFor(() => {
        expect(mockGetInvoices).toHaveBeenCalledWith({
          filter: JSON.stringify(undefined),
          page: 1,
          per_page: 20,
        })
      })

      await waitFor(() => {
        expect(result.current.fetching).toBe(false)
      })
    })
  })

  describe('fetchInvoices', () => {
    it('should fetch invoices successfully', async () => {
      const { result } = renderHook(() => useManageInvoices())
      await waitFor(() => {
        expect({
          fetching: result.current.fetching,
          invoicesList: result.current.invoicesList,
          totalPages: result.current.totalPages,
          totalEntries: result.current.totalEntries,
          error: result.current.error,
        }).toEqual({
          fetching: false,
          invoicesList: mockInvoicesData.invoices,
          totalPages: 1,
          totalEntries: 2,
          error: null,
        })
      })
    })

    it('should handle API errors during fetch', async () => {
      const apiError = new Error('API Error')
      mockGetInvoices.mockRejectedValueOnce(apiError)

      renderHook(() => useManageInvoices())

      await waitFor(() => {
        expect(mockedHandleApiError).toHaveBeenCalledWith(apiError)
      })
    })

    it('should handle network errors during fetch', async () => {
      const networkError = { response: null }
      mockGetInvoices.mockRejectedValueOnce(networkError)
      mockedAxios.isAxiosError.mockReturnValue(true)

      const { result } = renderHook(() => useManageInvoices())

      await waitFor(() => {
        expect(result.current.fetching).toBe(false)
      })

      await waitFor(() => {
        expect(result.current.error).toEqual({
          label: 'Network Error',
          value: 'Please check your internet connection and try again',
        })
      })
    })

    it('should set loading state correctly during fetch', async () => {
      let resolvePromise: (value: any) => void
      const promise = new Promise((resolve) => {
        resolvePromise = resolve
      })
      mockGetInvoices.mockReturnValue(promise)

      const { result } = renderHook(() => useManageInvoices())

      // Should be loading initially
      expect(result.current.fetching).toBe(true)

      // Resolve the promise
      act(() => {
        resolvePromise!({ data: mockInvoicesData })
      })

      await waitFor(() => {
        expect(result.current.fetching).toBe(false)
      })
    })
  })

  describe('Filters and Pagination', () => {
    it('should fetch invoices with filters', async () => {
      const filters: FilterProps[] = [
        {
          field: FieldEnum.CUSTOMER_ID,
          operator: Operator.EQ,
          value: 1,
        },
      ]

      const { result } = renderHook(() => useManageInvoices(filters))

      await waitFor(() => {
        expect(mockGetInvoices).toHaveBeenCalledWith({
          filter: JSON.stringify(filters),
          page: 1,
          per_page: 20,
        })
      })

      await waitFor(() => {
        expect(result.current.fetching).toBe(false)
      })
    })

    it('should fetch invoices with custom limit', async () => {
      const limit = 50

      const { result } = renderHook(() => useManageInvoices(undefined, limit))

      await waitFor(() => {
        expect(mockGetInvoices).toHaveBeenCalledWith({
          filter: JSON.stringify(undefined),
          page: 1,
          per_page: 50,
        })
      })

      await waitFor(() => {
        expect(result.current.fetching).toBe(false)
      })
    })

    it('should refetch when filters change', async () => {
      const initialFilters: FilterProps[] = [
        {
          field: FieldEnum.CUSTOMER_ID,
          operator: Operator.EQ,
          value: 1,
        },
      ]

      const { result, rerender } = renderHook(
        ({ filters }) => useManageInvoices(filters),
        {
          initialProps: { filters: initialFilters },
        }
      )

      await waitFor(() => {
        expect(mockGetInvoices).toHaveBeenCalledWith({
          filter: JSON.stringify(initialFilters),
          page: 1,
          per_page: 20,
        })
      })

      await waitFor(() => {
        expect(result.current.fetching).toBe(false)
      })

      mockGetInvoices.mockClear()

      const newFilters: FilterProps[] = [
        {
          field: FieldEnum.FINALIZED,
          operator: Operator.EQ,
          value: true,
        },
      ]

      rerender({ filters: newFilters })

      await waitFor(() => {
        expect(mockGetInvoices).toHaveBeenCalledWith({
          filter: JSON.stringify(newFilters),
          page: 1,
          per_page: 20,
        })
      })

      await waitFor(() => {
        expect(result.current.fetching).toBe(false)
      })
    })

    it('should refetch when page changes', async () => {
      const { result } = renderHook(() => useManageInvoices())

      await waitFor(() => {
        expect(mockGetInvoices).toHaveBeenCalledWith({
          filter: JSON.stringify(undefined),
          page: 1,
          per_page: 20,
        })
      })

      mockGetInvoices.mockClear()

      act(() => {
        result.current.setPage(2)
      })

      await waitFor(() => {
        expect(mockGetInvoices).toHaveBeenCalledWith({
          filter: JSON.stringify(undefined),
          page: 2,
          per_page: 20,
        })
      })

      expect(result.current.page).toBe(2)
    })
  })

  describe('editInvoice', () => {
    it('should edit invoice successfully', async () => {
      mockPutInvoice.mockResolvedValueOnce({ data: { id: 1 } })

      const { result } = renderHook(() => useManageInvoices())

      const editData = {
        invoice: {
          id: 3,
          customer_id: 2,
          date: '2024-03-20',
          deadline: '2024-04-20',
        },
      }

      await act(async () => {
        await result.current.editInvoice({
          id: 1,
          data: editData,
        })
      })

      expect(mockPutInvoice).toHaveBeenCalledWith(1, editData)
      expect(mockedToast.success).toHaveBeenCalledWith('Invoice Edited', {
        duration: 4500,
        position: 'top-right',
      })
      expect(mockGetInvoices).toHaveBeenCalledTimes(2) // Initial fetch + refetch after edit
    })

    it('should edit invoice with custom success message', async () => {
      mockPutInvoice.mockResolvedValueOnce({ data: { id: 1 } })

      const { result } = renderHook(() => useManageInvoices())

      const editData = {
        invoice: {
          id: 3,
          customer_id: 2,
          date: '2024-03-20',
          deadline: '2024-04-20',
          finalized: true,
        },
      }

      await act(async () => {
        await result.current.editInvoice({
          id: 1,
          data: editData,
          successMessage: 'Invoice finalized successfully',
        })
      })

      expect(mockedToast.success).toHaveBeenCalledWith(
        'Invoice finalized successfully',
        {
          duration: 4500,
          position: 'top-right',
        }
      )
    })

    it('should call success callback after editing invoice', async () => {
      mockPutInvoice.mockResolvedValueOnce({ data: { id: 1 } })
      const successCallback = jest.fn()

      const { result } = renderHook(() => useManageInvoices())

      const editData = {
        invoice: {
          id: 3,
          customer_id: 2,
          date: '2024-03-20',
          deadline: '2024-04-20',
        },
      }

      await act(async () => {
        await result.current.editInvoice({
          id: 1,
          data: editData,
          onSuccessCallback: successCallback,
        })
      })

      expect(successCallback).toHaveBeenCalledTimes(1)
    })

    it('should handle edit invoice errors', async () => {
      const apiError = new Error('Edit failed')
      mockPutInvoice.mockRejectedValueOnce(apiError)

      const { result } = renderHook(() => useManageInvoices())

      const editData = {
        invoice: {
          id: 3,
          customer_id: 2,
          date: '2024-03-20',
          deadline: '2024-04-20',
        },
      }

      await act(async () => {
        await result.current.editInvoice({
          id: 1,
          data: editData,
        })
      })

      expect(mockedHandleApiError).toHaveBeenCalledWith(apiError)
      expect(mockedToast.success).not.toHaveBeenCalled()
    })

    it('should set loading state correctly during edit', async () => {
      let resolvePromise: (value: any) => void
      const promise = new Promise((resolve) => {
        resolvePromise = resolve
      })
      mockPutInvoice.mockReturnValue(promise)

      const { result } = renderHook(() => useManageInvoices())

      const editData = {
        invoice: {
          id: 3,
          customer_id: 2,
          date: '2024-03-20',
          deadline: '2024-04-20',
        },
      }

      // Start editing
      act(() => {
        result.current.editInvoice({
          id: 1,
          data: editData,
        })
      })

      // Should be loading
      expect(result.current.loading).toBe(true)

      // Resolve the promise
      await act(async () => {
        resolvePromise!({ data: { id: 1 } })
        await promise
      })

      // Should not be loading after completion
      expect(result.current.loading).toBe(false)
    })
  })

  describe('deleteInvoice', () => {
    it('should delete invoice successfully', async () => {
      mockDeleteInvoice.mockResolvedValueOnce({ data: {} })

      const { result } = renderHook(() => useManageInvoices())

      await act(async () => {
        await result.current.deleteInvoice({ id: 1 })
      })

      expect(mockDeleteInvoice).toHaveBeenCalledWith(1)
      expect(mockedToast.success).toHaveBeenCalledWith('Invoice deleted', {
        duration: 4500,
        position: 'top-right',
      })
      expect(mockGetInvoices).toHaveBeenCalledTimes(2) // Initial fetch + refetch after delete
    })

    it('should call callback after deleting invoice', async () => {
      mockDeleteInvoice.mockResolvedValueOnce({ data: {} })
      const deleteCallback = jest.fn()

      const { result } = renderHook(() => useManageInvoices())

      await act(async () => {
        await result.current.deleteInvoice({
          id: 1,
          callback: deleteCallback,
        })
      })

      expect(deleteCallback).toHaveBeenCalledTimes(1)
    })

    it('should handle delete invoice errors', async () => {
      const apiError = new Error('Delete failed')
      mockDeleteInvoice.mockRejectedValueOnce(apiError)

      const { result } = renderHook(() => useManageInvoices())

      await act(async () => {
        await result.current.deleteInvoice({ id: 1 })
      })

      expect(mockedHandleApiError).toHaveBeenCalledWith(apiError)
      expect(mockedToast.success).not.toHaveBeenCalled()
    })

    it('should set loading state correctly during delete', async () => {
      let resolvePromise: (value: any) => void
      const promise = new Promise((resolve) => {
        resolvePromise = resolve
      })
      mockDeleteInvoice.mockReturnValue(promise)

      const { result } = renderHook(() => useManageInvoices())

      // Start deleting
      act(() => {
        result.current.deleteInvoice({ id: 1 })
      })

      // Should be loading
      expect(result.current.loading).toBe(true)

      // Resolve the promise
      await act(async () => {
        resolvePromise!({ data: {} })
        await promise
      })

      // Should not be loading after completion
      expect(result.current.loading).toBe(false)
    })
  })

  describe('refetch', () => {
    it('should refetch invoices when called', async () => {
      const { result } = renderHook(() => useManageInvoices())

      await waitFor(() => {
        expect(mockGetInvoices).toHaveBeenCalledTimes(1)
      })

      mockGetInvoices.mockClear()

      await act(async () => {
        await result.current.refetch()
      })

      expect(mockGetInvoices).toHaveBeenCalledTimes(1)
    })
  })

  describe('Complex scenarios', () => {
    it('should handle multiple filters correctly', async () => {
      const complexFilters: FilterProps[] = [
        {
          field: FieldEnum.CUSTOMER_ID,
          operator: Operator.EQ,
          value: 1,
        },
        {
          field: FieldEnum.FINALIZED,
          operator: Operator.EQ,
          value: true,
        },
        {
          field: FieldEnum.DATE,
          operator: Operator.GTEQ,
          value: '2024-01-01',
        },
      ]

      const { result } = renderHook(() => useManageInvoices(complexFilters))

      await waitFor(() => {
        expect(mockGetInvoices).toHaveBeenCalledWith({
          filter: JSON.stringify(complexFilters),
          page: 1,
          per_page: 20,
        })
      })

      await waitFor(() => {
        expect(result.current.fetching).toBe(false)
      })
    })

    it('should handle concurrent edit and delete operations', async () => {
      mockPutInvoice.mockResolvedValueOnce({ data: { id: 1 } })
      mockDeleteInvoice.mockResolvedValueOnce({ data: {} })

      const { result } = renderHook(() => useManageInvoices())

      const editPromise = result.current.editInvoice({
        id: 1,
        data: { invoice: { id: 2 } },
      })

      const deletePromise = result.current.deleteInvoice({ id: 2 })

      await act(async () => {
        await Promise.all([editPromise, deletePromise])
      })

      expect(mockPutInvoice).toHaveBeenCalledWith(1, { invoice: { id: 2 } })
      expect(mockDeleteInvoice).toHaveBeenCalledWith(2)
      expect(mockedToast.success).toHaveBeenCalledTimes(2)
    })

    it('should maintain function reference stability for useState setters', () => {
      const { result, rerender } = renderHook(() => useManageInvoices())

      const firstRenderSetPage = result.current.setPage

      rerender()

      // setPage should maintain reference stability as it's from useState
      expect(result.current.setPage).toBe(firstRenderSetPage)

      // Other functions may change due to useCallback dependencies
      expect(typeof result.current.refetch).toBe('function')
      expect(typeof result.current.editInvoice).toBe('function')
      expect(typeof result.current.deleteInvoice).toBe('function')
    })

    it('should handle pagination with large datasets', async () => {
      const largePaginationData = {
        invoices: Array.from({ length: 20 }, (_, i) => ({
          id: i + 1,
          customer_id: 1,
          date: '2024-03-15',
          deadline: '2024-04-15',
          total: '100.00',
          finalized: false,
          paid: false,
          invoice_lines: [],
        })),
        pagination: {
          page: 1,
          page_size: 20,
          total_pages: 50,
          total_entries: 1000,
        },
      }

      mockGetInvoices.mockResolvedValueOnce({ data: largePaginationData })

      const { result } = renderHook(() => useManageInvoices())

      await waitFor(() => {
        expect(result.current.invoicesList).toHaveLength(20)
      })
      await (() => {
        expect(result.current.totalPages).toBe(50)
      })
      await (() => {
        expect(result.current.totalEntries).toBe(1000)
      })
    })

    it('should handle empty invoice list', async () => {
      const emptyData = {
        invoices: [],
        pagination: {
          page: 1,
          page_size: 20,
          total_pages: 0,
          total_entries: 0,
        },
      }

      mockGetInvoices.mockResolvedValueOnce({ data: emptyData })

      const { result } = renderHook(() => useManageInvoices())

      await waitFor(() => {
        expect(result.current.invoicesList).toEqual([])
      })
      await waitFor(() => {
        expect(result.current.totalPages).toBe(0)
      })
      await waitFor(() => {
        expect(result.current.totalEntries).toBe(0)
      })
    })
  })
})
