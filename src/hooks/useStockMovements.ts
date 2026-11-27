
import { useCallback, useEffect, useState } from 'react'
import {
  getStockMovements,
  getStockBalances,
  type StockMovement,
  type StockBalance,
} from '../services/stockMovements'

export const useStockMovements = () => {
  const [movements, setMovements] = useState<StockMovement[]>([])
  const [balances, setBalances] = useState<StockBalance[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchStockData = useCallback(async () => {
    try {
      setLoading(true)
      setError('')

      const [movementData, balanceData] = await Promise.all([
        getStockMovements(),
        getStockBalances(),
      ])

      setMovements(movementData)
      setBalances(balanceData)
    } catch {
      setError('Failed to retrieve stock movement data.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchStockData()
  }, [fetchStockData])

  return {
    movements,
    balances,
    loading,
    error,
    fetchStockData,
  }
}
