import axios from 'axios'
import { toast } from 'sonner'
import { Invoice, InvoiceLine } from 'types'
import {
  daysOverdue,
  formatDate,
  formatEuro,
  getTotal,
  getTotalTax,
  handleApiError,
  isOverdue,
  todayDateString,
  totalProductPrice,
} from 'utils/index'

// Mock dependencies
jest.mock('axios')
jest.mock('sonner', () => ({
  toast: {
    error: jest.fn(),
  },
}))

const mockedAxios = axios as jest.Mocked<typeof axios>
const mockedToast = toast as jest.Mocked<typeof toast>

describe('Utils', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    // Mock current date for consistent testing
    jest.useFakeTimers()
    jest.setSystemTime(new Date('2024-03-15T10:00:00Z'))
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  describe('isOverdue', () => {
    it('should return false when deadline is null', () => {
      expect(isOverdue(null)).toBe(false)
    })

    it('should return true when deadline is in the past', () => {
      expect(isOverdue('2024-03-14')).toBe(true)
    })

    it('should return false when deadline is today', () => {
      expect(isOverdue(todayDateString)).toBe(false)
    })

    it('should return false when deadline is in the future', () => {
      expect(isOverdue('2024-03-16')).toBe(false)
    })

    it('should handle ISO date strings correctly', () => {
      expect(isOverdue('2024-03-14T23:59:59Z')).toBe(true)
      expect(isOverdue('2055-03-15T00:00:00Z')).toBe(false)
    })
  })

  describe('getTotal', () => {
    it('should calculate total from invoice array', () => {
      const invoices: Invoice[] = [
        { total: '100.50' } as Invoice,
        { total: '250.25' } as Invoice,
        { total: '75.00' } as Invoice,
      ]
      expect(getTotal(invoices)).toBe(425.75)
    })

    it('should return 0 for empty array', () => {
      expect(getTotal([])).toBe(0)
    })

    it('should handle string numbers correctly', () => {
      const invoices: Invoice[] = [
        { total: '0' } as Invoice,
        { total: '100.123' } as Invoice,
      ]
      expect(getTotal(invoices)).toBe(100.123)
    })
  })

  describe('getTotalTax', () => {
    it('should calculate total tax from invoice lines', () => {
      const invoiceLines: InvoiceLine[] = [
        { tax: '21.00' } as InvoiceLine,
        { tax: '15.50' } as InvoiceLine,
        { tax: '5.25' } as InvoiceLine,
      ]
      expect(getTotalTax(invoiceLines)).toBe(41.75)
    })

    it('should return 0 for empty array', () => {
      expect(getTotalTax([])).toBe(0)
    })

    it('should handle zero tax values', () => {
      const invoiceLines: InvoiceLine[] = [
        { tax: '0' } as InvoiceLine,
        { tax: '10.00' } as InvoiceLine,
      ]
      expect(getTotalTax(invoiceLines)).toBe(10)
    })
  })

  describe('totalProductPrice', () => {
    it('should calculate product price correctly', () => {
      expect(totalProductPrice('5', '10.50')).toBe(52.5)
    })

    it('should handle decimal quantities', () => {
      expect(totalProductPrice('2.5', '20')).toBe(50)
    })

    it('should handle zero values', () => {
      expect(totalProductPrice('0', '10')).toBe(0)
      expect(totalProductPrice('5', '0')).toBe(0)
    })

    it('should handle decimal unit prices', () => {
      expect(totalProductPrice('3', '33.33')).toBe(99.99)
    })
  })

  describe('formatEuro', () => {
    it('should format positive numbers as EUR currency', () => {
      expect(formatEuro(100)).toBe('€100.00')
    })

    it('should format decimal numbers correctly', () => {
      expect(formatEuro(123.456)).toBe('€123.46')
    })

    it('should handle zero', () => {
      expect(formatEuro(0)).toBe('€0.00')
    })

    it('should handle negative numbers', () => {
      expect(formatEuro(-50.75)).toBe('-€50.75')
    })

    it('should return "-" for invalid inputs', () => {
      expect(formatEuro(NaN)).toBe('-')
      expect(formatEuro(undefined as any)).toBe('-')
      expect(formatEuro('invalid' as any)).toBe('-')
    })

    it('should format large numbers correctly', () => {
      expect(formatEuro(1234567.89)).toBe('€1,234,567.89')
    })
  })

  describe('formatDate', () => {
    it('should format date as YYYY-MM-DD', () => {
      const date = new Date('2024-03-15')
      expect(formatDate(date)).toBe('2024-03-15')
    })

    it('should pad single digit months and days', () => {
      const date = new Date('2024-01-05')
      expect(formatDate(date)).toBe('2024-01-05')
    })

    it('should handle different months correctly', () => {
      const date = new Date('2024-12-31')
      expect(formatDate(date)).toBe('2024-12-31')
    })
  })

  describe('daysOverdue', () => {
    it('should calculate days overdue for past dates', () => {
      expect(daysOverdue('2024-03-10')).toBe(5)
    })

    it('should return 0 for today', () => {
      expect(daysOverdue('2024-03-15')).toBe(0)
    })

    it('should return negative days for future dates', () => {
      expect(daysOverdue('2024-03-20')).toBe(-5)
    })

    it('should handle Date objects', () => {
      const pastDate = new Date('2024-03-10')
      expect(daysOverdue(pastDate)).toBe(5)
    })

    it('should ignore time portions', () => {
      expect(daysOverdue('2024-03-10T23:59:59')).toBe(5)
      expect(daysOverdue('2024-03-15T12:30:45')).toBe(0)
    })
  })

  describe('handleApiError', () => {
    it('should handle axios errors without response data', () => {
      const axiosError = {
        isAxiosError: true,
        response: null,
      }
      mockedAxios.isAxiosError.mockReturnValue(true)

      handleApiError(axiosError)

      expect(mockedToast.error).toHaveBeenCalledWith(
        'Please check your internet connection and try again',
        {
          position: 'top-right',
          duration: 6000,
        }
      )
    })

    it('should handle axios errors with response data', () => {
      const axiosError = {
        isAxiosError: true,
        response: { data: 'some error' },
      }
      mockedAxios.isAxiosError.mockReturnValue(true)

      handleApiError(axiosError)

      expect(mockedToast.error).toHaveBeenCalledWith(
        'An error occurred, try again',
        {
          position: 'top-right',
          duration: 6000,
        }
      )
    })

    it('should handle regular Error objects', () => {
      const regularError = new Error('Test error')
      mockedAxios.isAxiosError.mockReturnValue(false)

      handleApiError(regularError)

      expect(mockedToast.error).toHaveBeenCalledWith(
        'An unexpected error occurred',
        {
          position: 'top-right',
          duration: 6000,
        }
      )
    })

    it('should handle unknown error types', () => {
      const unknownError = 'string error'
      mockedAxios.isAxiosError.mockReturnValue(false)

      handleApiError(unknownError)

      expect(mockedToast.error).toHaveBeenCalledWith('Unknown error occurred', {
        position: 'top-right',
        duration: 6000,
      })
    })

    it('should handle axios errors with undefined response', () => {
      const axiosError = {
        isAxiosError: true,
        response: { data: undefined },
      }
      mockedAxios.isAxiosError.mockReturnValue(true)

      handleApiError(axiosError)

      expect(mockedToast.error).toHaveBeenCalledWith(
        'Please check your internet connection and try again',
        {
          position: 'top-right',
          duration: 6000,
        }
      )
    })
  })
})
