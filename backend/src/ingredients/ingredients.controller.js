const knex = require("../db/connection");

//list ingredients 
async function list(req, res, next) {
    try {
        const data = await knex("ingredients").select("*");
        res.json(data);
    } catch (error) {
        next(error);
    }
}

//read ingredient by ID 
async function read(req, res, next) {
    try {
        const ingredient = await knex("ingredients").where({ id: req.params.id }).first();
        if (!ingredient) return res.status(404).json({ error: "Ingredient not found"});
        res.json(ingredient);
    } catch (error) {
        next(error);
    }
}

//POST ingredient 
async function create(req, res, next) {
    const { name, quantity, unit } = req.body;
    if ( !name || quantity == null || !unit) {
        return res.status(400).json({ error: "Missing fields: name, quantity, unit"})
    }

    try {
        const [newIngredient] = await knex("ingredients").insert({ name, quantity, unit }).returning("*");
        res.status(201).json(newIngredient);
    } catch (error) {
        next(error);
    }
}

//PUT update ingredients 
async function update(req, res, next) {
  const { id } = req.params;
  const { name, quantity, unit } = req.body;

  try {
    const updated = await knex("ingredients")
      .where({ id })
      .update({ name, quantity, unit }, "*");

    if (!updated.length) return res.status(404).json({ error: "Ingredient not found" });
    res.json(updated[0]);
  } catch (error) {
    next(error);
  }
}

//DELETE ingredient 
async function destroy(req, res, next) {
  try {
    const deleted = await knex("ingredients").where({ id: req.params.id }).del();
    if (!deleted) return res.status(404).json({ error: "Ingredient not found" });
    res.status(204).end();
  } catch (error) {
    next(error);
  }
}

// GET /ingredients/:id/recipes
async function listRecipes(req, res, next) {
  const { id: ingredientId } = req.params;

  try {
    const recipes = await knex("recipe_ingredients as ri")
      .join("recipes as r", "ri.recipe_id", "r.id")
      .select("r.id", "r.name")
      .where("ri.ingredient_id", ingredientId);

    res.json(recipes);
  } catch (error) {
    console.error("Error in listRecipes:", error);
    next(error);
  }
}

module.exports = {
  list,
  read,
  create,
  update,
  delete: destroy,
  listRecipes,
};