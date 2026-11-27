
import { useCallback, useEffect, useState } from 'react'
import {
  getInventoryItems,
  type InventoryItem,
} from '../services/inventoryItems'

export const useInventoryItems = () => {
  const [items, setItems] = useState<InventoryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchItems = useCallback(async () => {
    try {
      setLoading(true)
      setError('')

      const data = await getInventoryItems()
      setItems(data)
    } catch {
      setError('Failed to retrieve inventory items.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchItems()
  }, [fetchItems])

  return {
    items,
    loading,
    error,
    fetchItems,
  }
}
