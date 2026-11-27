
import api from './api'

export interface StockMovementFarm {
  id: string
  name: string
  farm_code: string
}

export interface StockMovementInventoryItem {
  id: string
  name: string
  item_code: string
  unit_of_measure: string
}

export interface StockMovement {
  id: string
  farm_id: string
  inventory_item_id: string
  movement_type: string
  quantity: number
  unit_cost: number | null
  reference_type: string | null
  reference_id: string | null
  movement_date: string
  notes: string | null
  created_at: string
  farms: StockMovementFarm
  inventory_items: StockMovementInventoryItem
}

export interface StockBalanceFarm {
  id: string
  name: string
  farm_code: string
}

export interface StockBalanceInventoryItem {
  id: string
  name: string
  item_code: string
  unit_of_measure: string
  minimum_stock_level: number
}

export interface StockBalance {
  farm_id: string
  inventory_item_id: string
  farm: StockBalanceFarm
  inventory_item: StockBalanceInventoryItem
  quantity_in: number
  quantity_out: number
  current_stock: number
}

interface StockMovementsResponse {
  success: boolean
  message: string
  data: StockMovement[]
}

interface StockBalancesResponse {
  success: boolean
  message: string
  data: StockBalance[]
}

export const getStockMovements = async (): Promise<StockMovement[]> => {
  const response = await api.get<StockMovementsResponse>(
    '/stock-movements'
  )

  return response.data.data
}

export const getStockBalances = async (): Promise<StockBalance[]> => {
  const response = await api.get<StockBalancesResponse>(
    '/stock-movements/balances'
  )

  return response.data.data
}


export interface IssueStockData {
  farm_id: string
  inventory_item_id: string
  quantity: number
  movement_date?: string
  notes?: string
  reference_id?: string
  reference_type?: string
}

export interface CreateStockAdjustmentData {
  adjustment_direction: 'increase' | 'decrease'
  farm_id: string
  inventory_item_id: string
  quantity: number
  reason: string
  movement_date?: string
}


export const issueStock = async (
  issueData: IssueStockData
): Promise<void> => {
  await api.post('/stock-movements/issues', issueData)
}

export const createStockAdjustment = async (
  adjustmentData: CreateStockAdjustmentData
): Promise<void> => {
  await api.post('/stock-movements/adjustments', adjustmentData)
}


