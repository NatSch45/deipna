export interface Restaurant {
  id: string
  name: string
  description: string
  phone: string
  email?: string
  address: Address
  cuisineTypes: CuisineType[]
  features: RestaurantFeature[]
  openingHours: OpeningHours[]
  photos: string[]
  averageRating?: number
  priceRange: PriceRange
  ownerId: string
  createdAt: string
  updatedAt: string
}

export interface Address {
  street: string
  city: string
  postalCode: string
  country: string
  latitude?: number
  longitude?: number
}

export type CuisineType =
  | 'FRENCH'
  | 'ITALIAN'
  | 'JAPANESE'
  | 'CHINESE'
  | 'INDIAN'
  | 'MEXICAN'
  | 'THAI'
  | 'MEDITERRANEAN'
  | 'AMERICAN'
  | 'OTHER'

export type RestaurantFeature =
  | 'VEGAN_FRIENDLY'
  | 'VEGETARIAN_FRIENDLY'
  | 'HALAL'
  | 'KOSHER'
  | 'GLUTEN_FREE'
  | 'WHEELCHAIR_ACCESSIBLE'
  | 'PARKING'
  | 'TERRACE'
  | 'WIFI'
  | 'PET_FRIENDLY'

export type PriceRange = 'BUDGET' | 'MODERATE' | 'UPSCALE' | 'FINE_DINING'

export interface OpeningHours {
  id?: string
  restaurantId?: string
  dayOfWeek: number // 0 = Sunday, 6 = Saturday
  openTime: string // HH:mm format
  closeTime: string // HH:mm format
  isClosed: boolean
}

export interface RestaurantSearchParams {
  query?: string
  cuisineTypes?: CuisineType[]
  features?: RestaurantFeature[]
  priceRange?: PriceRange[]
  city?: string
  latitude?: number
  longitude?: number
  radius?: number
  page?: number
  size?: number
  sortBy?: 'name' | 'rating' | 'distance'
  sortOrder?: 'asc' | 'desc'
}

export interface RestaurantSearchResponse {
  content: Restaurant[]
  totalElements: number
  totalPages: number
  page: number
  size: number
}
