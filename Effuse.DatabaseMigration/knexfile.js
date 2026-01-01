/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
module.exports = {
  sqlite: {
    client: "better-sqlite3",
    connection: {
      filename: "/appdata/database.sqlite",
    },
  },
};
