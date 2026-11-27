import { useCallback, useEffect, useState } from 'react'
import {
  getProducts,
  type Product,
} from '../services/product'
export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true)
      setError('')

      const data = await getProducts()
      setProducts(data)
    } catch {
      setError('Failed to retrieve products.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  return {
    products,
    loading,
    error,
    fetchProducts,
  }
}