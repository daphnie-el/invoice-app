import axios from 'axios'
import { ExternalToast, toast } from 'sonner'
import { Invoice, InvoiceLine } from 'types'

export function isOverdue(deadline: string | null): boolean {
  if (!deadline) return false

  const now = new Date()
  const todayUTC = Date.UTC(
    now.getUTCFullYear(),
    now.getUTCMonth(),
    now.getUTCDate()
  )

  const deadlineDate = new Date(deadline)
  const deadlineUTC = Date.UTC(
    deadlineDate.getUTCFullYear(),
    deadlineDate.getUTCMonth(),
    deadlineDate.getUTCDate()
  )

  return deadlineUTC < todayUTC
}
export const getTotal = (invoice: Invoice[]) => {
  return invoice.reduce((total, line) => total + Number(line.total), 0)
}

export const getTotalTax = (invoiceLines: InvoiceLine[]) => {
  return invoiceLines.reduce((total, line) => total + Number(line.tax), 0)
}

export const totalProductPrice = (quantity: string, unitPrice: string) => {
  return Number(quantity) * Number(unitPrice)
}

export function formatEuro(value: number): string {
  if (typeof value !== 'number' || isNaN(value)) return '-'

  return new Intl.NumberFormat(undefined, {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value)
}
export const formatDate = (date: Date): string => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export const todayDateString = formatDate(new Date())
export function daysOverdue(date: string | Date): number {
  const today = new Date()
  const targetDate = new Date(date)

  today.setHours(0, 0, 0, 0)
  targetDate.setHours(0, 0, 0, 0)

  const diffTime = today.getTime() - targetDate.getTime()
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))

  return diffDays
}

const toastStyles: Partial<ExternalToast> = {
  position: 'top-right',
  duration: 6000,
}

export const handleApiError = (error: unknown) => {
  if (axios.isAxiosError(error)) {
    if (!error.response?.data) {
      toast.error('Please check your internet connection and try again', {
        ...toastStyles,
      })
    } else {
      toast.error('An error occurred, try again', {
        ...toastStyles,
      })
    }
  } else if (error instanceof Error) {
    toast.error('An unexpected error occurred', {
      ...toastStyles,
    })
  } else {
    toast.error('Unknown error occurred', {
      ...toastStyles,
    })
  }
}
