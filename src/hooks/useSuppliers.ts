
import { useCallback, useEffect, useState } from 'react'
import {
  getSuppliers,
  type Supplier,
} from '../services/suppliers'

export const useSuppliers = () => {
  const [suppliers, setSuppliers] = useState<Supplier[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchSuppliers = useCallback(async () => {
    try {
      setLoading(true)
      setError('')

      const data = await getSuppliers()
      setSuppliers(data)
    } catch {
      setError('Failed to retrieve suppliers.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchSuppliers()
  }, [fetchSuppliers])

  return {
    suppliers,
    loading,
    error,
    fetchSuppliers,
  }
}
