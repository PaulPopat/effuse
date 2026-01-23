/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema
    .createTable("user_servers", (t) => {
      t.uuid("id").primary();
      t.uuid("user_id").references("id").inTable("users").notNullable();
      t.text("server_url").notNullable();
      t.text("server_name").notNullable();
    })
    .createTable("user_profiles", (t) => {
      t.uuid("id").primary();
      t.uuid("user_id").references("id").inTable("users").notNullable();
      t.text("biography");
      t.text("icon_url");
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable("user_servers").dropTable("user_profiles");
};
