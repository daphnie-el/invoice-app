import { useApi } from 'api'
import { Components } from 'api/gen/client'
import axios from 'axios'
import { Option } from 'components/Select'
import { useCallback, useEffect, useState } from 'react'
import { ExternalToast, toast } from 'sonner'
import { EditInvoiceProps, FilterProps, Invoice } from 'types'
import { handleApiError } from 'utils'
import useLoading from './useLoading'

const toastStyles: Partial<ExternalToast> = {
  duration: 4500,
  position: 'top-right',
}

const useManageInvoices = (filters?: FilterProps[], limit?: number) => {
  const [invoicesList, setInvoicesList] = useState<Invoice[]>([])
  const { loading, startLoading, stopLoading } = useLoading()
  const [page, setPage] = useState(1)
  const [pagination, setPagination] = useState<Components.Schemas.Pagination>({
    page: 1,
    page_size: 20,
    total_pages: 1,
    total_entries: 0,
  })

  const fetchLoader = useLoading()
  const [error, setError] = useState<Option | null>(null)

  const api = useApi()

  const fetchInvoices = useCallback(async () => {
    fetchLoader.startLoading()

    try {
      const { data } = await api.getInvoices({
        filter: JSON.stringify(filters),
        page: page,
        per_page: limit || 20,
        // sort: sort?.join(','), // ask why backend
      })
      setPagination(data.pagination)
      setError(null)
      setInvoicesList(data?.invoices)
    } catch (err) {
      handleApiError(err)
      if (axios.isAxiosError(err) && !err.response?.data) {
        setError({
          label: 'Network Error',
          value: 'Please check your internet connection and try again',
        })
      }
    } finally {
      fetchLoader.stopLoading()
    }
  }, [fetchLoader, api, filters, page, limit])

  useEffect(() => {
    fetchInvoices()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, page])

  const editInvoice = useCallback(
    async ({
      id,
      data,
      onSuccessCallback,
      successMessage,
    }: EditInvoiceProps) => {
      startLoading()
      try {
        await api.putInvoice(id, data)
        toast.success(successMessage || 'Invoice Edited', {
          ...toastStyles,
        })
        onSuccessCallback?.()
        fetchInvoices()
      } catch (error: unknown) {
        handleApiError(error)
      } finally {
        stopLoading()
      }
    },
    [api, fetchInvoices, startLoading, stopLoading]
  )

  const deleteInvoice = useCallback(
    async ({
      id,
      callback,
    }: {
      id: Invoice['id']
      callback?: (val?: unknown) => void
    }) => {
      startLoading()
      try {
        await api.deleteInvoice(id)
        toast.success('Invoice deleted', {
          ...toastStyles,
        })
        fetchInvoices()
        callback?.()
      } catch (error) {
        handleApiError(error)
      } finally {
        stopLoading()
      }
    },
    [api, fetchInvoices, startLoading, stopLoading]
  )

  return {
    invoicesList,
    loading,
    error,
    page,
    setPage,
    totalPages: pagination?.total_pages,
    fetching: fetchLoader.loading,
    refetch: () => fetchInvoices(),
    editInvoice,
    deleteInvoice,
    totalEntries: pagination.total_entries,
  }
}

export default useManageInvoices
