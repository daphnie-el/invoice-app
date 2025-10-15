import { useApi } from 'api'
import { Paths } from 'api/gen/client'
import { useNavigate } from 'react-router-dom'
import useLoading from './useLoading'

import { toast } from 'sonner'
import { handleApiError } from 'utils'

const useCreateInvoice = () => {
  const { loading, startLoading, stopLoading } = useLoading()
  const api = useApi()
  const navigate = useNavigate()

  const createInvoice = async ({
    data,
    callback,
  }: {
    data: Paths.PostInvoices.RequestBody
    callback?: () => void
  }) => {
    startLoading()
    try {
      await api.postInvoices(null, data)
      toast.success('invoice created', {
        duration: 4500,
        position: 'top-right',
      })
      callback?.()
      navigate('/invoice')
    } catch (err) {
      handleApiError(err)
    } finally {
      stopLoading()
    }
  }
  return {
    creating: loading,
    createInvoice,
  }
}

export default useCreateInvoice
