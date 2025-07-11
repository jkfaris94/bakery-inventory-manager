const knex = require("../db/connection");

// GET /recipes - List all recipes
async function list(req, res, next) {
  try {
    const data = await knex("recipes").select("*");
    res.status(200).json({ data });
  } catch (error) {
    next(error);
  }
}

// GET /recipes/:id - Get a recipe by ID
async function read(req, res, next) {
  try {
    const recipe = await knex("recipes")
      .where({ id: req.params.id })
      .first();
    if (!recipe) {
      return res.status(404).json({ error: "Recipe not found" });
    }
    res.status(200).json({ data: recipe });
  } catch (error) {
    next(error);
  }
}

// POST /recipes - Create a new recipe
async function create(req, res, next) {
  // Pull payload 
  const incoming = req.body.data || req.body;
  const { title, image_url, description, } = incoming;

  if (!title) {
    return next({ status: 400, message: "Recipe must include a title" });
  }
  if (!image_url) {
    return next({ status: 400, message: "Recipe must include an image_url" });
  }
  if (!description) {
    return next({ status: 400, message: "Recipe must include a description" });
  }

  try {
    const newRecipe = await knex.transaction(async (trx) => {
      //  Insert recipe
      const [recipeId] = await trx("recipes").insert({ title, image_url, description });

      // auto-create its baked_good at quantity = 0
      await trx("baked_goods").insert({
        recipe_id: recipeId,
        name:      title,
        quantity:  0,
      });

      //  Return the full recipe row
      return await trx("recipes").where({ id: recipeId }).first();
    });

    res.status(201).json({ data: newRecipe });
  } catch (error) {
    next(error);
  }
}

// DELETE /recipes/:id - Remove a recipe
async function destroy(req, res, next) {
  try {
    const recipe = await knex("recipes")
      .where({ id: req.params.id })
      .first();
    if (!recipe) {
      return res.status(404).json({ error: "Recipe not found" });
    }
    await knex("recipes").where({ id: req.params.id }).del();
    res.status(200).json({ data: recipe });
  } catch (error) {
    next(error);
  }
}

// POST /recipes/:id/bake - Bake a recipe
async function bake(req, res, next) {
  const recipe_id = req.params.id;
  try {
    // Fetch recipe to ensure it exists
    const recipe = await knex("recipes").where({ id: recipe_id }).first();
    if (!recipe) {
      return res.status(404).json({ error: "Recipe not found" });
    }

    // Get needed ingredients with their availability
    const neededIngredients = await knex("recipe_ingredients as ri")
      .join("ingredients as i", "ri.ingredient_id", "i.id")
      .where("ri.recipe_id", recipe_id)
      .select(
        "i.id as ingredient_id",
        "i.name",
        "i.quantity as available",
        "ri.quantity_needed"
      );

    // Check if any are insufficient
    const insufficient = neededIngredients.filter(
      (i) => i.available < i.quantity_needed
    );
    if (insufficient.length) {
      return res.status(400).json({
        error: "Insufficient ingredients",
        missing: insufficient.map((i) => ({
          name: i.name,
          available: i.available,
          needed: i.quantity_needed,
        })),
      });
    }

    // Perform the bake: decrement stocks and increment baked_goods qty
    const updatedGood = await knex.transaction(async (trx) => {
      // Decrement each ingredient's quantity
      for (const ing of neededIngredients) {
        await trx("ingredients")
          .where({ id: ing.ingredient_id })
          .decrement("quantity", ing.quantity_needed);
      }
      // Increment the baked_goods record identified by recipe_id
      await trx("baked_goods")
        .where({ recipe_id })
        .increment("quantity", 1);
      // Return the updated baked_good
      return trx("baked_goods").where({ recipe_id }).first();
    });

    res.status(200).json({ data: updatedGood });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  list,
  read,
  create,
  delete: destroy,
  bake,
};
