const knex = require("../db/connection");

// GET /recipes/:id/ingredients - List all ingredients for a recipe
async function list(req, res, next) {
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
    next(error);
  }
}

// POST /recipes/:id/ingredients - Add ingredient to recipe
async function create(req, res, next) {
  const { id: recipe_id } = req.params;
  const { ingredient_id, name, quantity_needed, unit } = req.body;

  // Ensure required fields
  if ((!ingredient_id && !name) || !quantity_needed || !unit) {
    return res.status(400).json({
      error: "Missing fields: must include ingredient_id OR name, plus quantity_needed and unit",
    });
  }

  try {
    // Validate recipe exists
    const recipe = await knex("recipes").where({ id: recipe_id }).first();
    if (!recipe) return res.status(404).json({ error: "Recipe not found" });
    
    // Update existing ingredient if ingredient already exists
    let ri;
    if (ingredient_id) {
      // Check if this ingredient is already on the recipe
      ri = await knex("recipe_ingredients")
        .where({ recipe_id, ingredient_id })
        .first();

      if (ri) {
        // Update existing row: increment quantity_needed
        const [updated] = await knex("recipe_ingredients")
          .where({ id: ri.id })
          .increment("quantity_needed", quantity_needed)
          .returning("*");
        return res.status(200).json({ data: updated });
      }
    }

    // Prepare insert object
    const insertData = {
      recipe_id,
      quantity_needed,
      unit,
    };

    if (ingredient_id) {
      insertData.ingredient_id = ingredient_id;
    } else {
      insertData.name = name;
    }

    const [newEntry] = await knex("recipe_ingredients")
      .insert(insertData)
      .returning("*");

    res.status(201).json(newEntry);
  } catch (error) {
    next(error);
  }
}

// DELETE /recipes/:id/ingredients/:ingredientId - Remove ingredient from recipe
async function destroy(req, res, next) {
  const { id: recipe_id, ingredientId: ingredient_id } = req.params;

  try {
    const deleted = await knex("recipe_ingredients")
      .where({ recipe_id, ingredient_id })
      .del();

    if (!deleted) {
      return res.status(404).json({ error: "Ingredient not found in recipe" });
    }

    res.status(204).end();
  } catch (error) {
    next(error);
  }
}

module.exports = {
  list,
  create,
  delete: destroy,
};
