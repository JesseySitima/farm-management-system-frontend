
import { useMemo, useState } from 'react'
import {
  ArrowDownLeft,
  ArrowUpRight,
  RefreshCw,
  Search,
  Package,
  TrendingUp,
  AlertTriangle,
  ArrowLeftRight,
} from 'lucide-react'
import { useStockMovements } from '../../hooks/useStockMovements'

type Tab = 'movements' | 'balances'

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('en-MW', {
    style: 'currency',
    currency: 'MWK',
    maximumFractionDigits: 2,
  }).format(value)

const formatNumber = (value: number) =>
  new Intl.NumberFormat('en-MW').format(value)

const formatDate = (value: string) =>
  new Date(`${value}T00:00:00`).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })

const formatMovementType = (value: string) =>
  value.replace(/_/g, ' ').replace(/\b\w/g, (letter) => letter.toUpperCase())

const StockMovements = () => {
  const {
    movements,
    balances,
    loading,
    error,
    fetchStockData,
  } = useStockMovements()

  const [activeTab, setActiveTab] = useState<Tab>('movements')
  const [searchTerm, setSearchTerm] = useState('')

  const totalMovements = movements.length

  const totalStockIn = movements
    .filter((movement) =>
      ['receipt', 'stock_in', 'purchase'].includes(
        movement.movement_type.toLowerCase()
      )
    )
    .reduce((total, movement) => total + movement.quantity, 0)

  const totalStockOut = movements
    .filter((movement) =>
      ['issue', 'stock_out', 'consumption', 'sale'].includes(
        movement.movement_type.toLowerCase()
      )
    )
    .reduce((total, movement) => total + movement.quantity, 0)

  const lowStockCount = balances.filter(
    (balance) =>
      balance.current_stock <= balance.inventory_item.minimum_stock_level
  ).length

  const filteredMovements = useMemo(() => {
    const search = searchTerm.toLowerCase().trim()

    if (!search) return movements

    return movements.filter((movement) =>
      [
        movement.inventory_items.name,
        movement.inventory_items.item_code,
        movement.farms.name,
        movement.farms.farm_code,
        movement.movement_type,
        movement.notes ?? '',
        movement.reference_id ?? '',
      ].some((value) => value.toLowerCase().includes(search))
    )
  }, [movements, searchTerm])

  const filteredBalances = useMemo(() => {
    const search = searchTerm.toLowerCase().trim()

    if (!search) return balances

    return balances.filter((balance) =>
      [
        balance.inventory_item.name,
        balance.inventory_item.item_code,
        balance.farm.name,
        balance.farm.farm_code,
      ].some((value) => value.toLowerCase().includes(search))
    )
  }, [balances, searchTerm])

  const isStockIn = (type: string) =>
    ['receipt', 'stock_in', 'purchase'].includes(type.toLowerCase())

  return (
    <div className="space-y-6">
      {/* Page heading */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Stock Movements
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Monitor stock transactions and current inventory balances across your farms.
          </p>
        </div>

        <button
          type="button"
          onClick={fetchStockData}
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <RefreshCw
            size={17}
            className={loading ? 'animate-spin' : ''}
          />
          Refresh
        </button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-gray-500">
              Total Movements
            </p>
            <div className="rounded-lg bg-blue-50 p-2 text-blue-600">
              <ArrowLeftRight size={20} />
            </div>
          </div>
          <p className="mt-3 text-2xl font-bold text-gray-900">
            {formatNumber(totalMovements)}
          </p>
          <p className="mt-1 text-xs text-gray-500">
            Recorded stock transactions
          </p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-gray-500">
              Stock Received
            </p>
            <div className="rounded-lg bg-green-50 p-2 text-green-600">
              <ArrowDownLeft size={20} />
            </div>
          </div>
          <p className="mt-3 text-2xl font-bold text-gray-900">
            {formatNumber(totalStockIn)}
          </p>
          <p className="mt-1 text-xs text-gray-500">
            Units recorded as received
          </p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-gray-500">
              Stock Issued
            </p>
            <div className="rounded-lg bg-orange-50 p-2 text-orange-600">
              <ArrowUpRight size={20} />
            </div>
          </div>
          <p className="mt-3 text-2xl font-bold text-gray-900">
            {formatNumber(totalStockOut)}
          </p>
          <p className="mt-1 text-xs text-gray-500">
            Units recorded as issued
          </p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-gray-500">
              Low Stock Items
            </p>
            <div className="rounded-lg bg-red-50 p-2 text-red-600">
              <AlertTriangle size={20} />
            </div>
          </div>
          <p className="mt-3 text-2xl font-bold text-gray-900">
            {formatNumber(lowStockCount)}
          </p>
          <p className="mt-1 text-xs text-gray-500">
            At or below minimum stock level
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex gap-6">
          <button
            type="button"
            onClick={() => {
              setActiveTab('movements')
              setSearchTerm('')
            }}
            className={`border-b-2 px-1 pb-3 text-sm font-medium ${
              activeTab === 'movements'
                ? 'border-green-700 text-green-700'
                : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
            }`}
          >
            Movement History
            <span className="ml-2 rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600">
              {movements.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('balances')
              setSearchTerm('')
            }}
            className={`border-b-2 px-1 pb-3 text-sm font-medium ${
              activeTab === 'balances'
                ? 'border-green-700 text-green-700'
                : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
            }`}
          >
            Stock Balances
            <span className="ml-2 rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600">
              {balances.length}
            </span>
          </button>
        </nav>
      </div>

      {/* Search */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-md">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder={
              activeTab === 'movements'
                ? 'Search movements, items or farms...'
                : 'Search items or farms...'
            }
            className="w-full rounded-lg border border-gray-300 py-2.5 pl-10 pr-4 text-sm outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100"
          />
        </div>

        <p className="text-sm text-gray-500">
          {activeTab === 'movements'
            ? `${filteredMovements.length} movement(s)`
            : `${filteredBalances.length} balance(s)`}
        </p>
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          <div className="flex items-center justify-between gap-3">
            <span>{error}</span>
            <button
              type="button"
              onClick={fetchStockData}
              className="font-medium underline"
            >
              Try again
            </button>
          </div>
        </div>
      )}

      {/* Loading */}
      {loading ? (
        <div className="rounded-xl border border-gray-200 bg-white py-16 text-center">
          <RefreshCw
            size={28}
            className="mx-auto animate-spin text-green-700"
          />
          <p className="mt-3 text-sm text-gray-500">
            Loading stock data...
          </p>
        </div>
      ) : (
        <>
          {/* Movement History */}
          {activeTab === 'movements' && (
            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[1050px] text-left text-sm">
                  <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                    <tr>
                      <th className="px-5 py-4 font-semibold">Date</th>
                      <th className="px-5 py-4 font-semibold">Item</th>
                      <th className="px-5 py-4 font-semibold">Farm</th>
                      <th className="px-5 py-4 font-semibold">Movement Type</th>
                      <th className="px-5 py-4 text-right font-semibold">Quantity</th>
                      <th className="px-5 py-4 text-right font-semibold">Unit Cost</th>
                      <th className="px-5 py-4 font-semibold">Reference</th>
                      <th className="px-5 py-4 font-semibold">Notes</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-gray-100">
                    {filteredMovements.map((movement) => (
                      <tr key={movement.id} className="hover:bg-gray-50">
                        <td className="whitespace-nowrap px-5 py-4 text-gray-600">
                          {formatDate(movement.movement_date)}
                        </td>

                        <td className="px-5 py-4">
                          <p className="font-medium text-gray-900">
                            {movement.inventory_items.name}
                          </p>
                          <p className="mt-1 text-xs text-gray-500">
                            {movement.inventory_items.item_code}
                          </p>
                        </td>

                        <td className="px-5 py-4">
                          <p className="font-medium text-gray-900">
                            {movement.farms.name}
                          </p>
                          <p className="mt-1 text-xs text-gray-500">
                            {movement.farms.farm_code}
                          </p>
                        </td>

                        <td className="px-5 py-4">
                          <span
                            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${
                              isStockIn(movement.movement_type)
                                ? 'bg-green-50 text-green-700'
                                : 'bg-orange-50 text-orange-700'
                            }`}
                          >
                            {isStockIn(movement.movement_type) ? (
                              <ArrowDownLeft size={13} />
                            ) : (
                              <ArrowUpRight size={13} />
                            )}
                            {formatMovementType(movement.movement_type)}
                          </span>
                        </td>

                        <td className="whitespace-nowrap px-5 py-4 text-right font-semibold text-gray-900">
                          {formatNumber(movement.quantity)}{' '}
                          <span className="text-xs font-normal text-gray-500">
                            {movement.inventory_items.unit_of_measure}
                          </span>
                        </td>

                        <td className="whitespace-nowrap px-5 py-4 text-right text-gray-600">
                          {movement.unit_cost != null
                            ? formatCurrency(movement.unit_cost)
                            : '—'}
                        </td>

                        <td className="px-5 py-4 text-gray-600">
                          {movement.reference_type
                            ? formatMovementType(movement.reference_type)
                            : '—'}
                        </td>

                        <td className="max-w-[200px] truncate px-5 py-4 text-gray-500">
                          {movement.notes || '—'}
                        </td>
                      </tr>
                    ))}

                    {filteredMovements.length === 0 && (
                      <tr>
                        <td
                          colSpan={8}
                          className="px-5 py-14 text-center"
                        >
                          <ArrowLeftRight
                            size={30}
                            className="mx-auto text-gray-300"
                          />
                          <p className="mt-3 font-medium text-gray-700">
                            No stock movements found
                          </p>
                          <p className="mt-1 text-sm text-gray-500">
                            Stock transactions will appear here when recorded.
                          </p>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Stock Balances */}
          {activeTab === 'balances' && (
            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[900px] text-left text-sm">
                  <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                    <tr>
                      <th className="px-5 py-4 font-semibold">Inventory Item</th>
                      <th className="px-5 py-4 font-semibold">Farm</th>
                      <th className="px-5 py-4 text-right font-semibold">Quantity In</th>
                      <th className="px-5 py-4 text-right font-semibold">Quantity Out</th>
                      <th className="px-5 py-4 text-right font-semibold">Current Stock</th>
                      <th className="px-5 py-4 text-right font-semibold">Minimum Level</th>
                      <th className="px-5 py-4 font-semibold">Status</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-gray-100">
                    {filteredBalances.map((balance) => {
                      const isLow =
                        balance.current_stock <=
                        balance.inventory_item.minimum_stock_level

                      return (
                        <tr
                          key={`${balance.farm_id}-${balance.inventory_item_id}`}
                          className="hover:bg-gray-50"
                        >
                          <td className="px-5 py-4">
                            <p className="font-medium text-gray-900">
                              {balance.inventory_item.name}
                            </p>
                            <p className="mt-1 text-xs text-gray-500">
                              {balance.inventory_item.item_code}
                            </p>
                          </td>

                          <td className="px-5 py-4">
                            <p className="font-medium text-gray-900">
                              {balance.farm.name}
                            </p>
                            <p className="mt-1 text-xs text-gray-500">
                              {balance.farm.farm_code}
                            </p>
                          </td>

                          <td className="whitespace-nowrap px-5 py-4 text-right text-green-700">
                            {formatNumber(balance.quantity_in)}{' '}
                            {balance.inventory_item.unit_of_measure}
                          </td>

                          <td className="whitespace-nowrap px-5 py-4 text-right text-orange-700">
                            {formatNumber(balance.quantity_out)}{' '}
                            {balance.inventory_item.unit_of_measure}
                          </td>

                          <td className="whitespace-nowrap px-5 py-4 text-right font-bold text-gray-900">
                            {formatNumber(balance.current_stock)}{' '}
                            {balance.inventory_item.unit_of_measure}
                          </td>

                          <td className="whitespace-nowrap px-5 py-4 text-right text-gray-600">
                            {formatNumber(
                              balance.inventory_item.minimum_stock_level
                            )}{' '}
                            {balance.inventory_item.unit_of_measure}
                          </td>

                          <td className="px-5 py-4">
                            <span
                              className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
                                isLow
                                  ? 'bg-red-50 text-red-700'
                                  : 'bg-green-50 text-green-700'
                              }`}
                            >
                              {isLow ? 'Low Stock' : 'Healthy'}
                            </span>
                          </td>
                        </tr>
                      )
                    })}

                    {filteredBalances.length === 0 && (
                      <tr>
                        <td
                          colSpan={7}
                          className="px-5 py-14 text-center"
                        >
                          <Package
                            size={30}
                            className="mx-auto text-gray-300"
                          />
                          <p className="mt-3 font-medium text-gray-700">
                            No stock balances found
                          </p>
                          <p className="mt-1 text-sm text-gray-500">
                            Stock balances will appear here when inventory is recorded.
                          </p>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default StockMovements
