
import { useState, type FormEvent } from 'react'
import { X, Tags, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { createInventoryCategory } from '../../../services/inventoryCategories'

interface CreateInventoryCategoryModalProps {
  onClose: () => void
  onSuccess: () => void | Promise<void>
}

const CreateInventoryCategoryModal = ({
  onClose,
  onSuccess,
}: CreateInventoryCategoryModalProps) => {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [saving, setSaving] = useState(false)

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!name.trim()) {
      toast.error('Please enter a category name.')
      return
    }

    try {
      setSaving(true)

      const response = await createInventoryCategory({
        name: name.trim(),
        description: description.trim() || undefined,
      })

      if (!response.success) {
        throw new Error(response.message || 'Failed to create category.')
      }

      toast.success(response.message || 'Category created successfully.')

      await onSuccess()
      onClose()
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Failed to create inventory category.'

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
        className="w-full max-w-lg rounded-xl bg-white shadow-xl"
        onClick={(event) => event.stopPropagation()}
      >
        {/* Modal header */}
        <div className="flex items-center justify-between
          border-b border-gray-200 p-5">

          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-green-50 p-2">
              <Tags size={21} className="text-green-700" />
            </div>

            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Add Inventory Category
              </h2>

              <p className="text-sm text-gray-500">
                Create a new inventory category.
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
                Category Name <span className="text-red-500">*</span>
              </label>

              <input
                type="text"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="e.g. Feeds, Medicines, Equipment"
                maxLength={100}
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
                Description
              </label>

              <textarea
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                placeholder="Briefly describe this inventory category..."
                rows={4}
                maxLength={500}
                disabled={saving}
                className="w-full resize-none rounded-lg
                  border border-gray-300 px-3 py-2.5
                  text-sm outline-none focus:border-green-600
                  focus:ring-2 focus:ring-green-100
                  disabled:bg-gray-50"
              />

              <p className="mt-1 text-xs text-gray-400">
                Optional. Maximum 500 characters.
              </p>
            </div>

          </div>

          {/* Modal footer */}
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
              disabled={saving || !name.trim()}
              className="inline-flex items-center justify-center
                gap-2 rounded-lg bg-green-700 px-4 py-2.5
                text-sm font-medium text-white
                hover:bg-green-800 disabled:cursor-not-allowed
                disabled:opacity-60"
            >
              {saving && <Loader2 size={16} className="animate-spin" />}

              {saving ? 'Saving...' : 'Create Category'}
            </button>

          </div>
        </form>
      </div>
    </div>
  )
}

export default CreateInventoryCategoryModal
