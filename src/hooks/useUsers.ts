
import { useCallback, useEffect, useState } from 'react'
import { getUsers } from '../services/users'
import type {
  SystemUser,
  UsersPagination,
} from '../services/users'

export const useUsers = (initialPage = 1, limit = 10) => {
  const [users, setUsers] = useState<SystemUser[]>([])
  const [pagination, setPagination] = useState<UsersPagination | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchUsers = useCallback(async (page = initialPage) => {
    try {
      setLoading(true)
      setError('')

      const result = await getUsers({ page, limit })

      setUsers(result.users)
      setPagination(result.pagination)
    } catch (err) {
      const apiError = err as {
        response?: {
          data?: {
            message?: string
          }
        }
      }

      setError(
        apiError.response?.data?.message ||
        'Failed to retrieve users.'
      )
    } finally {
      setLoading(false)
    }
  }, [initialPage, limit])

  useEffect(() => {
    fetchUsers()
  }, [fetchUsers])

  return {
    users,
    pagination,
    loading,
    error,
    fetchUsers,
  }
}
