
exports.up = function(knex, Promise) {
  return knex.schema
    .createTable('riders', tbl => {
      tbl.increments()

      tbl
        .string('name')
        .notNullable()

      tbl
        .integer('trip_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('trips')
        .onDelete('CASCADE')
        .onUpdate('CASCADE');

      tbl
        .integer('phone_number', 11)
        .unsigned()
        .notNullable();

      tbl
        .integer('money_owed')
        .unsigned()
        .notNullable()
      
      tbl
        .boolean('paid')
        .defaultTo(false)

      tbl
        .timestamp('createdAt')
        .defaultTo(knex.fn.now());
    })
};

exports.down = function(knex, Promise) {
  return knex.schema
    .dropTableIfExists('riders')
};
