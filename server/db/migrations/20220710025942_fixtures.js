/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable('fixtures', (table) => {
    table.increments('id').primary()
    table.datetime('kickoff')
    table.integer('home_team_id').references('teams.id')
    table.integer('away_team_id').references('teams.id')
    table.string('location')
    table.boolean('is_cancelled')
    table.boolean('is_postponed')
    table.timestamps
  })
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable('fixtures')
}
