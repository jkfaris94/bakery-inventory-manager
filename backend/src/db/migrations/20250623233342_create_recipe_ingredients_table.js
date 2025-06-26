/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('recipe_ingredients', (table) => {
    table.increments('id').primary();
    table.integer('recipe_id')
         .unsigned()
         .notNullable()
         .references('id')
         .inTable('recipes')
         .onDelete('CASCADE');
    table.integer('ingredient_id')
         .unsigned()
         .notNullable()
         .references('id')
         .inTable('ingredients')
         .onDelete('CASCADE');
    table.float('quantity_needed').notNullable();
    table.string('unit').notNullable(); // e.g. grams, same as ingredient.unit
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('recipe_ingredients');
};

