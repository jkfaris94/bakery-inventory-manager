/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function (knex) {
  const isPostgres = knex.client.config.client === 'pg';

  if (isPostgres) {
    await knex.raw("TRUNCATE TABLE recipes RESTART IDENTITY CASCADE");
  } else {
    await knex('recipes').del();
    await knex.raw('DELETE FROM sqlite_sequence WHERE name = ?', ['recipes']);
  }

  await knex('recipes').insert([
    { name: "Cookie Recipe", baked_good_id: 1 },
    { name: "Banana Bread Recipe", baked_good_id: 2 },
    { name: "Croissant Recipe", baked_good_id: 3 },
  ]);
};
