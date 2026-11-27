
import { useState } from 'react'
import { toast } from 'sonner'
import { X } from 'lucide-react'
import { useFarms } from '../../../hooks/useFarms'
import { useProducts } from '../../../hooks/useProducts'
import { useLivestock } from '../../../hooks/useLivestock'
import { useLivestockFlocks } from '../../../hooks/useLivestockFlocks'
import {
  createProductCollection,
  type CreateProductCollectionData,
} from '../../../services/productCollections'

interface CreateProductCollectionModalProps {
  onClose: () => void
  onSuccess: () => void
}

const CreateProductCollectionModal = ({
  onClose,
  onSuccess,
}: CreateProductCollectionModalProps) => {
  const { farms } = useFarms()
  const { products } = useProducts()
  const { livestock } = useLivestock()
  const { flocks } = useLivestockFlocks()

  const [farmId, setFarmId] = useState('')
  const [productId, setProductId] = useState('')
  const [sourceType, setSourceType] = useState<'flock' | 'individual'>('flock')
  const [sourceId, setSourceId] = useState('')
  const [collectionDate, setCollectionDate] = useState(
    new Date().toISOString().split('T')[0]
  )
  const [quantity, setQuantity] = useState('')
  const [rejectedQuantity, setRejectedQuantity] = useState('0')
  const [qualityGrade, setQualityGrade] = useState('')
  const [notes, setNotes] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const activeFarms = farms.filter((farm) => farm.is_active)
  const activeProducts = products.filter((product) => product.is_active)

  const availableLivestock = livestock.filter(
    (animal) => animal.farm_id === farmId && animal.status === 'active'
  )

  const availableFlocks = flocks.filter(
    (flock) => flock.farm_id === farmId && flock.status === 'active'
  )

  const handleFarmChange = (value: string) => {
    setFarmId(value)
    setSourceId('')
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const collectedQuantity = Number(quantity)
    const rejected = Number(rejectedQuantity)

    if (!farmId || !productId || !collectionDate) {
      toast.error('Please complete all required fields.')
      return
    }

    if (!Number.isFinite(collectedQuantity) || collectedQuantity <= 0) {
      toast.error('Collected quantity must be greater than zero.')
      return
    }

    if (!Number.isFinite(rejected) || rejected < 0) {
      toast.error('Rejected quantity cannot be negative.')
      return
    }

    if (rejected > collectedQuantity) {
      toast.error('Rejected quantity cannot exceed collected quantity.')
      return
    }

    if (!sourceId) {
      toast.error('Please select a livestock source.')
      return
    }

    const collectionData: CreateProductCollectionData = {
      farm_id: farmId,
      product_id: productId,
      collection_date: collectionDate,
      quantity: collectedQuantity,
      rejected_quantity: rejected,
      ...(sourceType === 'flock'
        ? { livestock_flock_id: sourceId }
        : { livestock_id: sourceId }),
      ...(qualityGrade.trim()
        ? { quality_grade: qualityGrade.trim() }
        : {}),
      ...(notes.trim() ? { notes: notes.trim() } : {}),
    }

    try {
      setSubmitting(true)

      await createProductCollection(collectionData)

      toast.success('Product collection recorded successfully.')
      onSuccess()
      onClose()
    } catch {
      toast.error('Failed to record product collection.')
    } finally {
      setSubmitting(false)
    }
  }

  const inputClass =
    'w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100'

  const labelClass = 'mb-1.5 block text-sm font-medium text-gray-700'

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Record Product Collection
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Capture products collected from your livestock.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-gray-500 hover:bg-gray-100"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 p-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className={labelClass}>Farm *</label>
              <select
                required
                value={farmId}
                onChange={(e) => handleFarmChange(e.target.value)}
                className={inputClass}
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
              <label className={labelClass}>Product *</label>
              <select
                required
                value={productId}
                onChange={(e) => setProductId(e.target.value)}
                className={inputClass}
              >
                <option value="">Select product</option>
                {activeProducts.map((product) => (
                  <option key={product.id} value={product.id}>
                    {product.name} ({product.product_code})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="rounded-lg border border-gray-200 p-4">
            <h3 className="mb-3 text-sm font-semibold text-gray-900">
              Collection Source
            </h3>

            <div className="mb-4 flex flex-wrap gap-4">
              <label className="flex items-center gap-2 text-sm text-gray-700">
                <input
                  type="radio"
                  name="sourceType"
                  value="flock"
                  checked={sourceType === 'flock'}
                  onChange={() => {
                    setSourceType('flock')
                    setSourceId('')
                  }}
                  className="accent-green-700"
                />
                Livestock flock
              </label>

              <label className="flex items-center gap-2 text-sm text-gray-700">
                <input
                  type="radio"
                  name="sourceType"
                  value="individual"
                  checked={sourceType === 'individual'}
                  onChange={() => {
                    setSourceType('individual')
                    setSourceId('')
                  }}
                  className="accent-green-700"
                />
                Individual animal
              </label>
            </div>

            <label className={labelClass}>
              {sourceType === 'flock' ? 'Select flock *' : 'Select animal *'}
            </label>

            <select
              required
              value={sourceId}
              onChange={(e) => setSourceId(e.target.value)}
              disabled={!farmId}
              className={inputClass}
            >
              <option value="">
                {!farmId
                  ? 'Select a farm first'
                  : sourceType === 'flock'
                    ? 'Select flock'
                    : 'Select animal'}
              </option>

              {sourceType === 'flock'
                ? availableFlocks.map((flock) => (
                    <option key={flock.id} value={flock.id}>
                      {flock.flock_code} - {flock.breed || 'Unspecified breed'}
                    </option>
                  ))
                : availableLivestock.map((animal) => (
                    <option key={animal.id} value={animal.id}>
                      {animal.animal_code} - {animal.breed || 'Unspecified breed'}
                    </option>
                  ))}
            </select>

            {farmId &&
              ((sourceType === 'flock' && availableFlocks.length === 0) ||
                (sourceType === 'individual' &&
                  availableLivestock.length === 0)) && (
                <p className="mt-2 text-xs text-amber-600">
                  No active {sourceType === 'flock' ? 'flocks' : 'animals'} found
                  for this farm.
                </p>
              )}
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className={labelClass}>Collection Date *</label>
              <input
                type="date"
                required
                value={collectionDate}
                onChange={(e) => setCollectionDate(e.target.value)}
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>Quantity Collected *</label>
              <input
                type="number"
                required
                min="0.01"
                step="any"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder="Enter quantity"
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>Rejected Quantity</label>
              <input
                type="number"
                min="0"
                step="any"
                value={rejectedQuantity}
                onChange={(e) => setRejectedQuantity(e.target.value)}
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>Quality Grade</label>
              <select
                value={qualityGrade}
                onChange={(e) => setQualityGrade(e.target.value)}
                className={inputClass}
              >
                <option value="">Select quality grade</option>
                <option value="Grade A">Grade A</option>
                <option value="Grade B">Grade B</option>
                <option value="Grade C">Grade C</option>
                <option value="Not Graded">Not Graded</option>
              </select>
            </div>
          </div>

          <div>
            <label className={labelClass}>Notes</label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Additional collection details..."
              className={inputClass}
            />
          </div>

          <div className="flex justify-end gap-3 border-t border-gray-200 pt-4">
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
              className="rounded-lg bg-green-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-green-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {submitting ? 'Recording...' : 'Record Collection'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CreateProductCollectionModal
