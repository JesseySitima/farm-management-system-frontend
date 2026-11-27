
import api from './api'

export interface InventoryItemCategory {
  id: string
  name: string
}

export interface InventoryItem {
  id: string
  item_code: string
  name: string
  category_id: string
  unit_of_measure: string
  minimum_stock_level: number
  description: string | null
  is_active: boolean
  created_at: string
  updated_at: string
  inventory_categories: InventoryItemCategory
}

export interface CreateInventoryItemData {
  category_id: string
  name: string
  unit_of_measure: string
  description?: string
  minimum_stock_level?: number
}

interface InventoryItemsResponse {
  success: boolean
  message: string
  data: InventoryItem[]
}

interface CreateInventoryItemResponse {
  success: boolean
  message: string
  data?: InventoryItem
}

export const getInventoryItems = async (): Promise<InventoryItem[]> => {
  const response = await api.get<InventoryItemsResponse>(
    '/inventory-items'
  )

  return response.data.data
}

export const createInventoryItem = async (
  itemData: CreateInventoryItemData
): Promise<CreateInventoryItemResponse> => {
  const response = await api.post<CreateInventoryItemResponse>(
    '/inventory-items',
    itemData
  )

  return response.data
}
