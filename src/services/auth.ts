import api from './api'
import type { AuthData } from '../types/auth'

interface LoginResponse {
  success: boolean
  message: string
  data: AuthData
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