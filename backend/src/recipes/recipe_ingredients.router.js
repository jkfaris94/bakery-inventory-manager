const express = require("express");
const controller = require("./recipe_ingredients.controller");
// mergeParams so we can access :id from the parent route (/recipes/:id/ingredients)
const router = express.Router({ mergeParams: true });

router
  .get("/", controller.list)
  .post("/", controller.create)
  .delete("/:ingredientId", controller.delete);

module.exports = router;