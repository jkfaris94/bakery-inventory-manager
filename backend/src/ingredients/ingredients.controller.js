const knex = require("../db/connection");

// GET /ingredients - List all ingredients
async function list(req, res, next) {
  try {
    const data = await knex("ingredients").select("*");
    return res.status(200).json({ data });
  } catch (error) {
    next(error);
  }
}

// GET /ingredients/:id - Read a specific ingredient
async function read(req, res, next) {
  const { id } = req.params;
  try {
    const item = await knex("ingredients").where({ id }).first();
    if (!item) {
      return res.status(404).json({ error: "Ingredient not found" });
    }
    return res.status(200).json({ data: item });
  } catch (error) {
    next(error);
  }
}

// POST /ingredients - Create a new ingredient
async function create(req, res, next) {
  const { data = {} } = req.body;
  const { name, unit = "", quantity = 0 } = data;
  if (!name) {
    return res.status(400).json({ error: "Missing required field: name" });
  }
  try {
    console.log('Inserting ingredient:', { name: name.trim(), unit, quantity });
    const result = await knex("ingredients").insert(
      { name: name.trim(), unit, quantity },
      ['id'] // Explicitly return id
    );
    console.log('Insert result:', result);
    const newId = Array.isArray(result) ? result[0].id : result.id;
    const newItem = await knex("ingredients").where({ id: newId }).first();
    if (!newItem) {
      return res.status(404).json({ error: "Ingredient not found after creation" });
    }
    return res.status(201).json({ data: newItem });
  } catch (error) {
    console.error('Error creating ingredient:', error);
    return res.status(500).json({ error: error.message || 'Failed to create ingredient' });
  }
}

// PUT /ingredients/:id - Update an existing ingredient
async function update(req, res, next) {
  const { id } = req.params;
  const { data = {} } = req.body;
  const { name, unit, quantity } = data;
  if (!name) {
    return res.status(400).json({ error: "Missing required field: name" });
  }
  try {
    const existing = await knex("ingredients").where({ id }).first();
    if (!existing) {
      return res.status(404).json({ error: "Ingredient not found" });
    }
    const updatedData = {
      name: name.trim(),
      unit: unit !== undefined ? unit : existing.unit,
      quantity: quantity !== undefined ? quantity : existing.quantity,
    };
    await knex("ingredients").where({ id }).update(updatedData);
    const updated = await knex("ingredients").where({ id }).first();
    return res.status(201).json({ data: updated });
  } catch (error) {
    next(error);
  }
}

// DELETE /ingredients/:id - Remove an ingredient
async function destroy(req, res, next) {
  const { id } = req.params;
  try {
    const existing = await knex("ingredients").where({ id }).first();
    if (!existing) {
      return res.status(404).json({ error: "Ingredient not found" });
    }
    await knex("ingredients").where({ id }).del();
    return res.status(200).json({ data: existing });
  } catch (error) {
    next(error);
  }
}

// GET /ingredients/:id/recipes - List recipes that use an ingredient
async function listRecipes(req, res, next) {
  const { id } = req.params;
  try {
    const recipes = await knex("recipe_ingredients as ri")
      .join("recipes as r", "ri.recipe_id", "r.id")
      .select("r.id", "r.title")
      .where("ri.ingredient_id", id);
    return res.status(200).json({ data: recipes });
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
  listRecipes,
};