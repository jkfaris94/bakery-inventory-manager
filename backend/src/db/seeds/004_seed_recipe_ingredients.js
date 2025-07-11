/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function (knex) {
  const isPostgres = knex.client.config.client === 'pg';

  if (isPostgres) {
    await knex.raw("TRUNCATE TABLE recipe_ingredients RESTART IDENTITY CASCADE");
  } else {
    await knex('recipe_ingredients').del();
    await knex.raw('DELETE FROM sqlite_sequence WHERE name = ?', ['recipe_ingredients']);
  }

  await knex('recipe_ingredients').insert([
    // Cookie Recipe (recipe_id: 1)
    { recipe_id: 1, ingredient_id: 1, quantity_needed: 200, unit: "grams" }, // flour
    { recipe_id: 1, ingredient_id: 2, quantity_needed: 100, unit: "grams" }, // sugar
    { recipe_id: 1, ingredient_id: 3, quantity_needed: 100, unit: "grams" }, // butter
    { recipe_id: 1, ingredient_id: 4, quantity_needed: 2, unit: "count" },   // eggs

    // Banana Bread (recipe_id: 2)
    { recipe_id: 2, ingredient_id: 1, quantity_needed: 250, unit: "grams" },
    { recipe_id: 2, ingredient_id: 2, quantity_needed: 100, unit: "grams" },
    { recipe_id: 2, ingredient_id: 4, quantity_needed: 2, unit: "count" },
    { recipe_id: 2, ingredient_id: 5, quantity_needed: 100, unit: "ml" },

    // Croissant (recipe_id: 3)
    { recipe_id: 3, ingredient_id: 1, quantity_needed: 300, unit: "grams" },
    { recipe_id: 3, ingredient_id: 3, quantity_needed: 150, unit: "grams" },
    { recipe_id: 3, ingredient_id: 5, quantity_needed: 200, unit: "ml" },
  ]);
};

