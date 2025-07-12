const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "..", ".env") });

const express = require("express");
const cors = require("cors");

const errorHandler = require("./errors/errorHandler");
const notFound = require("./errors/notFound");

//import routers
const ingredientsRouter = require("./ingredients/ingredients.router");
const bakedGoodsRouter = require("./baked_goods/baked_goods.router");
const recipesRouter = require("./recipes/recipes.router");

const app = express();
//logging request
if (process.env.LOG_LEVEL === "info") {
  app.use(require("morgan")("dev"));
}

// CORS + JSON parsing
app.use(cors());
app.use(express.json());

// mount routers
app.use("/ingredients", ingredientsRouter);
app.use("/baked_goods", bakedGoodsRouter);
app.use("/recipes", recipesRouter);

// catch-all 404 handler
app.use(notFound);

// error handler (returns JSON { error: … })
app.use(errorHandler);

//health check endpoint
app.get("/", (req, res) => {
  res.json({ status: "ok" });
});

module.exports = app;
