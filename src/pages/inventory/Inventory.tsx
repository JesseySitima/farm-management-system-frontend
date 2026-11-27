import { useMemo, useState } from 'react'
import {
  Package,
  AlertTriangle,
  PackageX,
  Warehouse,
  RefreshCw,
} from 'lucide-react'
import { useStockMovements } from '../../hooks/useStockMovements'
import { useFarms } from '../../hooks/useFarms'
import CreateStockReceiptModal from './components/CreateStockReceiptModal'
import IssueStockModal from './components/IssueStockModal'
import StockAdjustmentModal from './components/StockAdjustmentMOdal'


const Inventory = () => {
  const { balances, loading, error, fetchStockData } = useStockMovements()
  const { farms } = useFarms()
  const [showReceiveModal, setShowReceiveModal] = useState(false)
const [showIssueModal, setShowIssueModal] = useState(false)
const [showAdjustmentModal, setShowAdjustmentModal] = useState(false)

  const [selectedFarm, setSelectedFarm] = useState('all')

  const filteredBalances = useMemo(() => {
    if (selectedFarm === 'all') return balances

    return balances.filter(
      (balance) => balance.farm_id === selectedFarm
    )
  }, [balances, selectedFarm])

  const totalItems = filteredBalances.length

  const lowStockItems = filteredBalances.filter(
    (balance) =>
      balance.current_stock > 0 &&
      balance.current_stock <= balance.inventory_item.minimum_stock_level
  ).length

  const outOfStockItems = filteredBalances.filter(
    (balance) => balance.current_stock <= 0
  ).length

  const totalQuantity = filteredBalances.reduce(
    (total, balance) => total + balance.current_stock,
    0
  )

  const formatNumber = (value: number) =>
    new Intl.NumberFormat('en-MW').format(value)

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Inventory</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage stock levels and inventory operations across your farms.
          </p>
        </div>

        <button
          onClick={fetchStockData}
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
        >
          <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
          Refresh
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard
          title="Stock Records"
          value={formatNumber(totalItems)}
          icon={<Package size={20} />}
          description="Farm and item combinations"
        />

        <SummaryCard
          title="Total Quantity"
          value={formatNumber(totalQuantity)}
          icon={<Warehouse size={20} />}
          description="Combined current stock"
        />

        <SummaryCard
          title="Low Stock Items"
          value={formatNumber(lowStockItems)}
          icon={<AlertTriangle size={20} />}
          description="At or below minimum level"
        />

        <SummaryCard
          title="Out of Stock"
          value={formatNumber(outOfStockItems)}
          icon={<PackageX size={20} />}
          description="Items with no available stock"
        />
      </div>
      <div className="rounded-xl border border-gray-200 bg-white p-5">
  <div className="mb-4">
    <h2 className="text-lg font-semibold text-gray-900">
      Quick Actions
    </h2>
    <p className="text-sm text-gray-500">
      Manage your inventory operations.
    </p>
  </div>

  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
    <button
      onClick={() => setShowReceiveModal(true)}
      className="flex items-center gap-3 rounded-lg border border-gray-200 p-4 text-left transition hover:border-green-500 hover:bg-green-50"
    >
      <Package size={22} className="text-green-700" />
      <div>
        <p className="font-semibold text-gray-900">Receive Stock</p>
        <p className="text-xs text-gray-500">Record incoming supplies</p>
      </div>
    </button>

    <button
      onClick={() => setShowIssueModal(true)}
      className="flex items-center gap-3 rounded-lg border border-gray-200 p-4 text-left transition hover:border-blue-500 hover:bg-blue-50"
    >
      <PackageX size={22} className="text-blue-700" />
      <div>
        <p className="font-semibold text-gray-900">Issue Stock</p>
        <p className="text-xs text-gray-500">Record stock issued</p>
      </div>
    </button>

    <button
      onClick={() => setShowAdjustmentModal(true)}
      className="flex items-center gap-3 rounded-lg border border-gray-200 p-4 text-left transition hover:border-amber-500 hover:bg-amber-50"
    >
      <RefreshCw size={22} className="text-amber-700" />
      <div>
        <p className="font-semibold text-gray-900">Adjust Stock</p>
        <p className="text-xs text-gray-500">Correct stock quantities</p>
      </div>
    </button>
  </div>
</div>

      <div className="rounded-xl border border-gray-200 bg-white p-5">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Stock Balances
            </h2>
            <p className="text-sm text-gray-500">
              Current inventory quantities across your farms.
            </p>
          </div>

          <select
            value={selectedFarm}
            onChange={(event) => setSelectedFarm(event.target.value)}
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700 outline-none focus:border-green-600"
          >
            <option value="all">All Farms</option>
            {farms.map((farm) => (
              <option key={farm.id} value={farm.id}>
                {farm.name}
              </option>
            ))}
          </select>
        </div>

        {error ? (
          <div className="rounded-lg bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        ) : loading ? (
          <div className="py-12 text-center text-sm text-gray-500">
            Loading stock balances...
          </div>
        ) : filteredBalances.length === 0 ? (
          <div className="py-12 text-center">
            <Package size={32} className="mx-auto mb-3 text-gray-400" />
            <p className="font-medium text-gray-700">
              No stock balances found
            </p>
            <p className="mt-1 text-sm text-gray-500">
              Stock balances will appear here once stock has been received.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-gray-200 text-xs uppercase text-gray-500">
                  <th className="px-4 py-3 font-medium">Item</th>
                  <th className="px-4 py-3 font-medium">Item Code</th>
                  <th className="px-4 py-3 font-medium">Farm</th>
                  <th className="px-4 py-3 font-medium">Quantity In</th>
                  <th className="px-4 py-3 font-medium">Quantity Out</th>
                  <th className="px-4 py-3 font-medium">Current Stock</th>
                  <th className="px-4 py-3 font-medium">Minimum Level</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {filteredBalances.map((balance) => {
                  const isOutOfStock = balance.current_stock <= 0
                  const isLowStock =
                    !isOutOfStock &&
                    balance.current_stock <=
                      balance.inventory_item.minimum_stock_level

                  return (
                    <tr
                      key={`${balance.farm_id}-${balance.inventory_item_id}`}
                      className="hover:bg-gray-50"
                    >
                      <td className="px-4 py-3 font-medium text-gray-900">
                        {balance.inventory_item.name}
                      </td>

                      <td className="px-4 py-3 text-gray-600">
                        {balance.inventory_item.item_code}
                      </td>

                      <td className="px-4 py-3 text-gray-600">
                        {balance.farm.name}
                      </td>

                      <td className="px-4 py-3 text-gray-600">
                        {formatNumber(balance.quantity_in)}
                      </td>

                      <td className="px-4 py-3 text-gray-600">
                        {formatNumber(balance.quantity_out)}
                      </td>

                      <td className="px-4 py-3 font-semibold text-gray-900">
                        {formatNumber(balance.current_stock)}{' '}
                        {balance.inventory_item.unit_of_measure}
                      </td>

                      <td className="px-4 py-3 text-gray-600">
                        {formatNumber(
                          balance.inventory_item.minimum_stock_level
                        )}
                      </td>

                      <td className="px-4 py-3">
                        {isOutOfStock ? (
                          <StatusBadge label="Out of Stock" color="red" />
                        ) : isLowStock ? (
                          <StatusBadge label="Low Stock" color="amber" />
                        ) : (
                          <StatusBadge label="In Stock" color="green" />
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
      {showReceiveModal && (
  <CreateStockReceiptModal
    onClose={() => setShowReceiveModal(false)}
    onSuccess={fetchStockData}
  />
)}

{showIssueModal && (
  <IssueStockModal
    balances={balances}
    onClose={() => setShowIssueModal(false)}
    onSuccess={fetchStockData}
  />
)}

{showAdjustmentModal && (
  <StockAdjustmentModal
    balances={balances}
    onClose={() => setShowAdjustmentModal(false)}
    onSuccess={fetchStockData}
  />
)}
    </div>
  )
}

interface SummaryCardProps {
  title: string
  value: string
  icon: React.ReactNode
  description: string
}

const SummaryCard = ({
  title,
  value,
  icon,
  description,
}: SummaryCardProps) => (
  <div className="rounded-xl border border-gray-200 bg-white p-5">
    <div className="flex items-center justify-between">
      <p className="text-sm font-medium text-gray-500">{title}</p>
      <div className="rounded-lg bg-green-50 p-2 text-green-700">
        {icon}
      </div>
    </div>
    <p className="mt-3 text-2xl font-bold text-gray-900">{value}</p>
    <p className="mt-1 text-xs text-gray-500">{description}</p>
  </div>
)

const StatusBadge = ({
  label,
  color,
}: {
  label: string
  color: 'red' | 'amber' | 'green'
}) => {
  const styles = {
    red: 'bg-red-50 text-red-700',
    amber: 'bg-amber-50 text-amber-700',
    green: 'bg-green-50 text-green-700',
  }

  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${styles[color]}`}
    >
      {label}
    </span>
  )
}

export default Inventory