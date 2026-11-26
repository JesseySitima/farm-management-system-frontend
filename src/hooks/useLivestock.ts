
import { useCallback, useEffect, useState } from 'react'
import { getLivestock } from '../services/livestock'
import type { Livestock } from '../services/livestock'

export const useLivestock = () => {
  const [livestock, setLivestock] = useState<Livestock[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchLivestock = useCallback(async () => {
    try {
      setLoading(true)
      setError('')

      const data = await getLivestock()

      setLivestock(data)
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
        'Failed to retrieve livestock.'
      )
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchLivestock()
  }, [fetchLivestock])

  return {
    livestock,
    loading,
    error,
    fetchLivestock,
  }
}
