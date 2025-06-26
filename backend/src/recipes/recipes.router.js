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

module.exports = router;
