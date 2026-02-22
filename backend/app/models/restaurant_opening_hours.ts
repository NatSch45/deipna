import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Restaurant from '#models/restaurant'

export default class RestaurantOpeningHours extends BaseModel {
  static table = 'restaurant_opening_hours'

  @column({ isPrimary: true })
  declare id: string

  @column({ columnName: 'restaurant_id' })
  declare restaurantId: string

  @column({ columnName: 'day_of_week' })
  declare dayOfWeek: number

  @column({ columnName: 'open_time' })
  declare openTime: string

  @column({ columnName: 'close_time' })
  declare closeTime: string

  @column({ columnName: 'is_closed' })
  declare isClosed: boolean

  @belongsTo(() => Restaurant, { foreignKey: 'restaurantId' })
  declare restaurant: BelongsTo<typeof Restaurant>
}
