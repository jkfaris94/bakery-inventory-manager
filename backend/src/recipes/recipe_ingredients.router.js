const express = require("express");
const controller = require("./recipe_ingredients.controller");
const methodNotAllowed = require("../errors/methodNotAllowed");

// mergeParams so we can access :id from the parent route (/recipes/:id/ingredients)
const router = express.Router({ mergeParams: true });

// /recipes/:id/ingredients
router
  .route("/")
  .get(controller.list)
  .post(controller.create)
  .all(methodNotAllowed);

// /recipes/:id/ingredients/:ingredientId
router
  .route("/:ingredientId")
  .delete(controller.delete)
  .all(methodNotAllowed);

module.exports = router;