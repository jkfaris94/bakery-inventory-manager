const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "..", ".env") });

const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const errorHandler = require("./errors/errorHandler");
const notFound    = require("./errors/notFound");

// import routers
const ingredientsRouter = require("./ingredients/ingredients.router");
const bakedGoodsRouter  = require("./baked_goods/baked_goods.router");
const recipesRouter     = require("./recipes/recipes.router");

const app = express();

// logging 
if (process.env.LOG_LEVEL === "info") {
  app.use(morgan("dev"));
}

// CORS + JSON parsing
app.use(cors());
app.use(express.json());

// 1) Build an “api” router and mount all your endpoints onto it:
const api = express.Router();
api.get("/health", (req, res) => res.json({ status: "ok" }));
api.use("/ingredients", ingredientsRouter);
api.use("/baked_goods",  bakedGoodsRouter);
api.use("/recipes",     recipesRouter);

// 2) Mount the API under /api
app.use("/api", api);

// 3) Serve your React build
const buildPath = path.join(__dirname, "../../frontend/build");
app.use(express.static(buildPath));

// 4) Any GET that isn’t /api/* should return index.html so React Router can handle it
app.get("/*", (req, res) => {
  res.sendFile(path.join(buildPath, "index.html"));
});

// 5) Finally, real 404 + error handlers
app.use(notFound);
app.use(errorHandler);

module.exports = app;
