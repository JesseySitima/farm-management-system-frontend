import { useCallback, useEffect, useState } from 'react'
import {
  getProductCollections,
  type ProductCollection,
} from '../services/productCollections'

export const useProductCollections = () => {
  const [collections, setCollections] = useState<ProductCollection[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchCollections = useCallback(async () => {
    try {
      setLoading(true)
      setError('')

      const data = await getProductCollections()
      setCollections(data)
    } catch {
      setError('Failed to retrieve product collections.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchCollections()
  }, [fetchCollections])

  return {
    collections,
    loading,
    error,
    fetchCollections,
  }
}