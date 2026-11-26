
import { useState, type ChangeEvent, type FormEvent } from 'react'
import { X, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { createFarm } from '../../../services/farms'

interface CreateFarmModalProps {
  onClose: () => void
  onSuccess: () => void
}

function CreateFarmModal({
  onClose,
  onSuccess,
}: CreateFarmModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    farm_code: '',
    location: '',
    district: '',
    region: '',
    size: '',
    size_unit: 'hectares',
    contact_person: '',
    phone: '',
    email: '',
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

      await createFarm({
        name: formData.name.trim(),
        farm_code: formData.farm_code.trim(),
        location: formData.location.trim(),
        ...(formData.description.trim() && {
          description: formData.description.trim(),
        }),
        ...(formData.district.trim() && {
          district: formData.district.trim(),
        }),
        ...(formData.region.trim() && {
          region: formData.region.trim(),
        }),
        ...(formData.size.trim() && {
          size: Number(formData.size),
          size_unit: formData.size_unit,
        }),
        ...(formData.contact_person.trim() && {
          contact_person: formData.contact_person.trim(),
        }),
        ...(formData.phone.trim() && {
          phone: formData.phone.trim(),
        }),
        ...(formData.email.trim() && {
          email: formData.email.trim(),
        }),
      })

      toast.success('Farm registered successfully.')
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
        'Failed to register farm. Please try again.'
      )
    } finally {
      setSubmitting(false)
    }
  }

  const inputClass =
    'w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100'

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-xl bg-white shadow-xl">

        {/* Modal header */}
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Register New Farm
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Enter the farm details below.
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
        <form onSubmit={handleSubmit} className="p-6 space-y-5">

          {/* Basic information */}
          <div>
            <h3 className="text-sm font-semibold text-gray-800 mb-3">
              Basic Information
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Farm Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Green Valley Farm"
                  className={inputClass}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Farm Code *
                </label>
                <input
                  type="text"
                  name="farm_code"
                  value={formData.farm_code}
                  onChange={handleChange}
                  placeholder="e.g. FARM-002"
                  className={inputClass}
                  required
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Brief description of the farm"
                  rows={3}
                  className={inputClass}
                />
              </div>

            </div>
          </div>

          {/* Location information */}
          <div>
            <h3 className="text-sm font-semibold text-gray-800 mb-3">
              Location Information
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Physical Location *
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="e.g. Chigumula"
                  className={inputClass}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  District
                </label>
                <input
                  type="text"
                  name="district"
                  value={formData.district}
                  onChange={handleChange}
                  placeholder="e.g. Blantyre"
                  className={inputClass}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Region
                </label>
                <input
                  type="text"
                  name="region"
                  value={formData.region}
                  onChange={handleChange}
                  placeholder="e.g. Southern Region"
                  className={inputClass}
                />
              </div>

            </div>
          </div>

          {/* Farm size */}
          <div>
            <h3 className="text-sm font-semibold text-gray-800 mb-3">
              Farm Size
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Size
                </label>
                <input
                  type="number"
                  name="size"
                  value={formData.size}
                  onChange={handleChange}
                  placeholder="e.g. 25"
                  min="0"
                  step="any"
                  className={inputClass}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Size Unit
                </label>
                <select
                  name="size_unit"
                  value={formData.size_unit}
                  onChange={handleChange}
                  className={inputClass}
                >
                  <option value="hectares">Hectares</option>
                  <option value="acres">Acres</option>
                  <option value="square metres">Square metres</option>
                </select>
              </div>

            </div>
          </div>

          {/* Contact information */}
          <div>
            <h3 className="text-sm font-semibold text-gray-800 mb-3">
              Contact Information
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Contact Person
                </label>
                <input
                  type="text"
                  name="contact_person"
                  value={formData.contact_person}
                  onChange={handleChange}
                  placeholder="Full name"
                  className={inputClass}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+265..."
                  className={inputClass}
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="farm@example.com"
                  className={inputClass}
                />
              </div>

            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 border-t border-gray-200 pt-5">

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
              className="flex items-center justify-center gap-2 rounded-lg bg-green-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-green-800 disabled:opacity-50"
            >
              {submitting && <Loader2 size={16} className="animate-spin" />}
              {submitting ? 'Registering...' : 'Register Farm'}
            </button>

          </div>

        </form>
      </div>
    </div>
  )
}

export default CreateFarmModal
