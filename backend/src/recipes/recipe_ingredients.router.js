const express = require("express");
const knex = require("../db/connection");
const router = express.Router({ mergeParams: true }); // merge :id from parent

// POST /recipes/:id/ingredients
router.post("/", async (req, res) => {
  const recipe_id = req.params.id;
  const { ingredient_id, quantity_needed, unit } = req.body;

  if (!ingredient_id || !quantity_needed || !unit) {
    return res.status(400).json({ error: "Missing fields: ingredient_id, quantity_needed, unit" });
  }

  try {
    // Make sure recipe exists
    const recipe = await knex("recipes").where({ id: recipe_id }).first();
    if (!recipe) return res.status(404).json({ error: `Recipe ID ${recipe_id} not found` });

    const [newEntry] = await knex("recipe_ingredients")
      .insert({ recipe_id, ingredient_id, quantity_needed, unit })
      .returning("*");

    res.status(201).json(newEntry);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to add ingredient to recipe" });
  }
});

// DELETE /recipes/:id/ingredients/:ingredientId
router.delete("/:ingredientId", async (req, res) => {
  const { id: recipe_id, ingredientId: ingredient_id } = req.params;

  try {
    const deleted = await knex("recipe_ingredients")
      .where({ recipe_id, ingredient_id })
      .del();

    if (!deleted) {
      return res
        .status(404)
        .json({ error: `Ingredient ${ingredient_id} not found in recipe ${recipe_id}` });
    }

    res.status(204).end(); // No content
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to remove ingredient from recipe" });
  }
});

// GET /recipes/:id/ingredients
router.get("/", async (req, res) => {
  const { id: recipe_id } = req.params;

  try {
    const ingredients = await knex("recipe_ingredients as ri")
      .join("ingredients as i", "ri.ingredient_id", "i.id")
      .where("ri.recipe_id", recipe_id)
      .select(
        "i.id as ingredient_id",
        "i.name",
        "ri.quantity_needed",
        "ri.unit"
      );

    res.json(ingredients);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch recipe ingredients" });
  }
});

module.exports = router;
