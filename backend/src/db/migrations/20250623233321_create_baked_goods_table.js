/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('baked_goods', tbl => {
    tbl.increments('id').primary();
    tbl
      .integer('recipe_id')
      .unsigned()
      .notNullable()
      .references('id')
      .inTable('recipes')
      .onDelete('CASCADE')
      .unique(); // Ensure one baked good per recipe
    tbl.string('name').notNullable();
    tbl.integer('quantity').notNullable().defaultTo(0);
    tbl.timestamps(true, true);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('baked_goods');
};
