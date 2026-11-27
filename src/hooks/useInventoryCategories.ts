
import { useCallback, useEffect, useState } from 'react'
import {
  getInventoryCategories,
  type InventoryCategory,
} from '../services/inventoryCategories'

export const useInventoryCategories = () => {
  const [categories, setCategories] = useState<InventoryCategory[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchCategories = useCallback(async () => {
    try {
      setLoading(true)
      setError('')

      const data = await getInventoryCategories()
      setCategories(data)
    } catch {
      setError('Failed to retrieve inventory categories.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchCategories()
  }, [fetchCategories])

  return {
    categories,
    loading,
    error,
    fetchCategories,
  }
}
