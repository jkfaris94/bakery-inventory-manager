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

// CORS + JSON 
app.use(cors());
app.use(express.json());

// mount API routers
app.use("/ingredients", ingredientsRouter);
app.use("/baked_goods", bakedGoodsRouter);
app.use("/recipes", recipesRouter);
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

// Serve  built React app (in production)
const buildPath = path.join(__dirname, "../../frontend/build");
app.use(express.static(buildPath));

// Catch-all for SPA client-side routing on GET requests
app.get("/*", (req, res, next) => {
  // only for GET requests…
  if (req.method !== "GET") return next();

  // …that the client expects HTML…
  if (!req.headers.accept || !req.headers.accept.includes("text/html")) {
    return next();
  }

  // …and whose path prefix isn’t one of your API mounts:
  const prefix = req.path.split("/")[1];
  const apiPrefixes = ["ingredients", "baked_goods", "recipes", "health"];
  if (apiPrefixes.includes(prefix)) {
    return next();
  }

  // Otherwise send React’s index.html
  res.sendFile(path.join(buildPath, "index.html"));
});

// catch-all 404 handler
app.use(notFound);
// error handler (returns JSON { error: … })
app.use(errorHandler);


module.exports = app;