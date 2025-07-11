/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function (knex) {
  const isPostgres = knex.client.config.client === 'pg';

  if (isPostgres) {
    await knex.raw("TRUNCATE TABLE baked_goods RESTART IDENTITY CASCADE");
  } else {
    await knex('baked_goods').del();
    await knex.raw('DELETE FROM sqlite_sequence WHERE name = ?', ['baked_goods']);
  }

  await knex('baked_goods').insert([
    { recipe_id: 1, name: "Chocolate Chip Cookies", quantity: 0 },
    { recipe_id: 2, name: "Banana Bread", quantity: 0 },
    { recipe_id: 3, name: "Croissants", quantity: 0 },
  ]);
};

