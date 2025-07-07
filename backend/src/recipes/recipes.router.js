const express = require("express");
const router = express.Router();
const controller = require("./recipes.controller");
const recipeIngredientsRouter = require("./recipe_ingredients.router");

router
  .route("/")
  .get(controller.list)
  .post(controller.create)

router
  .route("/:id")
  .get(controller.read)
  .delete(controller.delete)

// POST /recipes/:id/bake
router.post("/:id/bake", controller.bake);

// Mount nested router for /recipes/:id/ingredients
router.use("/:id/ingredients", recipeIngredientsRouter);

module.exports = router;
