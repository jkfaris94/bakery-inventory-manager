const express = require("express");
const knex = require("./db/connection");
const { PORT = 5001 } = process.env;

const app = require("./app");

app.use(express.json());
//GET "/ingredients"
app.get("/ingredients", async (req, res) => {
  try {
    const ingredients = await knex("ingredients").select("*");
    res.json(ingredients);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch ingredients" });
  }
});

app.listen(PORT, () => {
  console.log(`Listening on Port ${PORT}!`);
});
