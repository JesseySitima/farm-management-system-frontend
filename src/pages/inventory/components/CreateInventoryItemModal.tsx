
import { useEffect, useState, type FormEvent } from 'react'
import { X, Package, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { createInventoryItem } from '../../../services/inventoryItems'
import {
  getInventoryCategories,
  type InventoryCategory,
} from '../../../services/inventoryCategories'

interface CreateInventoryItemModalProps {
  onClose: () => void
  onSuccess: () => void | Promise<void>
}

const CreateInventoryItemModal = ({
  onClose,
  onSuccess,
}: CreateInventoryItemModalProps) => {
  const [categories, setCategories] = useState<InventoryCategory[]>([])
  const [loadingCategories, setLoadingCategories] = useState(true)
  const [categoryError, setCategoryError] = useState('')

  const [name, setName] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [unitOfMeasure, setUnitOfMeasure] = useState('')
  const [minimumStockLevel, setMinimumStockLevel] = useState('')
  const [description, setDescription] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoadingCategories(true)
        setCategoryError('')

        const data = await getInventoryCategories()
        const activeCategories = data.filter(
          (category) => category.is_active
        )

        setCategories(activeCategories)
      } catch {
        setCategoryError('Failed to load inventory categories.')
      } finally {
        setLoadingCategories(false)
      }
    }

    fetchCategories()
  }, [])

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!name.trim()) {
      toast.error('Please enter the inventory item name.')
      return
    }

    if (!categoryId) {
      toast.error('Please select an inventory category.')
      return
    }

    if (!unitOfMeasure.trim()) {
      toast.error('Please enter the unit of measure.')
      return
    }

    const minimumLevel = minimumStockLevel.trim()
      ? Number(minimumStockLevel)
      : undefined

    if (
      minimumLevel !== undefined &&
      (!Number.isFinite(minimumLevel) || minimumLevel < 0)
    ) {
      toast.error('Minimum stock level must be zero or greater.')
      return
    }

    try {
      setSaving(true)

      const response = await createInventoryItem({
        name: name.trim(),
        category_id: categoryId,
        unit_of_measure: unitOfMeasure.trim(),
        minimum_stock_level: minimumLevel,
        description: description.trim() || undefined,
      })

      if (!response.success) {
        throw new Error(
          response.message || 'Failed to create inventory item.'
        )
      }

      toast.success(
        response.message || 'Inventory item created successfully.'
      )

      await onSuccess()
      onClose()
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Failed to create inventory item.'

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
        className="w-full max-w-xl max-h-[90vh] overflow-y-auto
          rounded-xl bg-white shadow-xl"
        onClick={(event) => event.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between
          border-b border-gray-200 p-5">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-green-50 p-2">
              <Package size={21} className="text-green-700" />
            </div>

            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Add Inventory Item
              </h2>
              <p className="text-sm text-gray-500">
                Register a new item in your inventory.
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

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="space-y-5 p-5">
            <div>
              <label className="mb-1.5 block text-sm
                font-medium text-gray-700">
                Item Name <span className="text-red-500">*</span>
              </label>

              <input
                type="text"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="e.g. Layer Mash"
                maxLength={150}
                required
                disabled={saving}
                className="w-full rounded-lg border border-gray-300
                  px-3 py-2.5 text-sm outline-none
                  focus:border-green-600 focus:ring-2
                  focus:ring-green-100 disabled:bg-gray-50"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm
                font-medium text-gray-700">
                Category <span className="text-red-500">*</span>
              </label>

              <select
                value={categoryId}
                onChange={(event) => setCategoryId(event.target.value)}
                required
                disabled={saving || loadingCategories || !!categoryError}
                className="w-full rounded-lg border border-gray-300
                  bg-white px-3 py-2.5 text-sm outline-none
                  focus:border-green-600 focus:ring-2
                  focus:ring-green-100 disabled:bg-gray-50"
              >
                <option value="">
                  {loadingCategories
                    ? 'Loading categories...'
                    : 'Select a category'}
                </option>

                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>

              {categoryError && (
                <p className="mt-1.5 text-xs text-red-600">
                  {categoryError}
                </p>
              )}

              {!loadingCategories &&
                !categoryError &&
                categories.length === 0 && (
                  <p className="mt-1.5 text-xs text-amber-600">
                    No active categories available. Please create an
                    inventory category first.
                  </p>
                )}
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-sm
                  font-medium text-gray-700">
                  Unit of Measure <span className="text-red-500">*</span>
                </label>

                <input
                  type="text"
                  value={unitOfMeasure}
                  onChange={(event) => setUnitOfMeasure(event.target.value)}
                  placeholder="e.g. kg, litres, bags"
                  maxLength={50}
                  required
                  disabled={saving}
                  className="w-full rounded-lg border border-gray-300
                    px-3 py-2.5 text-sm outline-none
                    focus:border-green-600 focus:ring-2
                    focus:ring-green-100 disabled:bg-gray-50"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm
                  font-medium text-gray-700">
                  Minimum Stock Level
                </label>

                <input
                  type="number"
                  min="0"
                  step="any"
                  value={minimumStockLevel}
                  onChange={(event) =>
                    setMinimumStockLevel(event.target.value)
                  }
                  placeholder="e.g. 50"
                  disabled={saving}
                  className="w-full rounded-lg border border-gray-300
                    px-3 py-2.5 text-sm outline-none
                    focus:border-green-600 focus:ring-2
                    focus:ring-green-100 disabled:bg-gray-50"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Optional stock threshold for this item.
                </p>
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-sm
                font-medium text-gray-700">
                Description
              </label>

              <textarea
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                placeholder="Describe this inventory item..."
                rows={3}
                maxLength={500}
                disabled={saving}
                className="w-full resize-none rounded-lg
                  border border-gray-300 px-3 py-2.5
                  text-sm outline-none focus:border-green-600
                  focus:ring-2 focus:ring-green-100
                  disabled:bg-gray-50"
              />
            </div>

            <p className="text-xs text-gray-500">
              The inventory item code will be generated automatically.
            </p>
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
                loadingCategories ||
                categories.length === 0 ||
                !name.trim() ||
                !categoryId ||
                !unitOfMeasure.trim()
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
              {saving ? 'Saving...' : 'Create Item'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CreateInventoryItemModal
