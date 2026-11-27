
import api from './api'

export interface StockReceiptFarm {
  id: string
  name: string
  farm_code: string
}

export interface StockReceiptSupplier {
  id: string
  name: string
  supplier_code: string
}

export interface StockReceiptInventoryItem {
  id: string
  name: string
  item_code: string
  unit_of_measure: string
}

export interface StockReceiptItem {
  id: string
  stock_receipt_id: string
  inventory_item_id: string
  quantity: number
  unit_cost: number
  line_total: number
  created_at: string
  inventory_items: StockReceiptInventoryItem
}

export interface StockReceipt {
  id: string
  receipt_number: string
  farm_id: string
  supplier_id: string
  received_date: string
  supplier_reference: string | null
  notes: string | null
  created_at: string
  updated_at: string
  farms: StockReceiptFarm
  suppliers: StockReceiptSupplier
  stock_receipt_items: StockReceiptItem[]
}

export interface CreateStockReceiptItemData {
  inventory_item_id: string
  quantity: number
  unit_cost: number
}

export interface CreateStockReceiptData {
  farm_id: string
  supplier_id: string
  received_date: string
  supplier_reference?: string
  notes?: string
  items: CreateStockReceiptItemData[]
}

interface StockReceiptsResponse {
  success: boolean
  message: string
  data: StockReceipt[]
}

interface CreateStockReceiptResponse {
  success: boolean
  message: string
  data?: StockReceipt
}

export const getStockReceipts = async (): Promise<StockReceipt[]> => {
  const response = await api.get<StockReceiptsResponse>(
    '/stock-receipts'
  )

  return response.data.data
}

export const createStockReceipt = async (
  receiptData: CreateStockReceiptData
): Promise<CreateStockReceiptResponse> => {
  const response = await api.post<CreateStockReceiptResponse>(
    '/stock-receipts',
    receiptData
  )

  return response.data
}
