import { act, renderHook, waitFor } from '@testing-library/react'
import { useApi } from 'api'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { handleApiError } from 'utils'
import useCreateInvoice from '../useCreateInvoice'

// Mock dependencies
jest.mock('react-router-dom', () => ({
  useNavigate: jest.fn(),
}))

jest.mock('sonner', () => ({
  toast: {
    success: jest.fn(),
  },
}))

jest.mock('api', () => ({
  useApi: jest.fn(),
}))

jest.mock('utils', () => ({
  handleApiError: jest.fn(),
}))

const mockedUseNavigate = useNavigate as jest.MockedFunction<typeof useNavigate>
const mockedToast = toast as jest.Mocked<typeof toast>
const mockedUseApi = useApi as jest.MockedFunction<typeof useApi>
const mockedHandleApiError = handleApiError as jest.MockedFunction<
  typeof handleApiError
>

describe('useCreateInvoice', () => {
  const mockNavigate = jest.fn()
  const mockPostInvoices = jest.fn()
  const mockApi = {
    postInvoices: mockPostInvoices,
  }

  beforeEach(() => {
    jest.clearAllMocks()
    mockedUseNavigate.mockReturnValue(mockNavigate)
    mockedUseApi.mockReturnValue(mockApi as any)
  })

  it('should initialize with correct default state', () => {
    const { result } = renderHook(() => useCreateInvoice())

    expect(result.current.creating).toBe(false)
    expect(typeof result.current.createInvoice).toBe('function')
  })

  it('should successfully create an invoice with minimal data', async () => {
    mockPostInvoices.mockResolvedValueOnce({ data: { id: 1 } })

    const { result } = renderHook(() => useCreateInvoice())

    const invoiceData = {
      invoice: {
        customer_id: 1,
        date: '2024-03-15',
        deadline: '2024-04-15',
        invoice_lines: [],
      },
    }

    await act(async () => {
      await result.current.createInvoice({ data: invoiceData })
    })

    await waitFor(() => {
      expect(result.current.creating).toBe(false)
    })

    expect(mockPostInvoices).toHaveBeenCalledWith(null, invoiceData)
    expect(mockedToast.success).toHaveBeenCalledWith('invoice created', {
      duration: 4500,
      position: 'top-right',
    })
    expect(mockNavigate).toHaveBeenCalledWith('/invoice')
  })

  it('should successfully create an invoice with complete data and callback', async () => {
    mockPostInvoices.mockResolvedValueOnce({ data: { id: 1 } })
    const callback = jest.fn()

    const { result } = renderHook(() => useCreateInvoice())

    const invoiceData = {
      invoice: {
        customer_id: 1,
        date: '2024-03-15',
        deadline: '2024-04-15',
        invoice_lines: [
          {
            product_id: 1,
            quantity: '2',
            unit_price: '100.00',
          },
        ],
      },
    }

    await act(async () => {
      await result.current.createInvoice({ data: invoiceData, callback })
    })

    await waitFor(() => {
      expect(result.current.creating).toBe(false)
    })

    expect(mockPostInvoices).toHaveBeenCalledWith(null, invoiceData)
    expect(callback).toHaveBeenCalledTimes(1)
    expect(mockedToast.success).toHaveBeenCalledWith('invoice created', {
      duration: 4500,
      position: 'top-right',
    })
    expect(mockNavigate).toHaveBeenCalledWith('/invoice')
  })

  it('should set loading state correctly during creation', async () => {
    let resolvePromise: (value: any) => void
    const promise = new Promise((resolve) => {
      resolvePromise = resolve
    })
    mockPostInvoices.mockReturnValue(promise)

    const { result } = renderHook(() => useCreateInvoice())

    const invoiceData = {
      invoice: {
        customer_id: 1,
        date: '2024-03-15',
        deadline: '2024-04-15',
        invoice_lines: [],
      },
    }

    // Start creation
    result.current.createInvoice({ data: invoiceData })

    // Should be loading
    await waitFor(() => {
      expect(result.current.creating).toBe(true)
    })

    // Resolve the promise
    resolvePromise!({ data: { id: 1 } })

    // Should not be loading after completion
    await waitFor(() => {
      expect(result.current.creating).toBe(false)
    })
  })

  it('should handle API errors correctly', async () => {
    const apiError = new Error('API Error')
    mockPostInvoices.mockRejectedValueOnce(apiError)

    const { result } = renderHook(() => useCreateInvoice())

    const invoiceData = {
      invoice: {
        customer_id: 1,
        date: '2024-03-15',
        deadline: '2024-04-15',
        invoice_lines: [],
      },
    }

    await act(async () => {
      await result.current.createInvoice({ data: invoiceData })
    })

    await waitFor(() => {
      expect(result.current.creating).toBe(false)
    })

    expect(mockPostInvoices).toHaveBeenCalledWith(null, invoiceData)
    expect(mockedHandleApiError).toHaveBeenCalledWith(apiError)
    expect(mockedToast.success).not.toHaveBeenCalled()
    expect(mockNavigate).not.toHaveBeenCalled()
  })

  it('should handle API errors and still call callback if provided', async () => {
    const apiError = new Error('API Error')
    mockPostInvoices.mockRejectedValueOnce(apiError)
    const callback = jest.fn()

    const { result } = renderHook(() => useCreateInvoice())

    const invoiceData = {
      invoice: {
        customer_id: 1,
        date: '2024-03-15',
        deadline: '2024-04-15',
        invoice_lines_attributes: [],
      },
    }

    await act(async () => {
      await result.current.createInvoice({ data: invoiceData, callback })
    })

    await waitFor(() => {
      expect(result.current.creating).toBe(false)
    })

    expect(mockedHandleApiError).toHaveBeenCalledWith(apiError)
    expect(callback).not.toHaveBeenCalled() // Callback should not be called on error
    expect(mockNavigate).not.toHaveBeenCalled()
  })

  it('should stop loading even if API call throws', async () => {
    const apiError = new Error('Network Error')
    mockPostInvoices.mockRejectedValueOnce(apiError)

    const { result } = renderHook(() => useCreateInvoice())

    const invoiceData = {
      invoice: {
        customer_id: 1,
        date: '2024-03-15',
        deadline: '2024-04-15',
        invoice_lines: [],
      },
    }
    await act(async () => {
      await result.current.createInvoice({ data: invoiceData })
    })

    await waitFor(() => {
      expect(result.current.creating).toBe(false)
    })

    expect(mockedHandleApiError).toHaveBeenCalledWith(apiError)
  })

  it('should work without callback parameter', async () => {
    mockPostInvoices.mockResolvedValueOnce({ data: { id: 1 } })

    const { result } = renderHook(() => useCreateInvoice())

    const invoiceData = {
      invoice: {
        customer_id: 1,
        date: '2024-03-15',
        deadline: '2024-04-15',
        invoice_lines: [],
      },
    }
    await act(async () => {
      await result.current.createInvoice({ data: invoiceData })
    })

    await waitFor(() => {
      expect(result.current.creating).toBe(false)
    })

    expect(mockPostInvoices).toHaveBeenCalledWith(null, invoiceData)
    expect(mockedToast.success).toHaveBeenCalled()
    expect(mockNavigate).toHaveBeenCalledWith('/invoice')
  })

  it('should handle multiple concurrent creation attempts correctly', async () => {
    let resolvePromise1: (value: any) => void
    let resolvePromise2: (value: any) => void

    const promise1 = new Promise((resolve) => {
      resolvePromise1 = resolve
    })
    const promise2 = new Promise((resolve) => {
      resolvePromise2 = resolve
    })

    mockPostInvoices.mockReturnValueOnce(promise1).mockReturnValueOnce(promise2)

    const { result } = renderHook(() => useCreateInvoice())

    const invoiceData1 = {
      invoice: {
        customer_id: 1,
        date: '2024-03-15',
        deadline: '2024-04-15',
        invoice_lines: [],
      },
    }

    const invoiceData2 = {
      invoice: {
        customer_id: 2,
        date: '2024-03-16',
        deadline: '2024-04-16',
        invoice_lines: [],
      },
    }

    // Start both creations

    result.current.createInvoice({ data: invoiceData1 })
    result.current.createInvoice({ data: invoiceData2 })

    // Should be loading
    await waitFor(() => {
      expect(result.current.creating).toBe(true)
    })

    // Resolve first promise
    resolvePromise1!({ data: { id: 1 } })

    // Should still be loading because of second request
    await waitFor(() => {
      expect(result.current.creating).toBe(true)
    })

    // Resolve second promise
    resolvePromise2!({ data: { id: 2 } })

    // Should not be loading after both complete
    await waitFor(() => {
      expect(result.current.creating).toBe(false)
    })

    expect(mockPostInvoices).toHaveBeenCalledTimes(2)
  })

  it('should create invoice with complex invoice lines data', async () => {
    mockPostInvoices.mockResolvedValueOnce({ data: { id: 1 } })

    const { result } = renderHook(() => useCreateInvoice())

    const invoiceData = {
      invoice: {
        customer_id: 1,
        date: '2024-03-15',
        deadline: '2024-04-15',
        invoice_lines_attributes: [
          {
            product_id: 1,
            quantity: 100.5,
          },
          {
            product_id: 2,
            quantity: 1,
          },
        ],
      },
    }

    await result.current.createInvoice({ data: invoiceData })

    await waitFor(() => {
      expect(result.current.creating).toBe(false)
    })

    expect(mockPostInvoices).toHaveBeenCalledWith(null, invoiceData)
    expect(mockedToast.success).toHaveBeenCalledWith('invoice created', {
      duration: 4500,
      position: 'top-right',
    })
    expect(mockNavigate).toHaveBeenCalledWith('/invoice')
  })
})
