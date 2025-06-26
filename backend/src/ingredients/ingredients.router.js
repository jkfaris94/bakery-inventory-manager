const express = require("express");
const knex = require("../db/connection");
const router = express.Router();

// GET /ingredients
router.get("/", async (req, res) => {
  try {
    const ingredients = await knex("ingredients").select("*");
    res.json(ingredients);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch ingredients" });
  }
});

// POST /ingredients
router.post("/", async (req, res) => {
  const { name, quantity, unit } = req.body;

  if (!name || !quantity || !unit) {
    return res.status(400).json({ error: "Missing required fields: name, quantity, unit" });
  }

  try {
    const [newIngredient] = await knex("ingredients")
      .insert({ name, quantity, unit })
      .returning("*");

    res.status(201).json(newIngredient);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to add ingredient" });
  }
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const ingredient = await knex("ingredients").where({ id }).first();

    if (!ingredient) {
      return res.status(404).json({ error: `Ingredient ID ${id} not found` });
    }

    res.json(ingredient);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch ingredient" });
  }
});

router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { name, quantity, unit } = req.body;

  if (!name && quantity == null && !unit) {
    return res.status(400).json({ error: "Provide at least one field to update: name, quantity, or unit" });
  }

  try {
    const updated = await knex("ingredients")
      .where({ id })
      .update({ name, quantity, unit }, "*");

    if (!updated.length) {
      return res.status(404).json({ error: `Ingredient ID ${id} not found` });
    }

    res.json(updated[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to update ingredient" });
  }
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const deleted = await knex("ingredients").where({ id }).del();

    if (!deleted) {
      return res.status(404).json({ error: `Ingredient ID ${id} not found` });
    }

    res.status(204).end();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to delete ingredient" });
  }
});

module.exports = router;
