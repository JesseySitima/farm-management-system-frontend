
import api from './api'

export interface Supplier {
  id: string
  supplier_code: string
  name: string
  contact_person: string | null
  phone: string | null
  email: string | null
  address: string | null
  description: string | null
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface CreateSupplierData {
  name: string
  address?: string
  contact_person?: string
  description?: string
  email?: string
  phone?: string
}

interface SuppliersResponse {
  success: boolean
  message: string
  data: Supplier[]
}

interface CreateSupplierResponse {
  success: boolean
  message: string
  data?: Supplier
}

export const getSuppliers = async (): Promise<Supplier[]> => {
  const response = await api.get<SuppliersResponse>('/suppliers')
  return response.data.data
}

export const createSupplier = async (
  supplierData: CreateSupplierData
): Promise<CreateSupplierResponse> => {
  const response = await api.post<CreateSupplierResponse>(
    '/suppliers',
    supplierData
  )

  return response.data
}
