
import api from './api'

export interface LivestockSpecies {
  id: string
  code: string
  name: string
  management_type: 'individual' | 'flock'
}

export interface Livestock {
  id: string
  farm_id: string
  animal_code: string
  breed: string | null
  sex: 'male' | 'female' | 'unknown'
  date_of_birth: string | null
  acquisition_date: string | null
  acquisition_type: string | null
  status: string
  notes: string | null
  created_at: string
  updated_at: string
  species_id: string
  species: LivestockSpecies
}

interface LivestockResponse {
  success: boolean
  message: string
  data: Livestock[]
}

export interface RegisterLivestockData {
  farm_id: string
  species_id: string
  animal_code: string
  breed?: string
  sex?: 'male' | 'female' | 'unknown'
  date_of_birth?: string
  acquisition_date?: string
  acquisition_type?: string
  notes?: string
}

interface RegisterLivestockResponse {
  success: boolean
  message: string
  data?: Livestock
}

export const getLivestock = async (): Promise<Livestock[]> => {
  const response = await api.get<LivestockResponse>('/livestock')

  return response.data.data
}

export const registerLivestock = async (
  livestockData: RegisterLivestockData
): Promise<RegisterLivestockResponse> => {
  const response = await api.post<RegisterLivestockResponse>(
    '/livestock',
    livestockData
  )

  return response.data
}
