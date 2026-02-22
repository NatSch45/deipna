import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class RevokedAccessToken extends BaseModel {
  @column({ isPrimary: true })
  declare jti: string

  @column({ columnName: 'expires_at' })
  declare expiresAt: DateTime

  @column.dateTime({ autoCreate: true, columnName: 'created_at' })
  declare createdAt: DateTime

  static table = 'revoked_access_tokens'
}
