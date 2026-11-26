
import { useState } from 'react'
import {
  Beef,
  Activity,
  Mars,
  Venus,
  Plus,
} from 'lucide-react'

import { useLivestock } from '../../hooks/useLivestock'
import RegisterLivestockModal from './components/CreateLivestockModal'

function LivestockPage() {
  const { livestock, loading, error, fetchLivestock } = useLivestock()
  const [showRegisterModal, setShowRegisterModal] = useState(false)

  const activeCount = livestock.filter(
    (animal) => animal.status === 'active'
  ).length

  const maleCount = livestock.filter(
    (animal) => animal.sex === 'male'
  ).length

  const femaleCount = livestock.filter(
    (animal) => animal.sex === 'female'
  ).length

  return (
    <div className="space-y-6">
      {/* Page heading */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Individual Livestock
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            View and manage individually registered animals across your farms.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowRegisterModal(true)}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-green-700 px-4 py-2.5 text-sm font-medium text-white hover:bg-green-800"
        >
          <Plus size={18} />
          Register Animal
        </button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-gray-500">
              Total Animals
            </p>
            <Beef className="text-green-700" size={22} />
          </div>
          <p className="mt-3 text-2xl font-bold text-gray-900">
            {loading ? '—' : livestock.length}
          </p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-gray-500">
              Active Animals
            </p>
            <Activity className="text-green-600" size={22} />
          </div>
          <p className="mt-3 text-2xl font-bold text-gray-900">
            {loading ? '—' : activeCount}
          </p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-gray-500">
              Male
            </p>
            <Mars className="text-blue-600" size={22} />
          </div>
          <p className="mt-3 text-2xl font-bold text-gray-900">
            {loading ? '—' : maleCount}
          </p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-gray-500">
              Female
            </p>
            <Venus className="text-pink-600" size={22} />
          </div>
          <p className="mt-3 text-2xl font-bold text-gray-900">
            {loading ? '—' : femaleCount}
          </p>
        </div>
      </div>

      {/* Livestock table */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
        <div className="border-b border-gray-200 px-5 py-4">
          <h2 className="font-semibold text-gray-900">
            Registered Animals
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            All individually registered livestock in the system.
          </p>
        </div>

        {loading ? (
          <div className="p-8 text-center text-sm text-gray-500">
            Loading livestock...
          </div>
        ) : error ? (
          <div className="p-8 text-center text-sm text-red-600">
            {error}
          </div>
        ) : livestock.length === 0 ? (
          <div className="p-8 text-center text-sm text-gray-500">
            No individual livestock has been registered yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                <tr>
                  <th className="px-5 py-3 font-semibold">Animal Code</th>
                  <th className="px-5 py-3 font-semibold">Species</th>
                  <th className="px-5 py-3 font-semibold">Breed</th>
                  <th className="px-5 py-3 font-semibold">Sex</th>
                  <th className="px-5 py-3 font-semibold">Date of Birth</th>
                  <th className="px-5 py-3 font-semibold">Status</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {livestock.map((animal) => (
                  <tr key={animal.id} className="hover:bg-gray-50">
                    <td className="px-5 py-4 font-medium text-gray-900">
                      {animal.animal_code}
                    </td>

                    <td className="px-5 py-4 text-gray-700">
                      {animal.species?.name || '—'}
                    </td>

                    <td className="px-5 py-4 text-gray-600">
                      {animal.breed || '—'}
                    </td>

                    <td className="px-5 py-4 capitalize text-gray-600">
                      {animal.sex || 'Unknown'}
                    </td>

                    <td className="px-5 py-4 text-gray-600">
                      {animal.date_of_birth
                        ? new Date(animal.date_of_birth).toLocaleDateString()
                        : '—'}
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                          animal.status === 'active'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {animal.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Register Animal Modal */}
      {showRegisterModal && (
        <RegisterLivestockModal
          onClose={() => setShowRegisterModal(false)}
          onSuccess={() => {
            setShowRegisterModal(false)
            fetchLivestock()
          }}
        />
      )}
    </div>
  )
}

export default LivestockPage
