
exports.up = function(knex, Promise) {
  return knex.schema
    .createTable('trips', tbl => {
      tbl.increments()
        .primary();
    
      tbl
        .integer('primary_member_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('users')
        .onDelete('CASCADE')
        .onUpdate('CASCADE');
      
      tbl
        .integer('ride_fare')
        .unsigned()
        .notNullable();

      tbl
        .text('riders')
        .notNullable()

      tbl
        .timestamp('createdAt')
        .defaultTo(knex.fn.now());
  })
};

exports.down = function(knex, Promise) {
  return knex.schema
    .dropTableIfExists('trips')
};
