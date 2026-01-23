/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
module.exports = {
  sqlite: {
    client: "better-sqlite3",
    connection: {
      filename: process.env.SQLITE_FILE,
    },
  },

  postgres: {
    client: "pg",
    connection: {
      host: process.env.POSTGRES_HOST,
      port: "5432",
      user: process.env.POSTGRES_USER,
      database: process.env.POSTGRES_DB,
      password: process.env.POSTGRES_PASSWORD,
    },
    searchPath: 'effuse-server'
  },
};
