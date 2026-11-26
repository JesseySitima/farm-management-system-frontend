
import { useState } from 'react'
import { Building2, MapPin, Plus } from 'lucide-react'
import { toast } from 'sonner'

import { useFarms } from '../../hooks/useFarms'
import CreateFarmModal from './components/CreateFarmModal'

function FarmsPage() {
  const [showCreateModal, setShowCreateModal] = useState(false)

  const {
    farms,
    loading,
    error,
    fetchFarms,
  } = useFarms()

  return (
    <div className="space-y-6">

      {/* Page heading */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-green-700 mb-2">
            Farm Administration
          </p>

          <h1 className="text-2xl font-bold text-gray-900">
            Farms
          </h1>

          <p className="text-gray-500 mt-1">
            Manage registered farms and their information.
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center justify-center gap-2 bg-green-700 hover:bg-green-800 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition"
        >
          <Plus size={18} />
          Add New Farm
        </button>
      </div>

      {/* Farm statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">

        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">Total Farms</p>

            <div className="bg-green-50 text-green-700 p-2 rounded-lg">
              <Building2 size={20} />
            </div>
          </div>

          <h2 className="text-3xl font-bold text-gray-900 mt-4">
            {farms.length}
          </h2>

          <p className="text-xs text-gray-500 mt-1">
            Registered farms
          </p>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">Active Farms</p>

            <div className="bg-blue-50 text-blue-700 p-2 rounded-lg">
              <MapPin size={20} />
            </div>
          </div>

          <h2 className="text-3xl font-bold text-gray-900 mt-4">
            {farms.filter((farm) => farm.is_active).length}
          </h2>

          <p className="text-xs text-gray-500 mt-1">
            Currently active
          </p>
        </div>

      </div>

      {/* Farms list */}
      <div className="bg-white border border-gray-200 rounded-xl">

        <div className="p-5 border-b border-gray-200">
          <h2 className="font-semibold text-gray-900">
            Registered Farms
          </h2>

          <p className="text-sm text-gray-500 mt-1">
            Overview of all farms in the system.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">

            <thead className="bg-gray-50 text-gray-500">
              <tr>
                <th className="px-5 py-4 font-medium">Farm Name</th>
                <th className="px-5 py-4 font-medium">Farm Code</th>
                <th className="px-5 py-4 font-medium">Location</th>
                <th className="px-5 py-4 font-medium">District</th>
                <th className="px-5 py-4 font-medium">Size</th>
                <th className="px-5 py-4 font-medium">Status</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center text-gray-500">
                    Loading farms...
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center text-red-500">
                    {error}
                  </td>
                </tr>
              ) : farms.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center text-gray-400">
                    No farms registered yet.
                  </td>
                </tr>
              ) : (
                farms.map((farm) => (
                  <tr key={farm.id} className="border-t border-gray-100 hover:bg-gray-50">
                    <td className="px-5 py-4 font-medium text-gray-900">
                      {farm.name}
                    </td>

                    <td className="px-5 py-4 text-gray-600">
                      {farm.farm_code}
                    </td>

                    <td className="px-5 py-4 text-gray-600">
                      {farm.location}
                    </td>

                    <td className="px-5 py-4 text-gray-600">
                      {farm.district || '—'}
                    </td>

                    <td className="px-5 py-4 text-gray-600">
                      {farm.size ? `${farm.size} ${farm.size_unit || ''}` : '—'}
                    </td>

                    <td className="px-5 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                        farm.is_active
                          ? 'bg-green-100 text-green-700'
                          : 'bg-red-100 text-red-700'
                      }`}>
                        {farm.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

      </div>

      {/* Create Farm Modal */}
      {showCreateModal && (
        <CreateFarmModal
          onClose={() => setShowCreateModal(false)}
          onSuccess={() => {
            setShowCreateModal(false)
            toast.success('Farm registered successfully.')
            fetchFarms()
          }}
        />
      )}

    </div>
  )
}

export default FarmsPage
