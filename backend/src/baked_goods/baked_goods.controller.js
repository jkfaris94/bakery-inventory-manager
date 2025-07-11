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
  const incoming = req.body.data || req.body;
  const { recipe_id, name, quantity = 0 } = incoming;

  if (!recipe_id) {
    return res.status(400).json({ error: "Must include recipe_id" });
  }
  if (!name) {
    return res.status(400).json({ error: "Must include name" });
  }

  try {
    // 1) Check if there's already a baked_good for this recipe
    const existing = await knex("baked_goods")
      .where({ recipe_id })
      .first();

    let bakedGood;
    if (existing) {
      // 2a) If it exists, increment its quantity
      await knex("baked_goods")
        .where({ recipe_id })
        .increment("quantity", quantity);

      bakedGood = await knex("baked_goods")
        .where({ recipe_id })
        .first();
      res.status(200).json({ data: bakedGood });
    } else {
      // 2b) Otherwise insert a brand-new row
      const [newGood] = await knex("baked_goods")
        .insert({ recipe_id, name, quantity })
        .returning("*");
      res.status(201).json({ data: newGood });
    }
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


module.exports = {
  list,
  read,
  create,
  update,
};