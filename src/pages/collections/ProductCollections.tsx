import { useMemo, useState } from 'react'
import { Search, RefreshCw, Plus, Package, CheckCircle, XCircle } from 'lucide-react'
import { useProductCollections } from '../../hooks/useProductCollections'
import CreateProductCollectionModal from './components/CreateProductCollectionModal'

const ProductCollections = () => {
  const { collections, loading, error, fetchCollections } =
    useProductCollections()

  const [searchTerm, setSearchTerm] = useState('')
  const [showCreateModal, setShowCreateModal] = useState(false)

  const filteredCollections = useMemo(() => {
    const term = searchTerm.toLowerCase()

    return collections.filter((collection) =>
      [
        collection.products?.name,
        collection.products?.product_code,
        collection.farms?.name,
        collection.livestock?.animal_code,
        collection.livestock_flocks?.flock_code,
        collection.quality_grade,
      ]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(term))
    )
  }, [collections, searchTerm])

  const totalQuantity = collections.reduce(
    (total, collection) => total + Number(collection.quantity || 0),
    0
  )

  const totalRejected = collections.reduce(
    (total, collection) => total + Number(collection.rejected_quantity || 0),
    0
  )

  const acceptedQuantity = totalQuantity - totalRejected

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Product Collections
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Record and monitor products collected from your livestock.
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={fetchCollections}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
          >
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
            Refresh
          </button>

        <button
  onClick={() => setShowCreateModal(true)}
  className="inline-flex items-center gap-2 rounded-lg bg-green-700 px-4 py-2 text-sm font-medium text-white hover:bg-green-800"
>
  <Plus size={16} />
  Record Collection
</button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard
          title="Collection Records"
          value={collections.length}
          icon={<Package size={20} />}
        />

        <SummaryCard
          title="Total Collected"
          value={totalQuantity.toLocaleString()}
          icon={<Package size={20} />}
        />

        <SummaryCard
          title="Accepted Quantity"
          value={acceptedQuantity.toLocaleString()}
          icon={<CheckCircle size={20} />}
        />

        <SummaryCard
          title="Rejected Quantity"
          value={totalRejected.toLocaleString()}
          icon={<XCircle size={20} />}
        />
      </div>

      <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="flex flex-col justify-between gap-3 border-b border-gray-200 p-4 sm:flex-row sm:items-center">
          <div>
            <h2 className="font-semibold text-gray-900">
              Collection History
            </h2>
            <p className="text-sm text-gray-500">
              View all recorded product collections.
            </p>
          </div>

          <div className="relative w-full sm:max-w-xs">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              placeholder="Search collections..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-3 text-sm outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100"
            />
          </div>
        </div>

        {error ? (
          <div className="p-8 text-center">
            <p className="text-sm text-red-600">{error}</p>
            <button
              onClick={fetchCollections}
              className="mt-3 text-sm font-medium text-green-700 hover:underline"
            >
              Try again
            </button>
          </div>
        ) : loading ? (
          <div className="p-10 text-center text-sm text-gray-500">
            Loading product collections...
          </div>
        ) : filteredCollections.length === 0 ? (
          <div className="p-10 text-center text-sm text-gray-500">
            {searchTerm
              ? 'No collections match your search.'
              : 'No product collections recorded yet.'}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                <tr>
                  <th className="px-4 py-3 font-semibold">Date</th>
                  <th className="px-4 py-3 font-semibold">Product</th>
                  <th className="px-4 py-3 font-semibold">Farm</th>
                  <th className="px-4 py-3 font-semibold">Source</th>
                  <th className="px-4 py-3 text-right font-semibold">
                    Collected
                  </th>
                  <th className="px-4 py-3 text-right font-semibold">
                    Rejected
                  </th>
                  <th className="px-4 py-3 font-semibold">Quality</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {filteredCollections.map((collection) => (
                  <tr key={collection.id} className="hover:bg-gray-50">
                    <td className="whitespace-nowrap px-4 py-3 text-gray-600">
                      {new Date(
                        `${collection.collection_date}T00:00:00`
                      ).toLocaleDateString()}
                    </td>

                    <td className="px-4 py-3">
                      <p className="font-medium text-gray-900">
                        {collection.products?.name || '—'}
                      </p>
                      <p className="text-xs text-gray-500">
                        {collection.products?.product_code || '—'}
                      </p>
                    </td>

                    <td className="px-4 py-3 text-gray-700">
                      {collection.farms?.name || '—'}
                    </td>

                    <td className="px-4 py-3 text-gray-700">
                      {collection.livestock_flocks
                        ? `Flock: ${collection.livestock_flocks.flock_code}`
                        : collection.livestock
                          ? `Animal: ${collection.livestock.animal_code}`
                          : '—'}
                    </td>

                    <td className="px-4 py-3 text-right font-medium text-gray-900">
                      {Number(collection.quantity).toLocaleString()}{' '}
                      {collection.products?.unit_of_measure || ''}
                    </td>

                    <td className="px-4 py-3 text-right text-red-600">
                      {Number(collection.rejected_quantity).toLocaleString()}
                    </td>

                    <td className="px-4 py-3">
                      {collection.quality_grade ? (
                        <span className="rounded-full bg-green-50 px-2.5 py-1 text-xs font-medium text-green-700">
                          {collection.quality_grade}
                        </span>
                      ) : (
                        '—'
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      {showCreateModal && (
  <CreateProductCollectionModal
    onClose={() => setShowCreateModal(false)}
    onSuccess={fetchCollections}
  />
)}
    </div>
  )
}

interface SummaryCardProps {
  title: string
  value: string | number
  icon: React.ReactNode
}

const SummaryCard = ({ title, value, icon }: SummaryCardProps) => (
  <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
    <div className="flex items-center justify-between">
      <p className="text-sm text-gray-500">{title}</p>
      <span className="rounded-lg bg-green-50 p-2 text-green-700">
        {icon}
      </span>
    </div>
    <p className="mt-3 text-2xl font-bold text-gray-900">{value}</p>
  </div>
)

export default ProductCollections