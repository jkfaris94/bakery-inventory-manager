const express = require("express");
const controller = require("./ingredients.controller");
const router = express.Router();

router
  .get("/", controller.list)
  .post("/", controller.create);
router
  .get("/:id", controller.read)
  .put("/:id", controller.update)
  .delete("/:id", controller.delete);
router
  .get("/:id/recipes", controller.listRecipes);

module.exports = router;