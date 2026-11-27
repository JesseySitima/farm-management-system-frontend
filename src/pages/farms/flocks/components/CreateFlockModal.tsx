
import { useState } from 'react'
import { X, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { useFarms } from '../../../../hooks/useFarms'
import { useSpecies } from '../../../../hooks/useSpecies'
import {
  createLivestockFlock,
  type CreateLivestockFlockData,
} from '../../../../services/livestockFlocks'

interface RegisterFlockModalProps {
  onClose: () => void
  onSuccess: () => void
}

const RegisterFlockModal = ({
  onClose,
  onSuccess,
}: RegisterFlockModalProps) => {
  const { farms, loading: farmsLoading } = useFarms()
  const { species, loading: speciesLoading } = useSpecies()

  const [formData, setFormData] = useState({
    farm_id: '',
    species_id: '',
    flock_code: '',
    breed: '',
    total_quantity: '',
    male_quantity: '',
    female_quantity: '',
    purpose: '',
    date_established: '',
    notes: '',
  })

  const [submitting, setSubmitting] = useState(false)

  const activeFarms = farms.filter((farm) => farm.is_active)

  const flockSpecies = species.filter(
    (item) => item.is_active && item.management_type === 'flock'
  )

  const dataLoading = farmsLoading || speciesLoading

  const handleChange = (
    event: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = event.target

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }))
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const total = Number(formData.total_quantity)
    const males = formData.male_quantity
      ? Number(formData.male_quantity)
      : 0
    const females = formData.female_quantity
      ? Number(formData.female_quantity)
      : 0

    if (total <= 0 || !Number.isInteger(total)) {
      toast.error('Total quantity must be a positive whole number.')
      return
    }

    if (
      !Number.isInteger(males) ||
      !Number.isInteger(females) ||
      males < 0 ||
      females < 0
    ) {
      toast.error('Male and female quantities must be whole numbers.')
      return
    }

    if (males + females > total) {
      toast.error(
        'Male and female quantities cannot exceed the total quantity.'
      )
      return
    }

    const payload: CreateLivestockFlockData = {
      farm_id: formData.farm_id,
      species_id: formData.species_id,
      flock_code: formData.flock_code.trim(),
      total_quantity: total,
      ...(formData.breed.trim() && { breed: formData.breed.trim() }),
      ...(formData.male_quantity !== '' && { male_quantity: males }),
      ...(formData.female_quantity !== '' && { female_quantity: females }),
      ...(formData.purpose.trim() && { purpose: formData.purpose.trim() }),
      ...(formData.date_established && {
        date_established: formData.date_established,
      }),
      ...(formData.notes.trim() && { notes: formData.notes.trim() }),
    }

    try {
      setSubmitting(true)

      const response = await createLivestockFlock(payload)

      toast.success(response.message || 'Flock registered successfully.')
      onSuccess()
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || 'Failed to register flock.'
      )
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-gray-200 p-5">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Register Livestock Flock
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Add a new flock to one of your farms.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            className="rounded-lg p-2 text-gray-500 hover:bg-gray-100"
          >
            <X size={20} />
          </button>
        </div>

        {dataLoading ? (
          <div className="flex items-center justify-center gap-2 p-10 text-sm text-gray-500">
            <Loader2 size={18} className="animate-spin" />
            Loading farms and species...
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5 p-5">
            {activeFarms.length === 0 || flockSpecies.length === 0 ? (
              <div className="rounded-lg bg-amber-50 p-4 text-sm text-amber-800">
                {activeFarms.length === 0 &&
                  'No active farms are available. Please activate or create a farm first.'}
                {activeFarms.length > 0 &&
                  flockSpecies.length === 0 &&
                  'No active flock-managed species are available. Please add a flock-managed species first.'}
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-gray-700">
                      Farm *
                    </label>
                    <select
                      name="farm_id"
                      value={formData.farm_id}
                      onChange={handleChange}
                      required
                      className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-green-600"
                    >
                      <option value="">Select farm</option>
                      {activeFarms.map((farm) => (
                        <option key={farm.id} value={farm.id}>
                          {farm.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-gray-700">
                      Species *
                    </label>
                    <select
                      name="species_id"
                      value={formData.species_id}
                      onChange={handleChange}
                      required
                      className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-green-600"
                    >
                      <option value="">Select species</option>
                      {flockSpecies.map((item) => (
                        <option key={item.id} value={item.id}>
                          {item.name} ({item.code})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-gray-700">
                      Flock Code *
                    </label>
                    <input
                      name="flock_code"
                      value={formData.flock_code}
                      onChange={handleChange}
                      placeholder="e.g. CHICKEN-001"
                      required
                      className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-green-600"
                    />
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-gray-700">
                      Breed
                    </label>
                    <input
                      name="breed"
                      value={formData.breed}
                      onChange={handleChange}
                      placeholder="e.g. Sasso"
                      className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-green-600"
                    />
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-gray-700">
                      Total Quantity *
                    </label>
                    <input
                      type="number"
                      name="total_quantity"
                      value={formData.total_quantity}
                      onChange={handleChange}
                      min="1"
                      step="1"
                      placeholder="e.g. 200"
                      required
                      className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-green-600"
                    />
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-gray-700">
                      Purpose
                    </label>
                    <select
                      name="purpose"
                      value={formData.purpose}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-green-600"
                    >
                      <option value="">Select purpose</option>
                      <option value="Layers">Layers</option>
                      <option value="Broilers">Broilers</option>
                      <option value="Breeding">Breeding</option>
                      <option value="Meat Production">Meat Production</option>
                      <option value="Egg Production">Egg Production</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-gray-700">
                      Male Quantity
                    </label>
                    <input
                      type="number"
                      name="male_quantity"
                      value={formData.male_quantity}
                      onChange={handleChange}
                      min="0"
                      step="1"
                      placeholder="e.g. 80"
                      className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-green-600"
                    />
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-gray-700">
                      Female Quantity
                    </label>
                    <input
                      type="number"
                      name="female_quantity"
                      value={formData.female_quantity}
                      onChange={handleChange}
                      min="0"
                      step="1"
                      placeholder="e.g. 120"
                      className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-green-600"
                    />
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-gray-700">
                      Date Established
                    </label>
                    <input
                      type="date"
                      name="date_established"
                      value={formData.date_established}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-green-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">
                    Notes
                  </label>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    rows={3}
                    placeholder="Additional information about this flock..."
                    className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-green-600"
                  />
                </div>
              </>
            )}

            <div className="flex justify-end gap-3 border-t border-gray-200 pt-4">
              <button
                type="button"
                onClick={onClose}
                disabled={submitting}
                className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={
                  submitting ||
                  dataLoading ||
                  activeFarms.length === 0 ||
                  flockSpecies.length === 0
                }
                className="inline-flex items-center gap-2 rounded-lg bg-green-700 px-4 py-2.5 text-sm font-medium text-white hover:bg-green-800 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {submitting && (
                  <Loader2 size={16} className="animate-spin" />
                )}
                {submitting ? 'Registering...' : 'Register Flock'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}

export default RegisterFlockModal
