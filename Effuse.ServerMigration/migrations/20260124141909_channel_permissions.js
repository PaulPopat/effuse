/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.alterTable("role_permissions", (t) => {
    t.string("modification").notNullable().defaultTo("*");
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.alterTable("role_permissions", (t) => {
    t.dropColumn("modification");
  });
};
