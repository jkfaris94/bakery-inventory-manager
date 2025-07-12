require("dotenv").config();
const app = require("./app");
const knex = require("./db/connection");

const PORT = process.env.PORT || 5001;

async function start() {
  try {
    // 1) Run any pending migrations
    await knex.migrate.latest();
    console.log("✅ Migrations are up to date");

    // 2) Seed initial data
    await knex.seed.run();
    console.log("✅ Seeds are complete");

    // 3) Start the server
    app.listen(PORT, () => {
      console.log(`Listening on Port ${PORT}!`);
    });
  } catch (err) {
    console.error("Failed to start server:", err);
    process.exit(1);
  }
}

start();