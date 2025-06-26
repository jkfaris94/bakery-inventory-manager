const express = require("express");
const knex = require("../db/connection");
const router = express.Router();
const recipeIngredientsRouter = require("./recipe_ingredients.router"); //import recipe_ingredients.router 

// GET /recipes - list all
router.get("/", async (req, res) => {
  try {
    const recipes = await knex("recipes").select("*");
    res.json(recipes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch recipes" });
  }
});

// GET /recipes/:id - single recipe
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const recipe = await knex("recipes").where({ id }).first();

    if (!recipe) return res.status(404).json({ error: `Recipe ID ${id} not found` });

    res.json(recipe);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch recipe" });
  }
});

// POST /recipes - create new recipe
router.post("/", async (req, res) => {
  const { name, baked_good_id } = req.body;

  if (!baked_good_id) {
    return res.status(400).json({ error: "Missing required field: baked_good_id" });
  }

  try {
    const [newRecipe] = await knex("recipes").insert({ name, baked_good_id }).returning("*");
    res.status(201).json(newRecipe);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create recipe" });
  }
});

// DELETE /recipes/:id - delete recipe
router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const deleted = await knex("recipes").where({ id }).del();

    if (!deleted) {
      return res.status(404).json({ error: `Recipe ID ${id} not found` });
    }

    res.status(204).end();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to delete recipe" });
  }
});

router.use("/:id/ingredients", recipeIngredientsRouter);

// POST /recipes/:id/bake
router.post("/:id/bake", async (req, res) => {
  const { id: recipe_id } = req.params;

  try {
    // 1. Get recipe
    const recipe = await knex("recipes").where({ id: recipe_id }).first();
    if (!recipe) return res.status(404).json({ error: `Recipe ${recipe_id} not found` });

    // 2. Get required ingredients
    const neededIngredients = await knex("recipe_ingredients as ri")
      .join("ingredients as i", "ri.ingredient_id", "i.id")
      .where("ri.recipe_id", recipe_id)
      .select(
        "i.id as ingredient_id",
        "i.name",
        "i.quantity as available",
        "ri.quantity_needed"
      );

    // 3. Check availability
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

    // 4. Start transaction
    await knex.transaction(async (trx) => {
      // Subtract ingredients
      for (const ing of neededIngredients) {
        await trx("ingredients")
          .where({ id: ing.ingredient_id })
          .update({
            quantity: knex.raw("quantity - ?", [ing.quantity_needed]),
          });
      }

      // Increase baked good quantity
      await trx("baked_goods")
        .where({ id: recipe.baked_good_id })
        .update({
          quantity: knex.raw("quantity + 1"),
        });
    });

    res.status(200).json({ message: "Baking complete!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to bake recipe" });
  }
});


module.exports = router;
