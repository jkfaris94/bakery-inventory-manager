/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('recipes', (table) => {
    table.increments('id').primary();
    table.string('name'); // Optional descriptive name
    table.integer('baked_good_id')
         .unsigned()
         .notNullable()
         .references('id')
         .inTable('baked_goods')
         .onDelete('CASCADE');
    table.timestamps(true, true);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('recipes');
};

