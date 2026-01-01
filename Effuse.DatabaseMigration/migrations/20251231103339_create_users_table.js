/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema
    .createTable("users", (t) => {
      t.uuid("id").primary();
      t.string("username").notNullable().unique();
      t.string("email").notNullable().unique();
      t.string("hashed_password").notNullable();
      t.datetime("created_on").notNullable();
      t.datetime("updated_on").notNullable();
    })
    .createTable("users_staging", (t) => {
      t.uuid("id").primary();
      t.string("email").notNullable().unique();
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable("users").dropTable("staged_users");
};
