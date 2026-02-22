import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import User from '#models/user'

export default class RefreshToken extends BaseModel {
  @column({ isPrimary: true })
  declare id: string

  @column()
  declare token: string

  @column({ columnName: 'user_id' })
  declare userId: string

  @column({ columnName: 'expires_at' })
  declare expiresAt: DateTime

  @column()
  declare revoked: boolean

  @column.dateTime({ autoCreate: true, columnName: 'created_at' })
  declare createdAt: DateTime

  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>

  static table = 'refresh_tokens'
}
