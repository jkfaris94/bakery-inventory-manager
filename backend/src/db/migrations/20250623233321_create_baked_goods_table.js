/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('baked_goods', (table) => {
    table.increments('id').primary();
    table.string('name').notNullable();
    table.integer('quantity').notNullable().defaultTo(0);
    table.timestamps(true, true);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('baked_goods');
};
