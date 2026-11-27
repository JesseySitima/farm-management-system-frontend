
import api from './api'

export interface FlockSpecies {
  id: string
  code: string
  name: string
  management_type: 'individual' | 'flock'
}

export interface FlockFarm {
  id: string
  name: string
  farm_code: string
}

export interface LivestockFlock {
  id: string
  farm_id: string
  species_id: string
  flock_code: string
  breed: string | null
  total_quantity: number
  male_quantity: number
  female_quantity: number
  purpose: string | null
  date_established: string | null
  status: string
  notes: string | null
  created_at: string
  updated_at: string
  species: FlockSpecies
  farms: FlockFarm
}

interface LivestockFlocksResponse {
  success: boolean
  message: string
  data: LivestockFlock[]
}

export interface CreateLivestockFlockData {
  farm_id: string
  species_id: string
  flock_code: string
  total_quantity: number
  breed?: string
  male_quantity?: number
  female_quantity?: number
  purpose?: string
  date_established?: string
  notes?: string
}

interface CreateLivestockFlockResponse {
  success: boolean
  message: string
  data?: LivestockFlock
}

export const getLivestockFlocks = async (): Promise<LivestockFlock[]> => {
  const response = await api.get<LivestockFlocksResponse>('/livestock-flocks')
  return response.data.data
}

export const createLivestockFlock = async (
  flockData: CreateLivestockFlockData
): Promise<CreateLivestockFlockResponse> => {
  const response = await api.post<CreateLivestockFlockResponse>(
    '/livestock-flocks',
    flockData
  )

  return response.data
}
