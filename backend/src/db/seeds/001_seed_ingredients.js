/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function (knex) {
  const isPostgres = knex.client.config.client === 'pg';

  if (isPostgres) {
    await knex.raw("TRUNCATE TABLE ingredients RESTART IDENTITY CASCADE");
  } else {
    await knex('ingredients').del();
    await knex.raw('DELETE FROM sqlite_sequence WHERE name = ?', ['ingredients']);
  }

  await knex('ingredients').insert([
    { name: "flour", quantity: 10000, unit: "grams" },
    { name: "sugar", quantity: 5000, unit: "grams" },
    { name: "butter", quantity: 3000, unit: "grams" },
    { name: "eggs", quantity: 120, unit: "count" },
    { name: "milk", quantity: 8000, unit: "ml" },
  ]);
};

