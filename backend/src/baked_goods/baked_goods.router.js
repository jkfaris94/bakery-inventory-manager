const express = require("express");
const controller = require("./baked_goods.controller");
const methodNotAllowed = require("../errors/methodNotAllowed");

const router = express.Router();

// /baked_goods
router
  .route("/")
  .get(controller.list)
  .post(controller.create)
  .all(methodNotAllowed);

// /baked_goods/:id
router
  .route("/:id")
  .get(controller.read)
  .put(controller.update)
  .all(methodNotAllowed);

module.exports = router;