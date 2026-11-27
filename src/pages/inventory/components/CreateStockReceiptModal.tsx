
import { useState, type FormEvent } from 'react'
import {
  X,
  PackageCheck,
  Plus,
  Trash2,
  Loader2,
} from 'lucide-react'
import { toast } from 'sonner'

import { createStockReceipt } from '../../../services/stockReceipts'
import { useFarms } from '../../../hooks/useFarms'
import { useSuppliers } from '../../../hooks/useSuppliers'
import { useInventoryItems } from '../../../hooks/useInventoryItems'

interface CreateStockReceiptModalProps {
  onClose: () => void
  onSuccess: () => void | Promise<void>
}

interface ReceiptItemRow {
  rowId: number
  inventory_item_id: string
  quantity: string
  unit_cost: string
}

const getToday = () => {
  const today = new Date()
  const year = today.getFullYear()
  const month = String(today.getMonth() + 1).padStart(2, '0')
  const day = String(today.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}

const CreateStockReceiptModal = ({
  onClose,
  onSuccess,
}: CreateStockReceiptModalProps) => {
  const { farms, loading: loadingFarms } = useFarms()
  const { suppliers, loading: loadingSuppliers } = useSuppliers()
  const { items, loading: loadingItems } = useInventoryItems()

  const [farmId, setFarmId] = useState('')
  const [supplierId, setSupplierId] = useState('')
  const [receivedDate, setReceivedDate] = useState(getToday())
  const [supplierReference, setSupplierReference] = useState('')
  const [notes, setNotes] = useState('')

  const [receiptItems, setReceiptItems] = useState<ReceiptItemRow[]>([
    {
      rowId: 1,
      inventory_item_id: '',
      quantity: '',
      unit_cost: '',
    },
  ])

  const [nextRowId, setNextRowId] = useState(2)
  const [saving, setSaving] = useState(false)

  const loadingOptions = loadingFarms || loadingSuppliers || loadingItems

  const activeFarms = farms.filter((farm) => farm.is_active)
  const activeSuppliers = suppliers.filter(
    (supplier) => supplier.is_active
  )
  const activeItems = items.filter((item) => item.is_active)

  const updateReceiptItem = (
    rowId: number,
    field: keyof ReceiptItemRow,
    value: string
  ) => {
    setReceiptItems((current) =>
      current.map((item) =>
        item.rowId === rowId
          ? { ...item, [field]: value }
          : item
      )
    )
  }

  const addReceiptItem = () => {
    setReceiptItems((current) => [
      ...current,
      {
        rowId: nextRowId,
        inventory_item_id: '',
        quantity: '',
        unit_cost: '',
      },
    ])

    setNextRowId((current) => current + 1)
  }

  const removeReceiptItem = (rowId: number) => {
    setReceiptItems((current) =>
      current.filter((item) => item.rowId !== rowId)
    )
  }

  const getLineTotal = (item: ReceiptItemRow) => {
    const quantity = Number(item.quantity)
    const unitCost = Number(item.unit_cost)

    if (
      !item.quantity ||
      !item.unit_cost ||
      !Number.isFinite(quantity) ||
      !Number.isFinite(unitCost)
    ) {
      return 0
    }

    return quantity * unitCost
  }

  const totalValue = receiptItems.reduce(
    (total, item) => total + getLineTotal(item),
    0
  )

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('en-MW', {
      style: 'currency',
      currency: 'MWK',
      maximumFractionDigits: 2,
    }).format(amount)

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!farmId) {
      toast.error('Please select a farm.')
      return
    }

    if (!supplierId) {
      toast.error('Please select a supplier.')
      return
    }

    if (!receivedDate) {
      toast.error('Please select the received date.')
      return
    }

    if (receiptItems.length === 0) {
      toast.error('Please add at least one inventory item.')
      return
    }

    for (const item of receiptItems) {
      if (!item.inventory_item_id) {
        toast.error('Please select an inventory item for every row.')
        return
      }

      const quantity = Number(item.quantity)
      const unitCost = Number(item.unit_cost)

      if (
        !item.quantity ||
        !Number.isFinite(quantity) ||
        quantity <= 0
      ) {
        toast.error('Every item must have a quantity greater than zero.')
        return
      }

      if (
        !item.unit_cost ||
        !Number.isFinite(unitCost) ||
        unitCost < 0
      ) {
        toast.error('Every item must have a valid unit cost.')
        return
      }
    }

    try {
      setSaving(true)

      const response = await createStockReceipt({
        farm_id: farmId,
        supplier_id: supplierId,
        received_date: receivedDate,
        supplier_reference: supplierReference.trim() || undefined,
        notes: notes.trim() || undefined,
        items: receiptItems.map((item) => ({
          inventory_item_id: item.inventory_item_id,
          quantity: Number(item.quantity),
          unit_cost: Number(item.unit_cost),
        })),
      })

      if (response?.success === false) {
        throw new Error(
          response.message || 'Failed to record stock receipt.'
        )
      }

      toast.success(
        response?.message || 'Stock receipt recorded successfully.'
      )

      await onSuccess()
      onClose()
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Failed to record stock receipt.'

      toast.error(message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center
        bg-black/40 p-4"
      onClick={saving ? undefined : onClose}
    >
      <div
        className="w-full max-w-4xl max-h-[90vh] overflow-y-auto
          rounded-xl bg-white shadow-xl"
        onClick={(event) => event.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between
          border-b border-gray-200 p-5">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-green-50 p-2">
              <PackageCheck size={21} className="text-green-700" />
            </div>

            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Receive Stock
              </h2>
              <p className="text-sm text-gray-500">
                Record a new delivery from a supplier.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="text-gray-400 hover:text-gray-600
              disabled:opacity-50"
          >
            <X size={21} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="space-y-6 p-5">
            {loadingOptions ? (
              <div className="flex items-center justify-center py-8">
                <Loader2
                  size={22}
                  className="animate-spin text-green-700"
                />
                <span className="ml-3 text-sm text-gray-500">
                  Loading farms, suppliers and inventory items...
                </span>
              </div>
            ) : (
              <>
                {/* Receipt Information */}
                <div>
                  <h3 className="mb-4 text-sm font-semibold text-gray-900">
                    Receipt Information
                  </h3>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label className="mb-1.5 block text-sm
                        font-medium text-gray-700">
                        Farm <span className="text-red-500">*</span>
                      </label>

                      <select
                        value={farmId}
                        onChange={(event) => setFarmId(event.target.value)}
                        required
                        disabled={saving}
                        className="w-full rounded-lg border
                          border-gray-300 bg-white px-3 py-2.5
                          text-sm outline-none focus:border-green-600
                          focus:ring-2 focus:ring-green-100"
                      >
                        <option value="">Select a farm</option>

                        {activeFarms.map((farm) => (
                          <option key={farm.id} value={farm.id}>
                            {farm.name} ({farm.farm_code})
                          </option>
                        ))}
                      </select>

                      {activeFarms.length === 0 && (
                        <p className="mt-1 text-xs text-amber-600">
                          No active farms available.
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="mb-1.5 block text-sm
                        font-medium text-gray-700">
                        Supplier <span className="text-red-500">*</span>
                      </label>

                      <select
                        value={supplierId}
                        onChange={(event) =>
                          setSupplierId(event.target.value)
                        }
                        required
                        disabled={saving}
                        className="w-full rounded-lg border
                          border-gray-300 bg-white px-3 py-2.5
                          text-sm outline-none focus:border-green-600
                          focus:ring-2 focus:ring-green-100"
                      >
                        <option value="">Select a supplier</option>

                        {activeSuppliers.map((supplier) => (
                          <option
                            key={supplier.id}
                            value={supplier.id}
                          >
                            {supplier.name} ({supplier.supplier_code})
                          </option>
                        ))}
                      </select>

                      {activeSuppliers.length === 0 && (
                        <p className="mt-1 text-xs text-amber-600">
                          No active suppliers available.
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="mb-1.5 block text-sm
                        font-medium text-gray-700">
                        Received Date <span className="text-red-500">*</span>
                      </label>

                      <input
                        type="date"
                        value={receivedDate}
                        onChange={(event) =>
                          setReceivedDate(event.target.value)
                        }
                        required
                        disabled={saving}
                        className="w-full rounded-lg border
                          border-gray-300 px-3 py-2.5 text-sm
                          outline-none focus:border-green-600
                          focus:ring-2 focus:ring-green-100"
                      />
                    </div>

                    <div>
                      <label className="mb-1.5 block text-sm
                        font-medium text-gray-700">
                        Supplier Reference
                      </label>

                      <input
                        type="text"
                        value={supplierReference}
                        onChange={(event) =>
                          setSupplierReference(event.target.value)
                        }
                        placeholder="e.g. INV-2026-001"
                        disabled={saving}
                        className="w-full rounded-lg border
                          border-gray-300 px-3 py-2.5 text-sm
                          outline-none focus:border-green-600
                          focus:ring-2 focus:ring-green-100"
                      />
                    </div>
                  </div>
                </div>

                {/* Received Items */}
                <div>
                  <div className="mb-4 flex items-center
                    justify-between gap-3">
                    <div>
                      <h3 className="text-sm font-semibold text-gray-900">
                        Received Items
                      </h3>
                      <p className="mt-1 text-xs text-gray-500">
                        Add each inventory item included in this delivery.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={addReceiptItem}
                      disabled={saving || activeItems.length === 0}
                      className="inline-flex items-center gap-1.5
                        rounded-lg border border-green-700
                        px-3 py-2 text-sm font-medium
                        text-green-700 hover:bg-green-50
                        disabled:opacity-50"
                    >
                      <Plus size={16} />
                      Add Item
                    </button>
                  </div>

                  {activeItems.length === 0 ? (
                    <div className="rounded-lg border border-amber-200
                      bg-amber-50 p-4 text-sm text-amber-800">
                      No active inventory items are available.
                      Please register an inventory item first.
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {receiptItems.map((receiptItem, index) => {
                        const selectedItem = activeItems.find(
                          (item) =>
                            item.id === receiptItem.inventory_item_id
                        )

                        return (
                          <div
                            key={receiptItem.rowId}
                            className="rounded-lg border border-gray-200 p-4"
                          >
                            <div className="mb-3 flex items-center
                              justify-between">
                              <p className="text-sm font-medium text-gray-800">
                                Item {index + 1}
                              </p>

                              {receiptItems.length > 1 && (
                                <button
                                  type="button"
                                  onClick={() =>
                                    removeReceiptItem(receiptItem.rowId)
                                  }
                                  disabled={saving}
                                  className="inline-flex items-center
                                    gap-1 text-xs font-medium
                                    text-red-600 hover:text-red-700"
                                >
                                  <Trash2 size={14} />
                                  Remove
                                </button>
                              )}
                            </div>

                            <div className="grid grid-cols-1 gap-3
                              sm:grid-cols-2 lg:grid-cols-4">
                              <div className="sm:col-span-2 lg:col-span-2">
                                <label className="mb-1.5 block text-xs
                                  font-medium text-gray-600">
                                  Inventory Item
                                </label>

                                <select
                                  value={receiptItem.inventory_item_id}
                                  onChange={(event) =>
                                    updateReceiptItem(
                                      receiptItem.rowId,
                                      'inventory_item_id',
                                      event.target.value
                                    )
                                  }
                                  required
                                  disabled={saving}
                                  className="w-full rounded-lg border
                                    border-gray-300 bg-white px-3 py-2.5
                                    text-sm outline-none focus:border-green-600
                                    focus:ring-2 focus:ring-green-100"
                                >
                                  <option value="">Select item</option>

                                  {activeItems.map((item) => (
                                    <option key={item.id} value={item.id}>
                                      {item.name} ({item.item_code})
                                    </option>
                                  ))}
                                </select>
                              </div>

                              <div>
                                <label className="mb-1.5 block text-xs
                                  font-medium text-gray-600">
                                  Quantity
                                  {selectedItem
                                    ? ` (${selectedItem.unit_of_measure})`
                                    : ''}
                                </label>

                                <input
                                  type="number"
                                  min="0.000001"
                                  step="any"
                                  value={receiptItem.quantity}
                                  onChange={(event) =>
                                    updateReceiptItem(
                                      receiptItem.rowId,
                                      'quantity',
                                      event.target.value
                                    )
                                  }
                                  placeholder="e.g. 200"
                                  required
                                  disabled={saving}
                                  className="w-full rounded-lg border
                                    border-gray-300 px-3 py-2.5
                                    text-sm outline-none focus:border-green-600
                                    focus:ring-2 focus:ring-green-100"
                                />
                              </div>

                              <div>
                                <label className="mb-1.5 block text-xs
                                  font-medium text-gray-600">
                                  Unit Cost (MWK)
                                </label>

                                <input
                                  type="number"
                                  min="0"
                                  step="any"
                                  value={receiptItem.unit_cost}
                                  onChange={(event) =>
                                    updateReceiptItem(
                                      receiptItem.rowId,
                                      'unit_cost',
                                      event.target.value
                                    )
                                  }
                                  placeholder="e.g. 1500"
                                  required
                                  disabled={saving}
                                  className="w-full rounded-lg border
                                    border-gray-300 px-3 py-2.5
                                    text-sm outline-none focus:border-green-600
                                    focus:ring-2 focus:ring-green-100"
                                />
                              </div>
                            </div>

                            <div className="mt-3 flex justify-end">
                              <p className="text-sm text-gray-600">
                                Line Total:{' '}
                                <span className="font-semibold text-gray-900">
                                  {formatCurrency(getLineTotal(receiptItem))}
                                </span>
                              </p>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>

                {/* Receipt Total */}
                <div className="flex items-center justify-between
                  rounded-lg bg-green-50 p-4">
                  <span className="text-sm font-medium text-green-800">
                    Total Receipt Value
                  </span>

                  <span className="text-lg font-bold text-green-800">
                    {formatCurrency(totalValue)}
                  </span>
                </div>

                {/* Notes */}
                <div>
                  <label className="mb-1.5 block text-sm
                    font-medium text-gray-700">
                    Notes
                  </label>

                  <textarea
                    value={notes}
                    onChange={(event) => setNotes(event.target.value)}
                    placeholder="Additional information about this delivery..."
                    rows={3}
                    maxLength={500}
                    disabled={saving}
                    className="w-full resize-none rounded-lg
                      border border-gray-300 px-3 py-2.5
                      text-sm outline-none focus:border-green-600
                      focus:ring-2 focus:ring-green-100"
                  />
                </div>
              </>
            )}
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3
            border-t border-gray-200 bg-gray-50
            rounded-b-xl px-5 py-4">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="rounded-lg border border-gray-300
                bg-white px-4 py-2.5 text-sm font-medium
                text-gray-700 hover:bg-gray-50
                disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={
                saving ||
                loadingOptions ||
                activeFarms.length === 0 ||
                activeSuppliers.length === 0 ||
                activeItems.length === 0
              }
              className="inline-flex items-center justify-center
                gap-2 rounded-lg bg-green-700 px-4 py-2.5
                text-sm font-medium text-white
                hover:bg-green-800 disabled:cursor-not-allowed
                disabled:opacity-60"
            >
              {saving && (
                <Loader2 size={16} className="animate-spin" />
              )}
              {saving ? 'Recording...' : 'Record Stock Receipt'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CreateStockReceiptModal
