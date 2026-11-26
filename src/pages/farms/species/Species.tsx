
import { useState } from 'react'
import {
  Bird,
  Users,
  User,
  Plus,
} from 'lucide-react'

import { useSpecies } from '../../../hooks/useSpecies'
import CreateSpeciesModal from './components/CreateSpeciesModal'

function SpeciesPage() {
  const { species, loading, error, fetchSpecies } = useSpecies()
  const [showCreateModal, setShowCreateModal] = useState(false)

  const individualCount = species.filter(
    (item) => item.management_type === 'individual'
  ).length

  const flockCount = species.filter(
    (item) => item.management_type === 'flock'
  ).length

  return (
    <div className="space-y-6">
      {/* Page heading */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Species Management
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage the livestock species registered across your farms.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowCreateModal(true)}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-green-700 px-4 py-2.5 text-sm font-medium text-white hover:bg-green-800"
        >
          <Plus size={18} />
          Add Species
        </button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-gray-500">
              Total Species
            </p>
            <Bird className="text-green-700" size={22} />
          </div>
          <p className="mt-3 text-2xl font-bold text-gray-900">
            {loading ? '—' : species.length}
          </p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-gray-500">
              Individual Managed
            </p>
            <User className="text-blue-600" size={22} />
          </div>
          <p className="mt-3 text-2xl font-bold text-gray-900">
            {loading ? '—' : individualCount}
          </p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-gray-500">
              Flock Managed
            </p>
            <Users className="text-orange-600" size={22} />
          </div>
          <p className="mt-3 text-2xl font-bold text-gray-900">
            {loading ? '—' : flockCount}
          </p>
        </div>
      </div>

      {/* Species table */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
        <div className="border-b border-gray-200 px-5 py-4">
          <h2 className="font-semibold text-gray-900">
            Registered Species
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            All livestock species currently registered in the system.
          </p>
        </div>

        {loading ? (
          <div className="p-8 text-center text-sm text-gray-500">
            Loading species...
          </div>
        ) : error ? (
          <div className="p-8 text-center text-sm text-red-600">
            {error}
          </div>
        ) : species.length === 0 ? (
          <div className="p-8 text-center text-sm text-gray-500">
            No species have been registered yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                <tr>
                  <th className="px-5 py-3 font-semibold">Species</th>
                  <th className="px-5 py-3 font-semibold">Code</th>
                  <th className="px-5 py-3 font-semibold">Management</th>
                  <th className="px-5 py-3 font-semibold">Description</th>
                  <th className="px-5 py-3 font-semibold">Status</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {species.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-5 py-4 font-medium text-gray-900">
                      {item.name}
                    </td>

                    <td className="px-5 py-4 text-gray-600">
                      {item.code}
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                          item.management_type === 'flock'
                            ? 'bg-orange-100 text-orange-700'
                            : 'bg-blue-100 text-blue-700'
                        }`}
                      >
                        {item.management_type === 'flock'
                          ? 'Flock'
                          : 'Individual'}
                      </span>
                    </td>

                    <td className="px-5 py-4 text-gray-600">
                      {item.description || '—'}
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                          item.is_active
                            ? 'bg-green-100 text-green-700'
                            : 'bg-red-100 text-red-700'
                        }`}
                      >
                        {item.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create Species Modal */}
      {showCreateModal && (
        <CreateSpeciesModal
          onClose={() => setShowCreateModal(false)}
          onSuccess={() => {
            setShowCreateModal(false)
            fetchSpecies()
          }}
        />
      )}
    </div>
  )
}

export default SpeciesPage
