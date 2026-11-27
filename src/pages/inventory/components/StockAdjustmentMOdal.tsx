
import { useState } from 'react'
import { toast } from 'sonner'
import axios from 'axios'
import { X, SlidersHorizontal, Loader2 } from 'lucide-react'

import { useFarms } from '../../../hooks/useFarms'
import { useInventoryItems } from '../../../hooks/useInventoryItems'
import { useStockActions } from '../../../hooks/useStockActions'
import type { StockBalance } from '../../../services/stockMovements'

interface StockAdjustmentModalProps {
  balances: StockBalance[]
  onClose: () => void
  onSuccess: () => void
}

const getLocalDate = () => {
  const date = new Date()
  const offset = date.getTimezoneOffset()
  return new Date(date.getTime() - offset * 60000)
    .toISOString()
    .split('T')[0]
}

const StockAdjustmentModal = ({
  balances,
  onClose,
  onSuccess,
}: StockAdjustmentModalProps) => {
  const { farms } = useFarms()
  const { items } = useInventoryItems()
  const { adjusting, submitStockAdjustment } = useStockActions()

  const [farmId, setFarmId] = useState('')
  const [inventoryItemId, setInventoryItemId] = useState('')
  const [direction, setDirection] = useState<'increase' | 'decrease'>('increase')
  const [quantity, setQuantity] = useState('')
  const [reason, setReason] = useState('')
  const [movementDate, setMovementDate] = useState(getLocalDate())

  const selectedBalance = balances.find(
    (balance) =>
      balance.farm_id === farmId &&
      balance.inventory_item_id === inventoryItemId
  )

  const availableStock = selectedBalance?.current_stock ?? 0

  const selectedItem = items.find(
    (item) => item.id === inventoryItemId
  )

  const parsedQuantity = Number(quantity)

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!farmId || !inventoryItemId || !movementDate) {
      toast.error('Please complete all required fields.')
      return
    }

    if (!Number.isFinite(parsedQuantity) || parsedQuantity <= 0) {
      toast.error('Enter a valid quantity greater than zero.')
      return
    }

    if (!reason.trim()) {
      toast.error('Please provide a reason for the adjustment.')
      return
    }

    if (direction === 'decrease' && parsedQuantity > availableStock) {
      toast.error(
        `Insufficient stock. Only ${availableStock} ${selectedItem?.unit_of_measure ?? ''} available.`
      )
      return
    }

    try {
      await submitStockAdjustment({
        adjustment_direction: direction,
        farm_id: farmId,
        inventory_item_id: inventoryItemId,
        quantity: parsedQuantity,
        reason: reason.trim(),
        movement_date: movementDate,
      })

      toast.success('Stock adjustment created successfully.')
      onSuccess()
      onClose()
    } catch (error) {
      const message = axios.isAxiosError(error)
        ? error.response?.data?.message
        : null

      toast.error(
        message || 'Failed to adjust stock. Please try again.'
      )
    }
  }

  const inputClass =
    'w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100'

  const labelClass =
    'mb-1.5 block text-sm font-medium text-gray-700'

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-purple-50 p-2 text-purple-600">
              <SlidersHorizontal size={21} />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Stock Adjustment
              </h2>
              <p className="text-sm text-gray-500">
                Correct a farm's inventory balance.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={adjusting}
            className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-700"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="space-y-5 p-6">
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div>
                <label className={labelClass}>
                  Farm <span className="text-red-500">*</span>
                </label>
                <select
                  required
                  value={farmId}
                  onChange={(event) => {
                    setFarmId(event.target.value)
                    setInventoryItemId('')
                  }}
                  className={inputClass}
                >
                  <option value="">Select farm</option>
                  {farms
                    .filter((farm) => farm.is_active)
                    .map((farm) => (
                      <option key={farm.id} value={farm.id}>
                        {farm.name} ({farm.farm_code})
                      </option>
                    ))}
                </select>
              </div>

              <div>
                <label className={labelClass}>
                  Inventory Item <span className="text-red-500">*</span>
                </label>
                <select
                  required
                  value={inventoryItemId}
                  onChange={(event) =>
                    setInventoryItemId(event.target.value)
                  }
                  disabled={!farmId}
                  className={inputClass}
                >
                  <option value="">Select inventory item</option>
                  {items
                    .filter((item) => item.is_active)
                    .map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.name} ({item.item_code})
                      </option>
                    ))}
                </select>
              </div>
            </div>

            {farmId && inventoryItemId && (
              <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
                <p className="text-sm font-medium text-blue-800">
                  Current Stock
                </p>
                <p className="mt-1 text-xl font-bold text-blue-900">
                  {availableStock.toLocaleString()} {selectedItem?.unit_of_measure}
                </p>
                {!selectedBalance && (
                  <p className="mt-1 text-xs text-blue-700">
                    No stock balance is recorded for this item at the selected farm.
                  </p>
                )}
              </div>
            )}

            <div>
              <label className={labelClass}>
                Adjustment Direction <span className="text-red-500">*</span>
              </label>

              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setDirection('increase')}
                  className={`rounded-lg border px-4 py-3 text-sm font-medium ${
                    direction === 'increase'
                      ? 'border-green-600 bg-green-50 text-green-700'
                      : 'border-gray-300 text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  Increase Stock
                </button>

                <button
                  type="button"
                  onClick={() => setDirection('decrease')}
                  className={`rounded-lg border px-4 py-3 text-sm font-medium ${
                    direction === 'decrease'
                      ? 'border-red-600 bg-red-50 text-red-700'
                      : 'border-gray-300 text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  Decrease Stock
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div>
                <label className={labelClass}>
                  Adjustment Quantity <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  required
                  min="0.01"
                  step="0.01"
                  value={quantity}
                  onChange={(event) => setQuantity(event.target.value)}
                  placeholder="Enter quantity"
                  className={inputClass}
                />

                {direction === 'decrease' &&
                  quantity &&
                  parsedQuantity > availableStock && (
                    <p className="mt-1 text-xs text-red-600">
                      Quantity exceeds current stock.
                    </p>
                  )}
              </div>

              <div>
                <label className={labelClass}>
                  Adjustment Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  required
                  value={movementDate}
                  onChange={(event) => setMovementDate(event.target.value)}
                  className={inputClass}
                />
              </div>
            </div>

            <div>
              <label className={labelClass}>
                Reason for Adjustment <span className="text-red-500">*</span>
              </label>
              <textarea
                required
                rows={3}
                value={reason}
                onChange={(event) => setReason(event.target.value)}
                placeholder="Explain why this stock adjustment is necessary..."
                className={inputClass}
              />
              <p className="mt-1 text-xs text-gray-500">
                This reason will be recorded in the stock adjustment history.
              </p>
            </div>
          </div>

          <div className="flex justify-end gap-3 border-t border-gray-200 bg-gray-50 px-6 py-4">
            <button
              type="button"
              onClick={onClose}
              disabled={adjusting}
              className="rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={
                adjusting ||
                !farmId ||
                !inventoryItemId ||
                !quantity ||
                parsedQuantity <= 0 ||
                !reason.trim() ||
                (direction === 'decrease' && parsedQuantity > availableStock)
              }
              className="inline-flex items-center gap-2 rounded-lg bg-purple-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-purple-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {adjusting && <Loader2 size={16} className="animate-spin" />}
              {adjusting ? 'Saving...' : 'Save Adjustment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default StockAdjustmentModal
