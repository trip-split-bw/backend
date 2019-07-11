
exports.up = function(knex, Promise) {
  return knex.schema.createTable('users', tbl => {
    tbl.increments();
    tbl
      .string('name')
      .notNullable();
    tbl
      .integer('phone_number')
      .notNullable();
    tbl
      .string('password')
      .notNullable();
    tbl
      .string('money_app_link')
      .unique('uq_app_link');
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('users');
};
