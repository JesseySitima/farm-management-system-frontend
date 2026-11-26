
import api from './api'

export interface SystemUser {
  id: string
  first_name: string
  last_name: string
  email: string
  phone: string | null
  role_id: string
  is_active: boolean
  must_change_password: boolean
  last_login_at: string | null
  created_at: string
  role_name: string
}

export interface UsersPagination {
  page: number
  limit: number
  total: number
  totalPages: number
}

interface UsersResponse {
  success: boolean
  message: string
  data: SystemUser[]
  pagination: UsersPagination
}

export interface GetUsersParams {
  page?: number
  limit?: number
}

export interface GetUsersResult {
  users: SystemUser[]
  pagination: UsersPagination
}

export const getUsers = async (
  params: GetUsersParams = {}
): Promise<GetUsersResult> => {
  const response = await api.get<UsersResponse>('/users', {
    params: {
      page: params.page ?? 1,
      limit: params.limit ?? 10,
    },
  })

  return {
    users: response.data.data,
    pagination: response.data.pagination,
  }
}
