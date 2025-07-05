/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.alterTable("recipe_ingredients", (table) => {
    table.integer("ingredient_id").unsigned().notNullable().alter();
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.alterTable("recipe_ingredients", (table) => {
    table.integer("ingredient_id").unsigned().notNullable().alter();
  });
};
