
import { useState, type ChangeEvent, type FormEvent } from 'react'
import { X, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { createSpecies } from '../../../../services/species'

interface CreateSpeciesModalProps {
  onClose: () => void
  onSuccess: () => void
}

function CreateSpeciesModal({
  onClose,
  onSuccess,
}: CreateSpeciesModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    management_type: 'individual' as 'individual' | 'flock',
    description: '',
  })

  const [submitting, setSubmitting] = useState(false)

  const handleChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = event.target

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }))
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    try {
      setSubmitting(true)

      await createSpecies({
        name: formData.name.trim(),
        code: formData.code.trim().toUpperCase(),
        management_type: formData.management_type,
        ...(formData.description.trim() && {
          description: formData.description.trim(),
        }),
      })

      toast.success('Species registered successfully.')
      onSuccess()
    } catch (err) {
      const error = err as {
        response?: {
          data?: {
            message?: string
          }
        }
      }

      toast.error(
        error.response?.data?.message ||
        'Failed to register species. Please try again.'
      )
    } finally {
      setSubmitting(false)
    }
  }

  const inputClass =
    'w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100'

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-lg overflow-hidden rounded-xl bg-white shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Register Species
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Add a livestock species to your farm management system.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-700"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5 p-6">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              Species Name <span className="text-red-500">*</span>
            </label>

            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. Goat, Chicken, Cattle"
              required
              className={inputClass}
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              Species Code <span className="text-red-500">*</span>
            </label>

            <input
              type="text"
              name="code"
              value={formData.code}
              onChange={handleChange}
              placeholder="e.g. GOT, CHK, CAT"
              required
              className={inputClass}
            />

            <p className="mt-1 text-xs text-gray-500">
              Use a short, unique code to identify this species.
            </p>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              Management Type <span className="text-red-500">*</span>
            </label>

            <select
              name="management_type"
              value={formData.management_type}
              onChange={handleChange}
              required
              className={inputClass}
            >
              <option value="individual">Individual</option>
              <option value="flock">Flock</option>
            </select>

            <p className="mt-1 text-xs text-gray-500">
              Individual: animals are registered and tracked separately.
              Flock: animals are managed as a group.
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
              placeholder="Enter a short description..."
              rows={3}
              className={inputClass}
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 border-t border-gray-100 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center gap-2 rounded-lg bg-green-700 px-4 py-2.5 text-sm font-medium text-white hover:bg-green-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting && <Loader2 size={16} className="animate-spin" />}
              {submitting ? 'Registering...' : 'Register Species'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CreateSpeciesModal
