import api from './api'

export interface Product {
  id: string
  product_code: string
  name: string
  unit_of_measure: string
  description: string | null
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface CreateProductData {
  name: string
  unit_of_measure: string
  description?: string
}

interface ProductsResponse {
  data: Product[]
}

export const getProducts = async (): Promise<Product[]> => {
  const response = await api.get<ProductsResponse>('/products')

  return response.data.data
}

export const createProduct = async (
  productData: CreateProductData
): Promise<void> => {
  await api.post('/products', productData)
}