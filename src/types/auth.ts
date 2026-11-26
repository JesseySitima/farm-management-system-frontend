export type UserRole =
  | 'System Administrator'
  | 'Farm Owner'
  | 'Farm Manager'
  | 'Farm Supervisor'
  | 'Farm Worker'
  | 'Accountant'
  | 'Storekeeper'

export interface User {
  id: string
  first_name: string
  last_name: string
  email: string
  phone: string
  role_id: string
  role_name: UserRole
}

export interface AuthData {
  token: string
  user: User
}