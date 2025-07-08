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
  // 1) Pull payload (supporting both { data:… } and top-level for Postman)
  const incoming = req.body.data || req.body;
  const {
    title,
    image_url,
    description,
    baked_good_id: clientBgId,
  } = incoming;

  // 2) Validation: title, image_url, and description
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
    // 3) In one transaction, auto-create baked_good 
    const newRecipeId = await knex.transaction(async (trx) => {
      let bgId = clientBgId;

      if (!bgId) {
        // auto-create a baked_good row
        const [insertedBgId] = await trx("baked_goods")
          .insert({ name: title, quantity: 0 });
        bgId = insertedBgId;
      }

      // insert the recipe pointing at that baked_good
      const [insertedRecipeId] = await trx("recipes")
        .insert({
          title,
          image_url,
          description,
          baked_good_id: bgId,
        });

      return insertedRecipeId;
    });

    // 4) Fetch and return the created recipe
    const newRecipe = await knex("recipes")
      .select("id", "title", "image_url", "description", "baked_good_id")
      .where({ id: newRecipeId })
      .first();

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
  const { id: recipe_id } = req.params;
  try {
    // 1. Fetch recipe
    const recipe = await knex("recipes")
      .where({ id: recipe_id })
      .first();
    if (!recipe) {
      return res.status(404).json({ error: "Recipe not found" });
    }

    // 2. Get needed ingredients
    const neededIngredients = await knex("recipe_ingredients as ri")
      .join("ingredients as i", "ri.ingredient_id", "i.id")
      .where("ri.recipe_id", recipe_id)
      .select(
        "i.id as ingredient_id",
        "i.name",
        "i.quantity as available",
        "ri.quantity_needed"
      );

    // 3. Check sufficiency
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

    // 4. Decrement ingredients & increment baked_good
    const updatedGood = await knex.transaction(async (trx) => {
      for (const ing of neededIngredients) {
        await trx("ingredients")
          .where({ id: ing.ingredient_id })
          .decrement("quantity", ing.quantity_needed);
      }

      await trx("baked_goods")
        .where({ id: recipe.baked_good_id })
        .increment("quantity", 1);

      return trx("baked_goods")
        .where({ id: recipe.baked_good_id })
        .first();
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
