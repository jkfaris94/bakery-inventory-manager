const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "..", ".env") });

const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const errorHandler = require("./errors/errorHandler");
const notFound = require("./errors/notFound");

//import routers
const ingredientsRouter = require("./ingredients/ingredients.router");
const bakedGoodsRouter = require("./baked_goods/baked_goods.router");
const recipesRouter = require("./recipes/recipes.router");

const app = express();

//logging 
if (process.env.LOG_LEVEL === "info") {
  app.use(morgan("dev"));
}

// CORS + JSON parsing
app.use(cors());
app.use(express.json());

// mount API routers
app.use("/ingredients", ingredientsRouter);
app.use("/baked_goods", bakedGoodsRouter);
app.use("/recipes", recipesRouter);

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

// Serve  built React app (in production)
const buildPath = path.join(__dirname, "../../frontend/build");
app.use(express.static(buildPath));

// Catch-all for SPA client-side routing on GET requests
app.get("*", (req, res, next) => {
  const prefix = req.path.split("/")[1];
  if (["ingredients", "recipes", "baked_goods", "health"].includes(prefix)) {
    return next();
  }
  res.sendFile(path.join(buildPath, "index.html"));
});

// catch-all 404 handler
app.use(notFound);
// error handler (returns JSON { error: … })
app.use(errorHandler);


module.exports = app;