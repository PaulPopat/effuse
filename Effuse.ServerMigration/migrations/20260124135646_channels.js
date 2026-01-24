/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable("channels", (t) => {
    t.uuid("id").primary();
    t.string("name").notNullable().unique();
    t.datetime("created_on").notNullable();
    t.enum("type", ["voice", "message"]).notNullable();
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable("channels");
};
