const express = require("express");
const controller = require("./ingredients.controller");
const router = express.Router();
const methodNotAllowed = require("../errors/methodNotAllowed");

// /ingredients
router
  .route("/")
  .get(controller.list)
  .post(controller.create)
  .all(methodNotAllowed);

// /ingredients/:id
router
  .route("/:id")
  .get(controller.read)
  .put(controller.update)
  .delete(controller.delete)
  .all(methodNotAllowed);

// /ingredients/:id/recipes
router
  .route("/:id/recipes")
  .get(controller.listRecipes)
  .all(methodNotAllowed);

module.exports = router;