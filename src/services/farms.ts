
import api from './api'

export interface Farm {
  id: string
  name: string
  farm_code: string
  description: string | null
  location: string
  district: string | null
  region: string | null
  size: number | null
  size_unit: string | null
  contact_person: string | null
  phone: string | null
  email: string | null
  is_active: boolean
  created_at: string
  updated_at: string
}

interface FarmsResponse {
  success: boolean
  message: string
  data: Farm[]
}

export interface CreateFarmData {
  name: string
  farm_code: string
  location: string
  description?: string
  district?: string
  region?: string
  size?: number
  size_unit?: string
  contact_person?: string
  phone?: string
  email?: string
}

interface CreateFarmResponse {
  success: boolean
  message: string
  data?: Farm
}

export const getFarms = async (): Promise<Farm[]> => {
  const response = await api.get<FarmsResponse>('/farms')

  return response.data.data
}

export const createFarm = async (
  farmData: CreateFarmData
): Promise<CreateFarmResponse> => {
  const response = await api.post<CreateFarmResponse>(
    '/farms',
    farmData
  )

  return response.data
}
