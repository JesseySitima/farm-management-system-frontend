
import { useCallback, useEffect, useState } from 'react'
import { getFarms } from '../services/farms'
import type { Farm } from '../services/farms'

export const useFarms = () => {
  const [farms, setFarms] = useState<Farm[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchFarms = useCallback(async () => {
    try {
      setLoading(true)
      setError('')

      const data = await getFarms()

      setFarms(data)
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
        'Failed to retrieve farms.'
      )
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchFarms()
  }, [fetchFarms])

  return {
    farms,
    loading,
    error,
    fetchFarms,
  }
}
