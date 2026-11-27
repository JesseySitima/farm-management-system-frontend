import api from './api'

export interface CollectionFarm {
  id: string
  name: string
  farm_code: string
}

export interface CollectionProduct {
  id: string
  name: string
  product_code: string
  unit_of_measure: string
}

export interface CollectionLivestock {
  id: string
  animal_code: string
  breed: string | null
}

export interface CollectionFlock {
  id: string
  breed: string | null
  flock_code: string
  total_quantity: number
}

export interface ProductCollection {
  id: string
  farm_id: string
  product_id: string
  livestock_id: string | null
  livestock_flock_id: string | null
  collection_date: string
  quantity: number
  rejected_quantity: number
  quality_grade: string | null
  notes: string | null
  created_at: string
  updated_at: string
  farms: CollectionFarm
  products: CollectionProduct
  livestock: CollectionLivestock | null
  livestock_flocks: CollectionFlock | null
}

export interface CreateProductCollectionData {
  farm_id: string
  product_id: string
  quantity: number
  collection_date: string
  livestock_id?: string
  livestock_flock_id?: string
  notes?: string
  quality_grade?: string
  rejected_quantity?: number
}

interface ProductCollectionsResponse {
  data: ProductCollection[]
}

export const getProductCollections = async (): Promise<ProductCollection[]> => {
  const response = await api.get<ProductCollectionsResponse>(
    '/product-collections'
  )

  return response.data.data
}

export const createProductCollection = async (
  collectionData: CreateProductCollectionData
): Promise<void> => {
  await api.post('/product-collections', collectionData)
}