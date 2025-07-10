const knex = require("../db/connection");

// GET /baked_goods - List all baked goods
async function list(req, res, next) {
  try {
    const data = await knex("baked_goods").select("*");
    res.json({ data });
  } catch (error) {
    next(error);
  }
}

// GET /baked_goods/:id - Read single baked good by ID
async function read(req, res, next) {
  try {
    const good = await knex("baked_goods").where({ id: req.params.id }).first();
    if (!good) return res.status(404).json({ error: "Baked good not found" });
    res.json({ data: good });
  } catch (error) {
    next(error);
  }
}

// POST /baked_goods - Create a new baked good
async function create(req, res, next) {
  const { name, quantity = 0 } = req.body;
  if (!name) {
    return res.status(400).json({ error: "Missing required field: name" });
  }

  try {
    const [newGood] = await knex("baked_goods")
      .insert({ name, quantity })
      .returning("*");

    res.status(201).json({ data: newGood });
  } catch (error) {
    next(error);
  }
}

// PUT /baked_goods/:id - Update name or quantity of a baked good
async function update(req, res, next) {
  const { id } = req.params;
  const { name, quantity } = req.body;

  if (!name && quantity == null) {
    return res.status(400).json({ error: "Provide name or quantity to update" });
  }

  try {
    const updated = await knex("baked_goods")
      .where({ id })
      .update({ name, quantity }, "*");

    if (!updated.length) {
      return res.status(404).json({ error: "Baked good not found" });
    }

    res.json({ data: updated[0] });
  } catch (error) {
    next(error);
  }
}

// DELETE /baked_goods/:id - Remove a baked good
async function destroy(req, res, next) {
  try {
    const deleted = await knex("baked_goods").where({ id: req.params.id }).del();
    if (!deleted) {
      return res.status(404).json({ error: "Baked good not found" });
    }
    res.status(204).json({});
  } catch (error) {
    next(error);
  }
}

module.exports = {
  list,
  read,
  create,
  update,
  delete: destroy,
};