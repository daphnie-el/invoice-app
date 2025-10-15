import { useApi } from 'api'
import { Components } from 'api/gen/client'
import { useCallback, useEffect, useState } from 'react'
import { Customer } from 'types'
import { handleApiError } from 'utils'
import { useDebouncedValue } from './useDebounce'
import useLoading from './useLoading'
const useGetCustomers = () => {
  const { loading, startLoading, stopLoading } = useLoading()
  const [page, setPage] = useState(1)
  const [pagination, setPagination] = useState<Components.Schemas.Pagination>({
    page: 1,
    page_size: 25,
    total_pages: 1,
    total_entries: 0,
  })

  const [customers, setCustomers] = useState<Customer[]>([])
  const [searchText, setSearchText] = useState<string>()
  const api = useApi()
  const debouncedSearchText = useDebouncedValue(searchText, 400)

  useEffect(() => {
    setPage(1)
  }, [searchText])

  const getCustomers = useCallback(async () => {
    startLoading()
    try {
      const { data } = await api.getSearchCustomers({
        query: debouncedSearchText || '',
        per_page: 20,
        page,
      })
      setCustomers(data.customers)
      setPagination(data?.pagination)
    } catch (err) {
      handleApiError(err)
    } finally {
      stopLoading()
    }
  }, [debouncedSearchText, page, api, startLoading, stopLoading])

  useEffect(() => {
    getCustomers()
  }, [getCustomers])
  return {
    loading,
    page,
    totalPages: pagination.total_pages,
    customers,
    setPage,
    searchText,
    setSearchText,
    totalEntries: pagination.total_entries,
  }
}

export default useGetCustomers
