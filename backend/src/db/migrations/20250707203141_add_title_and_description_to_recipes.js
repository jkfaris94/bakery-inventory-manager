/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.alterTable('recipes', table => {
    table.renameColumn('name', 'title');
    table.text('description').notNullable().defaultTo('');
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.alterTable('recipes', table => {
    table.dropColumn('description');
    table.renameColumn('title', 'name');
  });
};
