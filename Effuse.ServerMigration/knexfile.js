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
      host: process.env.EFFUSE_POSTGRES_HOST,
      port: "5432",
      user: process.env.EFFUSE_POSTGRES_USER,
      database: process.env.EFFUSE_POSTGRES_DB,
      password: process.env.EFFUSE_POSTGRES_PASSWORD,
    },
  },
};
