
import { useCallback, useEffect, useState } from 'react'
import { getSpecies } from '../services/species'
import type { Species } from '../services/species'

export const useSpecies = () => {
  const [species, setSpecies] = useState<Species[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchSpecies = useCallback(async () => {
    try {
      setLoading(true)
      setError('')

      const data = await getSpecies()

      setSpecies(data)
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
        'Failed to retrieve species.'
      )
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchSpecies()
  }, [fetchSpecies])

  return {
    species,
    loading,
    error,
    fetchSpecies,
  }
}
