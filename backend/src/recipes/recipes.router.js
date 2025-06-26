const express = require("express");
const controller = require("./recipes.controller");
const recipeIngredientsRouter = require("./recipe_ingredients.router");
const router = express.Router();

router
  .get("/", controller.list)
  .post("/", controller.create);

router
  .get("/:id", controller.read)
  .delete("/:id", controller.delete);

// POST /recipes/:id/bake
router.post("/:id/bake", controller.bake);

// Mount nested router for /recipes/:id/ingredients
router.use("/:id/ingredients", recipeIngredientsRouter);

module.exports = router;
