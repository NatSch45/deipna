import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'restaurants'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.jsonb('cuisine_types').notNullable().defaultTo('[]')
      table.string('price_range', 50).nullable()
      table.jsonb('features').notNullable().defaultTo('[]')
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('cuisine_types')
      table.dropColumn('price_range')
      table.dropColumn('features')
    })
  }
}
