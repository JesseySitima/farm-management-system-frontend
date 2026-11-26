
import { Users, UserPlus, Search, ShieldCheck } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

import CreateUserModal from './components/CreateUserModal'
import { useUsers } from '../../hooks/useUsers'
import { useRoles } from '../../hooks/useRoles'

function UsersPage() {
  const [showCreateModal, setShowCreateModal] = useState(false)

  const {
    users,
    pagination,
    loading,
    error,
    fetchUsers,
  } = useUsers()

  const {
    roles,
  } = useRoles()

  return (
    <div className="space-y-6">

      {/* Page heading */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-green-700 mb-2">
            User Administration
          </p>

          <h1 className="text-2xl font-bold text-gray-900">
            Users
          </h1>

          <p className="text-gray-500 mt-1">
            Manage system users, accounts and role assignments.
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center justify-center gap-2 bg-green-700 hover:bg-green-800 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition"
        >
          <UserPlus size={18} />
          Add New User
        </button>
      </div>

      {/* Temporary API status */}
      <p className="text-sm text-gray-500">
        {loading
          ? 'Loading users...'
          : error
            ? error
            : `Retrieved ${users.length} of ${pagination?.total ?? 0} users`}
      </p>

      {/* Statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">

        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">Total Users</p>

            <div className="bg-blue-50 text-blue-700 p-2 rounded-lg">
              <Users size={20} />
            </div>
          </div>

          <h2 className="text-3xl font-bold text-gray-900 mt-4">
            {pagination?.total ?? '—'}
          </h2>

          <p className="text-xs text-gray-500 mt-1">
            Registered system users
          </p>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">Available Roles</p>

            <div className="bg-green-50 text-green-700 p-2 rounded-lg">
              <ShieldCheck size={20} />
            </div>
          </div>

          <h2 className="text-3xl font-bold text-gray-900 mt-4">
            {roles.length || '—'}
          </h2>

          <p className="text-xs text-gray-500 mt-1">
            Active system roles
          </p>
        </div>

      </div>

      {/* Users table */}
      <div className="bg-white border border-gray-200 rounded-xl">

        <div className="p-5 border-b border-gray-200">
          <h2 className="font-semibold text-gray-900">
            All Users
          </h2>

          <p className="text-sm text-gray-500 mt-1">
            View and manage registered users.
          </p>

          <div className="relative mt-5 max-w-md">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="text"
              placeholder="Search users..."
              className="w-full border border-gray-300 rounded-lg pl-10 pr-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-green-600 focus:border-green-600"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray-500">
              <tr>
                <th className="px-5 py-4 font-medium">Name</th>
                <th className="px-5 py-4 font-medium">Email</th>
                <th className="px-5 py-4 font-medium">Phone</th>
                <th className="px-5 py-4 font-medium">Role</th>
                <th className="px-5 py-4 font-medium">Status</th>
                <th className="px-5 py-4 font-medium">Actions</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center text-gray-500">
                    Loading users...
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center text-red-500">
                    {error}
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center text-gray-400">
                    No users found.
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user.id} className="border-t border-gray-100 hover:bg-gray-50">
                    <td className="px-5 py-4 font-medium text-gray-900">
                      {user.first_name} {user.last_name}
                    </td>

                    <td className="px-5 py-4 text-gray-600">
                      {user.email}
                    </td>

                    <td className="px-5 py-4 text-gray-600">
                      {user.phone || '—'}
                    </td>

                    <td className="px-5 py-4 text-gray-600">
                      {user.role_name}
                    </td>

                    <td className="px-5 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                        user.is_active
                          ? 'bg-green-100 text-green-700'
                          : 'bg-red-100 text-red-700'
                      }`}>
                        {user.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>

                    <td className="px-5 py-4 text-gray-400">
                      —
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination information */}
        {pagination && (
          <div className="px-5 py-4 border-t border-gray-200 text-sm text-gray-500">
            Showing {users.length} of {pagination.total} users
          </div>
        )}

      </div>

      {/* Create User Modal */}
      {showCreateModal && (
        <CreateUserModal
          onClose={() => setShowCreateModal(false)}
          onSuccess={() => {
            setShowCreateModal(false)
            toast.success('User created successfully.')
            fetchUsers()
          }}
        />
      )}

    </div>
  )
}

export default UsersPage
