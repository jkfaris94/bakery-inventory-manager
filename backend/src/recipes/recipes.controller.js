const knex = require("../db/connection");

// GET /recipes - List all recipes
async function list(req, res, next) {
  try {
    const data = await knex("recipes").select("*");
    res.json(data);
  } catch (error) {
    next(error);
  }
}

// GET /recipes/:id - Get a recipe by ID
async function read(req, res, next) {
  try {
    const recipe = await knex("recipes").where({ id: req.params.id }).first();
    if (!recipe) return res.status(404).json({ error: "Recipe not found" });
    res.json(recipe);
  } catch (error) {
    next(error);
  }
}

// POST /recipes - Create a new recipe
async function create(req, res, next) {
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ error: "Missing required field: name" });
  }

    // Check if name already exists
  const existing = await knex("recipes").where({ name }).first();
  if (existing) {
    return res.status(409).json({ error: "Recipe name already taken" });
  }

  try {
    const newRecipe = await knex.transaction(async (trx) => {
      // Create a baked_good
      const [bg] = await trx("baked_goods")
        .insert({ name, quantity: 0 })
        .returning("*");

      // Create the recipe linked to that baked_good
      const [recipe] = await trx("recipes")
        .insert({ name, baked_good_id: bg.id })
        .returning("*");

      return recipe;
    });

    res.status(201).json(newRecipe);
  } catch (err) {
    next(err);
  }
}

// DELETE /recipes/:id - Remove a recipe
async function destroy(req, res, next) {
  try {
    const deleted = await knex("recipes").where({ id: req.params.id }).del();
    if (!deleted) return res.status(404).json({ error: "Recipe not found" });
    res.status(204).end();
  } catch (error) {
    next(error);
  }
}

// POST /recipes/:id/bake - Bake a recipe
async function bake(req, res, next) {
  const { id: recipe_id } = req.params;

  try {
    // 1. Fetch recipe
    const recipe = await knex("recipes")
      .where({ id: recipe_id })
      .first();
    if (!recipe) {
      return res.status(404).json({ error: "Recipe not found" });
    }

    // 2. Get needed ingredients
    const neededIngredients = await knex("recipe_ingredients as ri")
      .join("ingredients as i", "ri.ingredient_id", "i.id")
      .where("ri.recipe_id", recipe_id)
      .select(
        "i.id as ingredient_id",
        "i.name",
        "i.quantity as available",
        "ri.quantity_needed"
      );

    // 3. Check sufficiency
    const insufficient = neededIngredients.filter(
      (i) => i.available < i.quantity_needed
    );
    if (insufficient.length) {
      return res.status(400).json({
        error: "Insufficient ingredients",
        missing: insufficient.map((i) => ({
          name: i.name,
          available: i.available,
          needed: i.quantity_needed,
        })),
      });
    }

    // 4. Decrement ingredients & increment baked_good
    const updatedGood = await knex.transaction(async (trx) => {
      for (const ing of neededIngredients) {
        await trx("ingredients")
          .where({ id: ing.ingredient_id })
          .decrement("quantity", ing.quantity_needed);
      }

      await trx("baked_goods")
        .where({ id: recipe.baked_good_id })
        .increment("quantity", 1);

      return trx("baked_goods")
        .where({ id: recipe.baked_good_id })
        .first();
    });

    // 5. Return success
    res.status(200).json({ message: "Baking complete!", baked_good: updatedGood });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  list,
  read,
  create,
  delete: destroy,
  bake,
};
