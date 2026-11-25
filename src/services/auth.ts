
import api from './api'

export interface User {
  id: string
  first_name: string
  last_name: string
  email: string
  phone: string
  role_id: string
  role_name: string
}

interface LoginResponse {
  success: boolean
  message: string
  data: {
    token: string
    user: User
  }
}

export const login = async (
  email: string,
  password: string
): Promise<LoginResponse> => {
  const response = await api.post<LoginResponse>('/auth/login', {
    email,
    password,
  })

  return response.data
}
