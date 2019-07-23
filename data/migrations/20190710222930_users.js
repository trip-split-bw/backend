
exports.up = function(knex, Promise) {
  return knex.schema
    .createTable('users', tbl => {
      tbl
        .increments()
        .primary();

      tbl
        .string('name')
        .notNullable();

      tbl
        .integer('phone_number', 11)
        .notNullable()
        .unique()

      tbl
        .string('password')
        .notNullable();

      tbl
        .string('money_app_link')
        .unique('uq_app_link');

      tbl
        .timestamp('createdAt')
        .defaultTo(knex.fn.now());
    })
};

exports.down = function(knex, Promise) {
  return knex.schema
    .dropTableIfExists('users');
};
