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

module.exports = router;
