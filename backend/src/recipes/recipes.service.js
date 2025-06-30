// const knex = require("../db/connection");

// function list() {
//   return knex("recipes")
//     .select(
//       "id as recipe_id",
//       "name as title",
//       "image_url"
//     );
// }

// function read(recipe_id) {
//   return knex("recipes")
//     .select(
//       "id as recipe_id",
//       "name as title",
//       "image_url",
//       /* …other fields… */
//     )
//     .where({ id: recipe_id })
//     .first();
// }

module.exports = {
  list,
  read,
  // create,
  // delete,
  // bake,
};