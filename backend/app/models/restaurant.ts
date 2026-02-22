import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import User from '#models/user'
import RestaurantOpeningHours from '#models/restaurant_opening_hours'

interface Address {
  street: string
  city: string
  postalCode: string
  country: string
}

type CuisineType =
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

type RestaurantFeature =
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

type PriceRange = 'BUDGET' | 'MODERATE' | 'UPSCALE' | 'FINE_DINING'

const jsonArrayColumn = {
  prepare: (value: string[]) => JSON.stringify(value ?? []),
  consume: (value: string | string[]) =>
    typeof value === 'string' ? JSON.parse(value) : (value ?? []),
}

export default class Restaurant extends BaseModel {
  static table = 'restaurants'

  @column({ isPrimary: true })
  declare id: string

  @column()
  declare name: string

  @column()
  declare description: string | null

  @column()
  declare phone: string | null

  @column()
  declare email: string | null

  @column({
    prepare: (value: Address) => JSON.stringify(value),
    consume: (value: string | Address) =>
      typeof value === 'string' ? JSON.parse(value) : value,
  })
  declare address: Address | null

  @column(jsonArrayColumn)
  declare cuisineTypes: CuisineType[]

  @column()
  declare priceRange: PriceRange | null

  @column(jsonArrayColumn)
  declare features: RestaurantFeature[]

  @column({ columnName: 'owner_id' })
  declare ownerId: string

  @belongsTo(() => User, { foreignKey: 'ownerId' })
  declare owner: BelongsTo<typeof User>

  @hasMany(() => RestaurantOpeningHours, { foreignKey: 'restaurantId' })
  declare openingHours: HasMany<typeof RestaurantOpeningHours>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
