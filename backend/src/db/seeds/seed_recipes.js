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
    {
      title:         "Cookie Recipe",
      description:   "Classic chocolate chip cookies with a crispy edge and chewy center.",
      image_url:     "https://example.com/cookies.jpg",
      baked_good_id: 1,
    },
    {
      title:         "Banana Bread Recipe",
      description:   "Moist banana bread with walnuts and a hint of cinnamon.",
      image_url:     "https://example.com/banana-bread.jpg",
      baked_good_id: 2,
    },
    {
      title:         "Croissant Recipe",
      description:   "Flaky, buttery croissants made with laminated dough.",
      image_url:     "https://example.com/croissants.jpg",
      baked_good_id: 3,
    },
  ]);
};