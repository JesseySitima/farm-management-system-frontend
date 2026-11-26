import { useEffect, useState } from 'react'
import { getActiveRoles } from '../services/roles'
import type { Role } from '../services/roles'

export const useRoles = () => {
  const [roles, setRoles] = useState<Role[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        setLoading(true)
        setError('')

        const data = await getActiveRoles()
        setRoles(data)
      } catch {
        setError('Failed to retrieve roles.')
      } finally {
        setLoading(false)
      }
    }

    fetchRoles()
  }, [])

  return { roles, loading, error }
}