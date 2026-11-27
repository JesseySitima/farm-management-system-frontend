
import { useState, type FormEvent } from 'react'
import { X, Truck, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { createSupplier } from '../../../services/suppliers'

interface CreateSupplierModalProps {
  onClose: () => void
  onSuccess: () => void | Promise<void>
}

const CreateSupplierModal = ({
  onClose,
  onSuccess,
}: CreateSupplierModalProps) => {
  const [name, setName] = useState('')
  const [contactPerson, setContactPerson] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [address, setAddress] = useState('')
  const [description, setDescription] = useState('')
  const [saving, setSaving] = useState(false)

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!name.trim()) {
      toast.error('Please enter the supplier name.')
      return
    }

    try {
      setSaving(true)

      const response = await createSupplier({
        name: name.trim(),
        contact_person: contactPerson.trim() || undefined,
        phone: phone.trim() || undefined,
        email: email.trim() || undefined,
        address: address.trim() || undefined,
        description: description.trim() || undefined,
      })

      if (!response.success) {
        throw new Error(response.message || 'Failed to create supplier.')
      }

      toast.success(response.message || 'Supplier created successfully.')

      await onSuccess()
      onClose()
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Failed to create supplier.'

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
        className="w-full max-w-2xl max-h-[90vh] overflow-y-auto
          rounded-xl bg-white shadow-xl"
        onClick={(event) => event.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between
          border-b border-gray-200 p-5">

          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-green-50 p-2">
              <Truck size={21} className="text-green-700" />
            </div>

            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Add Supplier
              </h2>

              <p className="text-sm text-gray-500">
                Register a new farm supplier.
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
                Supplier Name <span className="text-red-500">*</span>
              </label>

              <input
                type="text"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Enter supplier name"
                maxLength={150}
                required
                disabled={saving}
                className="w-full rounded-lg border border-gray-300
                  px-3 py-2.5 text-sm outline-none
                  focus:border-green-600 focus:ring-2
                  focus:ring-green-100 disabled:bg-gray-50"
              />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

              <div>
                <label className="mb-1.5 block text-sm
                  font-medium text-gray-700">
                  Contact Person
                </label>

                <input
                  type="text"
                  value={contactPerson}
                  onChange={(event) => setContactPerson(event.target.value)}
                  placeholder="e.g. John Banda"
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
                  Phone Number
                </label>

                <input
                  type="tel"
                  value={phone}
                  onChange={(event) => setPhone(event.target.value)}
                  placeholder="+265..."
                  disabled={saving}
                  className="w-full rounded-lg border border-gray-300
                    px-3 py-2.5 text-sm outline-none
                    focus:border-green-600 focus:ring-2
                    focus:ring-green-100 disabled:bg-gray-50"
                />
              </div>

            </div>

            <div>
              <label className="mb-1.5 block text-sm
                font-medium text-gray-700">
                Email Address
              </label>

              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="supplier@example.com"
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
                Address
              </label>

              <input
                type="text"
                value={address}
                onChange={(event) => setAddress(event.target.value)}
                placeholder="Supplier physical address"
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
                placeholder="Describe the products or services supplied..."
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
              disabled={saving || !name.trim()}
              className="inline-flex items-center justify-center
                gap-2 rounded-lg bg-green-700 px-4 py-2.5
                text-sm font-medium text-white
                hover:bg-green-800 disabled:cursor-not-allowed
                disabled:opacity-60"
            >
              {saving && <Loader2 size={16} className="animate-spin" />}

              {saving ? 'Saving...' : 'Create Supplier'}
            </button>

          </div>
        </form>
      </div>
    </div>
  )
}

export default CreateSupplierModal
