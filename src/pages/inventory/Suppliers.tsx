
import { useState } from 'react'
import {
  Truck,
  CheckCircle,
  XCircle,
  RefreshCw,
  Plus,
  Mail,
  Phone,
} from 'lucide-react'

import { useSuppliers } from '../../hooks/useSuppliers'
import CreateSupplierModal from './components/CreateSupplierModal'

const Suppliers = () => {
  const [showCreateModal, setShowCreateModal] = useState(false)

  const {
    suppliers,
    loading,
    error,
    fetchSuppliers,
  } = useSuppliers()

  const activeSuppliers = suppliers.filter(
    (supplier) => supplier.is_active
  ).length

  const inactiveSuppliers = suppliers.length - activeSuppliers

  const stats = [
    {
      label: 'Total Suppliers',
      value: suppliers.length,
      icon: Truck,
    },
    {
      label: 'Active Suppliers',
      value: activeSuppliers,
      icon: CheckCircle,
    },
    {
      label: 'Inactive Suppliers',
      value: inactiveSuppliers,
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
            Suppliers
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Manage suppliers providing feeds, veterinary products
            and other farm supplies.
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
          Add Supplier
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

      {/* Suppliers table */}
      <div className="rounded-xl border border-gray-200 bg-white">

        <div className="flex items-center justify-between
          border-b border-gray-200 p-5">

          <div>
            <h2 className="font-semibold text-gray-900">
              All Suppliers
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Suppliers registered in the system.
            </p>
          </div>

          <button
            type="button"
            onClick={fetchSuppliers}
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
            Loading suppliers...
          </div>
        ) : error ? (
          <div className="p-10 text-center">
            <p className="text-sm text-red-600">{error}</p>

            <button
              type="button"
              onClick={fetchSuppliers}
              className="mt-3 text-sm font-medium
                text-green-700 hover:underline"
            >
              Try again
            </button>
          </div>
        ) : suppliers.length === 0 ? (
          <div className="p-10 text-center">
            <Truck size={32} className="mx-auto text-gray-300" />

            <p className="mt-3 text-sm font-medium text-gray-700">
              No suppliers found.
            </p>

            <p className="mt-1 text-sm text-gray-500">
              Add your first supplier to get started.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">

              <thead className="bg-gray-50 text-gray-500">
                <tr>
                  <th className="px-5 py-3 font-medium">
                    Supplier
                  </th>

                  <th className="px-5 py-3 font-medium">
                    Contact Person
                  </th>

                  <th className="px-5 py-3 font-medium">
                    Contact Details
                  </th>

                  <th className="px-5 py-3 font-medium">
                    Address
                  </th>

                  <th className="px-5 py-3 font-medium">
                    Status
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {suppliers.map((supplier) => (
                  <tr
                    key={supplier.id}
                    className="hover:bg-gray-50"
                  >
                    <td className="px-5 py-4">
                      <p className="font-medium text-gray-900">
                        {supplier.name}
                      </p>

                      <p className="mt-1 text-xs text-gray-500">
                        {supplier.supplier_code}
                      </p>
                    </td>

                    <td className="px-5 py-4 text-gray-600">
                      {supplier.contact_person || '—'}
                    </td>

                    <td className="px-5 py-4">
                      {supplier.phone && (
                        <p className="flex items-center gap-2
                          text-gray-600">
                          <Phone size={13} />
                          {supplier.phone}
                        </p>
                      )}

                      {supplier.email && (
                        <p className="mt-1 flex items-center
                          gap-2 text-gray-600">
                          <Mail size={13} />
                          {supplier.email}
                        </p>
                      )}

                      {!supplier.phone && !supplier.email && '—'}
                    </td>

                    <td className="px-5 py-4 text-gray-600">
                      {supplier.address || '—'}
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex rounded-full
                          px-2.5 py-1 text-xs font-medium ${
                            supplier.is_active
                              ? 'bg-green-100 text-green-700'
                              : 'bg-gray-100 text-gray-600'
                          }`}
                      >
                        {supplier.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>

            </table>
          </div>
        )}
      </div>

      {/* Create Supplier Modal */}
      {showCreateModal && (
        <CreateSupplierModal
          onClose={() => setShowCreateModal(false)}
          onSuccess={fetchSuppliers}
        />
      )}

    </div>
  )
}

export default Suppliers
