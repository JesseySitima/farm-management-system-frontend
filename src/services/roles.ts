import api from './api'

export interface Role {
  id: string
  name: string
  description: string | null
}

interface RolesResponse {
  success: boolean
  message: string
  data: Role[]
}

export const getActiveRoles = async (): Promise<Role[]> => {
  const response = await api.get<RolesResponse>('/roles')

  return response.data.data
}