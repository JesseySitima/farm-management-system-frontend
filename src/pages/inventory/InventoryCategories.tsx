
import { useState } from 'react'
import { useInventoryCategories } from '../../hooks/useInventoryCategories'
import {
  Tags,
  CheckCircle,
  XCircle,
  RefreshCw,
  Plus,
} from 'lucide-react'

import CreateInventoryCategoryModal from './components/CreateInventoryCategoryModal'

const InventoryCategories = () => {
  const [showCreateModal, setShowCreateModal] = useState(false)

  const {
    categories,
    loading,
    error,
    fetchCategories,
  } = useInventoryCategories()

  const activeCategories = categories.filter(
    (category) => category.is_active
  ).length

  const inactiveCategories = categories.length - activeCategories

  const stats = [
    {
      label: 'Total Categories',
      value: categories.length,
      icon: Tags,
    },
    {
      label: 'Active Categories',
      value: activeCategories,
      icon: CheckCircle,
    },
    {
      label: 'Inactive Categories',
      value: inactiveCategories,
      icon: XCircle,
    },
  ]

  return (
    <div className="space-y-6">

      {/* Page heading */}
      <div className="flex flex-col gap-4 sm:flex-row
        sm:items-center sm:justify-between">

        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Inventory Categories
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Organise and manage the different categories of farm inventory.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowCreateModal(true)}
          className="inline-flex items-center justify-center
            gap-2 rounded-lg bg-green-700 px-4 py-2.5
            text-sm font-medium text-white
            hover:bg-green-800 transition"
        >
          <Plus size={18} />
          Add Category
        </button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 gap-4
        sm:grid-cols-2 lg:grid-cols-3">

        {stats.map((stat) => {
          const Icon = stat.icon

          return (
            <div
              key={stat.label}
              className="rounded-xl border border-gray-200
                bg-white p-5"
            >
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-500">
                  {stat.label}
                </p>

                <div className="rounded-lg bg-green-50 p-2">
                  <Icon size={19} className="text-green-700" />
                </div>
              </div>

              <p className="mt-3 text-2xl font-bold text-gray-900">
                {loading ? '—' : stat.value.toLocaleString()}
              </p>
            </div>
          )
        })}
      </div>

      {/* Categories table */}
      <div className="rounded-xl border border-gray-200 bg-white">

        <div className="flex items-center justify-between
          border-b border-gray-200 p-5">

          <div>
            <h2 className="font-semibold text-gray-900">
              All Categories
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Inventory categories registered in the system.
            </p>
          </div>

          <button
            type="button"
            onClick={fetchCategories}
            disabled={loading}
            className="inline-flex items-center gap-2
              text-sm font-medium text-green-700
              hover:text-green-800 disabled:opacity-50"
          >
            <RefreshCw
              size={15}
              className={loading ? 'animate-spin' : ''}
            />
            Refresh
          </button>
        </div>

        {loading ? (
          <div className="p-10 text-center text-sm text-gray-500">
            Loading inventory categories...
          </div>
        ) : error ? (
          <div className="p-10 text-center">
            <p className="text-sm text-red-600">{error}</p>

            <button
              type="button"
              onClick={fetchCategories}
              className="mt-3 text-sm font-medium
                text-green-700 hover:underline"
            >
              Try again
            </button>
          </div>
        ) : categories.length === 0 ? (
          <div className="p-10 text-center">
            <Tags size={32} className="mx-auto text-gray-300" />

            <p className="mt-3 text-sm font-medium text-gray-700">
              No inventory categories found.
            </p>

            <p className="mt-1 text-sm text-gray-500">
              Add your first category to get started.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">

              <thead className="bg-gray-50 text-gray-500">
                <tr>
                  <th className="px-5 py-3 font-medium">
                    Category Name
                  </th>

                  <th className="px-5 py-3 font-medium">
                    Description
                  </th>

                  <th className="px-5 py-3 font-medium">
                    Date Created
                  </th>

                  <th className="px-5 py-3 font-medium">
                    Status
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {categories.map((category) => (
                  <tr key={category.id} className="hover:bg-gray-50">

                    <td className="px-5 py-4 font-medium text-gray-900">
                      {category.name}
                    </td>

                    <td className="px-5 py-4 text-gray-600">
                      {category.description || '—'}
                    </td>

                    <td className="px-5 py-4 text-gray-600">
                      {new Date(category.created_at).toLocaleDateString()}
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex rounded-full
                          px-2.5 py-1 text-xs font-medium ${
                            category.is_active
                              ? 'bg-green-100 text-green-700'
                              : 'bg-gray-100 text-gray-600'
                          }`}
                      >
                        {category.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>

                  </tr>
                ))}
              </tbody>

            </table>
          </div>
        )}
      </div>

      {/* Create category modal */}
      {showCreateModal && (
        <CreateInventoryCategoryModal
          onClose={() => setShowCreateModal(false)}
          onSuccess={fetchCategories}
        />
      )}

    </div>
  )
}

export default InventoryCategories
