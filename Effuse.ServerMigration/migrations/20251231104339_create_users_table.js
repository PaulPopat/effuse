/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema
    .createTable("roles", (t) => {
      t.uuid("id").primary();
      t.string("name").notNullable().unique();
      t.datetime("created_on").notNullable();
    })
    .createTable("users", (t) => {
      t.uuid("id").primary();
      t.datetime("created_on").notNullable();
      t.uuid("role").references("id").inTable("roles").notNullable();
    })
    .createTable("role_permissions", (t) => {
      t.increments("id");
      t.uuid("role").references("id").inTable("roles").notNullable();
      t.string("action").notNullable();
      t.string("resource").notNullable();
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema
    .dropTable("role_permissions")
    .dropTable("users")
    .dropTable("roles");
};
