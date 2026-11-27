import { useState } from 'react'
import { X, Package, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import {
  createProduct,
  type CreateProductData,
} from '../../../services/product'

interface CreateProductModalProps {
  onClose: () => void
  onSuccess: () => void
}

const CreateProductModal = ({
  onClose,
  onSuccess,
}: CreateProductModalProps) => {
  const [formData, setFormData] = useState<CreateProductData>({
    name: '',
    unit_of_measure: '',
    description: '',
  })

  const [saving, setSaving] = useState(false)

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }))
  }

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault()

    if (!formData.name.trim() || !formData.unit_of_measure.trim()) {
      toast.error('Please enter the product name and unit of measure.')
      return
    }

    try {
      setSaving(true)

      await createProduct({
        name: formData.name.trim(),
        unit_of_measure: formData.unit_of_measure.trim(),
        description: formData.description?.trim() || undefined,
      })

      toast.success('Product created successfully.')
      onSuccess()
      onClose()
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || 'Failed to create product.'
      )
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-lg rounded-xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-gray-200 p-5">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-green-50 p-2 text-green-700">
              <Package size={22} />
            </div>

            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Add Product
              </h2>
              <p className="text-sm text-gray-500">
                Register a new farm product.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-700"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4 p-5">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">
                Product Name <span className="text-red-500">*</span>
              </label>

              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Eggs, Fresh Milk, Goat Meat"
                required
                disabled={saving}
                className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">
                Unit of Measure <span className="text-red-500">*</span>
              </label>

              <input
                type="text"
                name="unit_of_measure"
                value={formData.unit_of_measure}
                onChange={handleChange}
                placeholder="e.g. pieces, litres, kg, trays"
                required
                disabled={saving}
                className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600"
              />

              <p className="mt-1 text-xs text-gray-500">
                Specify the unit in which this product is collected or sold.
              </p>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">
                Description
              </label>

              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                placeholder="Optional product description..."
                disabled={saving}
                className="w-full resize-none rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 border-t border-gray-200 p-5">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 rounded-lg bg-green-700 px-4 py-2.5 text-sm font-medium text-white hover:bg-green-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {saving && <Loader2 size={16} className="animate-spin" />}
              {saving ? 'Saving...' : 'Create Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CreateProductModal