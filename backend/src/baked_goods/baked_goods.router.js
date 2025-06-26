const express = require("express");
const knex = require("../db/connection");
const router = express.Router();

// GET /baked_goods
router.get("/", async (req, res) => {
  try {
    const goods = await knex("baked_goods").select("*");
    res.json(goods);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch baked goods" });
  }
});

// GET /baked_goods/:id
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const good = await knex("baked_goods").where({ id }).first();
    if (!good) return res.status(404).json({ error: `Baked good ID ${id} not found` });
    res.json(good);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch baked good" });
  }
});

// POST /baked_goods
router.post("/", async (req, res) => {
  const { name, quantity = 0 } = req.body;

  if (!name) return res.status(400).json({ error: "Missing required field: name" });

  try {
    const [newGood] = await knex("baked_goods").insert({ name, quantity }).returning("*");
    res.status(201).json(newGood);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to add baked good" });
  }
});

// PUT /baked_goods/:id
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { name, quantity } = req.body;

  if (!name && quantity == null) {
    return res.status(400).json({ error: "Provide at least one field to update: name or quantity" });
  }

  try {
    const updated = await knex("baked_goods").where({ id }).update({ name, quantity }, "*");
    if (!updated.length) return res.status(404).json({ error: `Baked good ID ${id} not found` });
    res.json(updated[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to update baked good" });
  }
});

// DELETE /baked_goods/:id
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const deleted = await knex("baked_goods").where({ id }).del();
    if (!deleted) return res.status(404).json({ error: `Baked good ID ${id} not found` });
    res.status(204).end();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to delete baked good" });
  }
});

module.exports = router;
