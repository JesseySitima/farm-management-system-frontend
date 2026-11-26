
import { useState, type ChangeEvent, type FormEvent } from 'react'
import { X, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

import { registerLivestock } from '../../../services/livestock'
import { useFarms } from '../../../hooks/useFarms'
import { useSpecies } from '../../../hooks/useSpecies'

interface RegisterLivestockModalProps {
  onClose: () => void
  onSuccess: () => void
}

function RegisterLivestockModal({
  onClose,
  onSuccess,
}: RegisterLivestockModalProps) {
  const { farms, loading: farmsLoading } = useFarms()
  const { species, loading: speciesLoading } = useSpecies()

  const [formData, setFormData] = useState({
    farm_id: '',
    species_id: '',
    animal_code: '',
    breed: '',
    sex: 'unknown' as 'male' | 'female' | 'unknown',
    date_of_birth: '',
    acquisition_date: '',
    acquisition_type: '',
    notes: '',
  })

  const [submitting, setSubmitting] = useState(false)

  const individualSpecies = species.filter(
    (item) =>
      item.management_type === 'individual' &&
      item.is_active
  )

  const activeFarms = farms.filter(
    (farm) => farm.is_active
  )

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

      await registerLivestock({
        farm_id: formData.farm_id,
        species_id: formData.species_id,
        animal_code: formData.animal_code.trim(),
        sex: formData.sex,
        ...(formData.breed.trim() && {
          breed: formData.breed.trim(),
        }),
        ...(formData.date_of_birth && {
          date_of_birth: formData.date_of_birth,
        }),
        ...(formData.acquisition_date && {
          acquisition_date: formData.acquisition_date,
        }),
        ...(formData.acquisition_type.trim() && {
          acquisition_type: formData.acquisition_type.trim(),
        }),
        ...(formData.notes.trim() && {
          notes: formData.notes.trim(),
        }),
      })

      toast.success('Animal registered successfully.')
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
        'Failed to register animal. Please try again.'
      )
    } finally {
      setSubmitting(false)
    }
  }

  const inputClass =
    'w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100'

  const dataLoading = farmsLoading || speciesLoading

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-xl bg-white shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Register Animal
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Register an individual animal under one of your farms.
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

        <form onSubmit={handleSubmit} className="space-y-5 p-6">
          {dataLoading ? (
            <div className="py-8 text-center text-sm text-gray-500">
              Loading farms and species...
            </div>
          ) : (
            <>
              {/* Basic information */}
              <div>
                <h3 className="mb-4 text-sm font-semibold text-gray-900">
                  Basic Information
                </h3>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-gray-700">
                      Farm <span className="text-red-500">*</span>
                    </label>

                    <select
                      name="farm_id"
                      value={formData.farm_id}
                      onChange={handleChange}
                      required
                      className={inputClass}
                    >
                      <option value="">Select farm</option>
                      {activeFarms.map((farm) => (
                        <option key={farm.id} value={farm.id}>
                          {farm.name} ({farm.farm_code})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-gray-700">
                      Species <span className="text-red-500">*</span>
                    </label>

                    <select
                      name="species_id"
                      value={formData.species_id}
                      onChange={handleChange}
                      required
                      className={inputClass}
                    >
                      <option value="">Select species</option>
                      {individualSpecies.map((item) => (
                        <option key={item.id} value={item.id}>
                          {item.name} ({item.code})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-gray-700">
                      Animal Code <span className="text-red-500">*</span>
                    </label>

                    <input
                      type="text"
                      name="animal_code"
                      value={formData.animal_code}
                      onChange={handleChange}
                      placeholder="e.g. GOAT-002"
                      required
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-gray-700">
                      Breed
                    </label>

                    <input
                      type="text"
                      name="breed"
                      value={formData.breed}
                      onChange={handleChange}
                      placeholder="e.g. Boer"
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-gray-700">
                      Sex
                    </label>

                    <select
                      name="sex"
                      value={formData.sex}
                      onChange={handleChange}
                      className={inputClass}
                    >
                      <option value="unknown">Unknown</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Dates and acquisition */}
              <div className="border-t border-gray-100 pt-5">
                <h3 className="mb-4 text-sm font-semibold text-gray-900">
                  Birth and Acquisition Details
                </h3>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-gray-700">
                      Date of Birth
                    </label>

                    <input
                      type="date"
                      name="date_of_birth"
                      value={formData.date_of_birth}
                      onChange={handleChange}
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-gray-700">
                      Acquisition Date
                    </label>

                    <input
                      type="date"
                      name="acquisition_date"
                      value={formData.acquisition_date}
                      onChange={handleChange}
                      className={inputClass}
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="mb-1.5 block text-sm font-medium text-gray-700">
                      Acquisition Type
                    </label>

                    <select
                      name="acquisition_type"
                      value={formData.acquisition_type}
                      onChange={handleChange}
                      className={inputClass}
                    >
                      <option value="">Select acquisition type</option>
                      <option value="Purchased">Purchased</option>
                      <option value="Born on farm">Born on farm</option>
                      <option value="Donated">Donated</option>
                      <option value="Transferred">Transferred</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Notes */}
              <div className="border-t border-gray-100 pt-5">
                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                  Notes
                </label>

                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  rows={3}
                  placeholder="Additional information about this animal..."
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
                  disabled={
                    submitting ||
                    activeFarms.length === 0 ||
                    individualSpecies.length === 0
                  }
                  className="inline-flex items-center gap-2 rounded-lg bg-green-700 px-4 py-2.5 text-sm font-medium text-white hover:bg-green-800 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {submitting && (
                    <Loader2 size={16} className="animate-spin" />
                  )}
                  {submitting ? 'Registering...' : 'Register Animal'}
                </button>
              </div>
            </>
          )}

          {!dataLoading && (
            <>
              {activeFarms.length === 0 && (
                <p className="text-sm text-red-600">
                  No active farms are available. Register or activate a farm first.
                </p>
              )}

              {individualSpecies.length === 0 && (
                <p className="text-sm text-red-600">
                  No active individual-managed species are available. Register one first.
                </p>
              )}
            </>
          )}
        </form>
      </div>
    </div>
  )
}

export default RegisterLivestockModal
