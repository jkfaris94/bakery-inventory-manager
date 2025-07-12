// Update with your config settings.
require("dotenv").config();

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
module.exports = {

  development: {
    client: 'sqlite3',
    connection: {
      filename: './dev.sqlite3'
    },
   useNullAsDefault: true, 
   pool: {
      afterCreate: (conn, done) => {
        // <-- enable the PRAGMA for cascades
        conn.run("PRAGMA foreign_keys = ON", done);
      },
    },
  migrations: {
    directory: "./src/db/migrations", // 
  },
  seeds: {
    directory: "./src/db/seeds",
  },
  },
  test: {
    client: "sqlite3",
    connection: {
      // added test config
      filename: ":memory:"
    },
    useNullAsDefault: true,
    migrations: {
      directory: "./src/db/migrations",
    },
    seeds: {
      directory: "./src/db/seeds",
    },
  },
  staging: {
    client: 'postgresql',
    connection: {
      database: 'my_db',
      user:     'username',
      password: 'password'
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  },

  production: {
    client: 'pg',
    connection: process.env.DATABASE_URL, 
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  }

};
