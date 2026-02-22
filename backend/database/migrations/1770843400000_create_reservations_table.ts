import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'reservations'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary().defaultTo(this.db.rawQuery('gen_random_uuid()').knexQuery)
      table.uuid('restaurant_id').notNullable().references('id').inTable('restaurants').onDelete('CASCADE')
      table.uuid('user_id').nullable().references('id').inTable('users').onDelete('SET NULL')
      table.date('date').notNullable()
      table.string('time', 5).notNullable()
      table.integer('party_size').notNullable()
      table.string('status', 20).notNullable().defaultTo('PENDING')
      table.jsonb('guest_info').notNullable().defaultTo('{}')
      table.text('notes').nullable()
      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').notNullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
