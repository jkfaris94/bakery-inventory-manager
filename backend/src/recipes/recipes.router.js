const express = require("express");
const router = express.Router();
const controller = require("./recipes.controller");
const recipeIngredientsRouter = require("./recipe_ingredients.router");
const methodNotAllowed = require("../errors/methodNotAllowed");

router
  .route("/")
  .get(controller.list)
  .post(controller.create)
  .all(methodNotAllowed);

router
  .route("/:id")
  .get(controller.read)
  .delete(controller.delete)
  .all(methodNotAllowed);

// POST /recipes/:id/bake
router
  .route("/:id/bake")
  .post(controller.bake)
  .all(methodNotAllowed);

// Mount nested router for /recipes/:id/ingredients
router.use(
  "/:id/ingredients",
  recipeIngredientsRouter
);

router.all("/*", methodNotAllowed);

module.exports = router;
