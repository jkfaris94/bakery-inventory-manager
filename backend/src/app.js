const path = require("path");

require("dotenv").config({ path: path.join(__dirname, "..", ".env") });

const express = require("express");
const cors = require("cors");

const errorHandler = require("./errors/errorHandler");
const notFound = require("./errors/notFound");

//import routers
const ingredientsRouter = require("./ingredients/ingredients.router");
const bakedGoodsRouter = require("./baked_goods/baked_goods.router");

const app = express();

if (process.env.LOG_LEVEL === "info") {
  app.use(require("morgan")("dev"));
}

app.use(cors());
app.use(express.json());

// Add in your routers here.
app.use("/ingredients", ingredientsRouter);
app.use("/baked_goods", bakedGoodsRouter);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
