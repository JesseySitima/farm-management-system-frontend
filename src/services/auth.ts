import api from './api'
import type { User, AuthData } from '../types/auth'

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

export interface RegisterUserData {
  first_name: string
  last_name: string
  email: string
  phone?: string
  password: string
  role_id?: string
}

export interface RegisterResponse {
  success: boolean
  message: string
  data?: User
}

export const registerUser = async (
  userData: RegisterUserData
): Promise<RegisterResponse> => {
  const response = await api.post<RegisterResponse>(
    '/auth/register',
    userData
  )

  return response.data
}