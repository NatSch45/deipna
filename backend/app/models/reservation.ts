import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import User from '#models/user'
import Restaurant from '#models/restaurant'

type ReservationStatus = 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED' | 'NO_SHOW'

interface GuestInfo {
  firstName: string
  lastName: string
  email: string
  phone: string
}

export default class Reservation extends BaseModel {
  static table = 'reservations'

  @column({ isPrimary: true })
  declare id: string

  @column({ columnName: 'restaurant_id' })
  declare restaurantId: string

  @column({ columnName: 'user_id' })
  declare userId: string | null

  @column({
    prepare: (value: string) => value,
    consume: (value: string | Date) =>
      value instanceof Date
        ? value.toISOString().substring(0, 10)
        : String(value).substring(0, 10),
  })
  declare date: string

  @column()
  declare time: string

  @column({ columnName: 'party_size' })
  declare partySize: number

  @column()
  declare status: ReservationStatus

  @column({
    columnName: 'guest_info',
    prepare: (value: GuestInfo) => JSON.stringify(value ?? {}),
    consume: (value: string | GuestInfo) =>
      typeof value === 'string' ? JSON.parse(value) : (value ?? {}),
  })
  declare guestInfo: GuestInfo

  @column()
  declare notes: string | null

  @belongsTo(() => Restaurant, { foreignKey: 'restaurantId' })
  declare restaurant: BelongsTo<typeof Restaurant>

  @belongsTo(() => User, { foreignKey: 'userId' })
  declare user: BelongsTo<typeof User>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
