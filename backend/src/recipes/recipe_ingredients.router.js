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

module.exports = router;
