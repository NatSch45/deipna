import vine from '@vinejs/vine'

const addressSchema = vine.object({
  street: vine.string().trim().minLength(1),
  city: vine.string().trim().minLength(1),
  postalCode: vine.string().trim().minLength(1),
  country: vine.string().trim().minLength(1),
})

const cuisineTypeEnum = vine.enum([
  'FRENCH',
  'ITALIAN',
  'JAPANESE',
  'CHINESE',
  'INDIAN',
  'MEXICAN',
  'THAI',
  'MEDITERRANEAN',
  'AMERICAN',
  'OTHER',
] as const)

const featureEnum = vine.enum([
  'VEGAN_FRIENDLY',
  'VEGETARIAN_FRIENDLY',
  'HALAL',
  'KOSHER',
  'GLUTEN_FREE',
  'WHEELCHAIR_ACCESSIBLE',
  'PARKING',
  'TERRACE',
  'WIFI',
  'PET_FRIENDLY',
] as const)

const priceRangeEnum = vine.enum(['BUDGET', 'MODERATE', 'UPSCALE', 'FINE_DINING'] as const)

const openingHoursItemSchema = vine.object({
  dayOfWeek: vine.number().min(0).max(6),
  openTime: vine.string().regex(/^\d{2}:\d{2}$/),
  closeTime: vine.string().regex(/^\d{2}:\d{2}$/),
  isClosed: vine.boolean(),
})

export const createRestaurantValidator = vine.compile(
  vine.object({
    name: vine.string().trim().minLength(1).maxLength(255),
    description: vine.string().trim().optional(),
    phone: vine.string().trim().optional(),
    email: vine.string().email().optional(),
    address: addressSchema.optional(),
    cuisineTypes: vine.array(cuisineTypeEnum).optional(),
    priceRange: priceRangeEnum.optional(),
    features: vine.array(featureEnum).optional(),
    openingHours: vine.array(openingHoursItemSchema).optional(),
  })
)

export const updateRestaurantValidator = vine.compile(
  vine.object({
    name: vine.string().trim().minLength(1).maxLength(255).optional(),
    description: vine.string().trim().optional(),
    phone: vine.string().trim().optional(),
    email: vine.string().email().optional(),
    address: addressSchema.optional(),
    cuisineTypes: vine.array(cuisineTypeEnum).optional(),
    priceRange: priceRangeEnum.optional(),
    features: vine.array(featureEnum).optional(),
    openingHours: vine.array(openingHoursItemSchema).optional(),
  })
)
