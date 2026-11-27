
import { useCallback, useEffect, useState } from 'react'
import {
  getLivestockFlocks,
  type LivestockFlock,
} from '../services/livestockFlocks'

export const useLivestockFlocks = () => {
  const [flocks, setFlocks] = useState<LivestockFlock[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchFlocks = useCallback(async () => {
    try {
      setLoading(true)
      setError('')

      const data = await getLivestockFlocks()
      setFlocks(data)
    } catch {
      setError('Failed to retrieve livestock flocks.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchFlocks()
  }, [fetchFlocks])

  return {
    flocks,
    loading,
    error,
    fetchFlocks,
  }
}
