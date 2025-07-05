const express = require("express");
const controller = require("./ingredients.controller");
const router = express.Router();

router
  .route("/")
  .get(controller.list)
  .post(controller.create);

router
  .route("/:id")
  .get(controller.read)
  .put(controller.update)
  .delete(controller.delete);

router
  .route("/:id/recipes")
  .get(controller.listRecipes);

module.exports = router;