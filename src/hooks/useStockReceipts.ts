
import { useCallback, useEffect, useState } from 'react'
import {
  getStockReceipts,
  type StockReceipt,
} from '../services/stockReceipts'

export const useStockReceipts = () => {
  const [receipts, setReceipts] = useState<StockReceipt[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchReceipts = useCallback(async () => {
    try {
      setLoading(true)
      setError('')

      const data = await getStockReceipts()
      setReceipts(data)
    } catch {
      setError('Failed to retrieve stock receipts.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchReceipts()
  }, [fetchReceipts])

  return {
    receipts,
    loading,
    error,
    fetchReceipts,
  }
}
