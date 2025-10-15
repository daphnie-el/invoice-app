import { useApi } from 'api'
import axios from 'axios'
import { Option } from 'components/Select'
import { useCallback, useEffect, useState } from 'react'
import { Invoice, InvoiceAction } from 'types'
import { handleApiError } from 'utils'
import useLoading from './useLoading'

const useGetInvoice = ({ id }: { id: string }) => {
  const { loading, startLoading, stopLoading } = useLoading()
  const [invoice, setInvoice] = useState<Invoice>()
  const [actionType, setActionType] = useState<InvoiceAction | null>(null)
  const [error, setError] = useState<Option | null>(null)

  const api = useApi()
  const getInvoice = useCallback(async () => {
    startLoading()
    try {
      const { data } = await api.getInvoice(id)
      setError(null)
      setInvoice(data)
      if (!data?.finalized) {
        setActionType('finalized')
      } else if (!data?.paid) {
        setActionType('paid')
      }
    } catch (error) {
      handleApiError(error)
      if (axios.isAxiosError(error) && !error.response?.data) {
        setError({
          label: 'Network Error',
          value: 'Please check your internet connection and try again',
        })
      }
    } finally {
      stopLoading()
    }
  }, [startLoading, api, id, stopLoading])

  useEffect(() => {
    getInvoice()
  }, [getInvoice])

  return { refetch: getInvoice, loading, invoice, actionType, error }
}

export default useGetInvoice
