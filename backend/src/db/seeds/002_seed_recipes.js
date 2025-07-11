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
      image_url:     "https://images.contentstack.io/v3/assets/bltcedd8dbd5891265b/bltcf8370ba0b3162f8/6790184458fb6d84f38112bc/cookie-types-hero-assorted-cookies.jpeg",
    },
    {
      title:         "Banana Bread Recipe",
      description:   "Moist banana bread with walnuts and a hint of cinnamon.",
      image_url:     "https://www.rainbownourishments.com/wp-content/uploads/2023/01/vegan-banana-bread-1.jpg",
    },
    {
      title:         "Croissant Recipe",
      description:   "Flaky, buttery croissants made with laminated dough.",
      image_url:     "https://baranbakery.com/wp-content/uploads/2024/07/Croissants-20-500x500.jpg",
    },
  ]);
};