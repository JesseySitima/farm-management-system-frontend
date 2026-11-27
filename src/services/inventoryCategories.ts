
import api from './api'

export interface InventoryCategory {
  id: string
  name: string
  description: string | null
  is_active: boolean
  created_at: string
  updated_at: string
}

interface InventoryCategoriesResponse {
  success: boolean
  message: string
  data: InventoryCategory[]
}

export interface CreateInventoryCategoryData {
  name: string
  description?: string
}

interface CreateInventoryCategoryResponse {
  success: boolean
  message: string
  data?: InventoryCategory
}

export const getInventoryCategories = async (): Promise<InventoryCategory[]> => {
  const response = await api.get<InventoryCategoriesResponse>(
    '/inventory-categories'
  )

  return response.data.data
}

export const createInventoryCategory = async (
  categoryData: CreateInventoryCategoryData
): Promise<CreateInventoryCategoryResponse> => {
  const response = await api.post<CreateInventoryCategoryResponse>(
    '/inventory-categories',
    categoryData
  )

  return response.data
}
