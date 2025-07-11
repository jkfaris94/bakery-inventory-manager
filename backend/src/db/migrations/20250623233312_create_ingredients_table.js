/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('ingredients', (table) => {
    table.increments('id').primary();
    table.string('name').notNullable();
    table.float('quantity').notNullable().defaultTo(0);
    table.string('unit').notNullable(); 
    table.timestamps(true, true);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('ingredients');
};
