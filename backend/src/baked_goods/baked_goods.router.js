const express = require("express");
const controller = require("./baked_goods.controller");
const router = express.Router();

router
  .get("/", controller.list)
  .post("/", controller.create);

router
  .get("/:id", controller.read)
  .put("/:id", controller.update)
  .delete("/:id", controller.delete);

module.exports = router;
