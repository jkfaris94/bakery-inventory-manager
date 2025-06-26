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

module.exports = router;
