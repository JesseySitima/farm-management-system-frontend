
import api from './api'

export interface Species {
  id: string
  name: string
  code: string
  management_type: 'individual' | 'flock'
  description: string | null
  is_active: boolean
  created_at: string
  updated_at: string
}

interface SpeciesResponse {
  success: boolean
  message: string
  data: Species[]
}

export interface CreateSpeciesData {
  name: string
  code: string
  management_type: 'individual' | 'flock'
  description?: string
}

interface CreateSpeciesResponse {
  success: boolean
  message: string
  data?: Species
}

export const getSpecies = async (): Promise<Species[]> => {
  const response = await api.get<SpeciesResponse>('/species')

  return response.data.data
}

export const createSpecies = async (
  speciesData: CreateSpeciesData
): Promise<CreateSpeciesResponse> => {
  const response = await api.post<CreateSpeciesResponse>(
    '/species',
    speciesData
  )

  return response.data
}
