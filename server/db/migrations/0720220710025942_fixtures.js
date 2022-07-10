/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable('fixtures', (t) => {
    t.uuid('id').primary()
    t.datetime('kickoff')
    t.uuid('home_team_id').references('teams.id')
    t.uuid('away_team_id').references('teams.id')
    t.string('location')
    t.boolean('is_cancelled')
    t.boolean('is_postponed')
    t.uuid('competition_id').references('competitions.id')
    t.timestamps
  })
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable('fixtures')
}
