exports.up = function(knex) {
  return knex.schema.createTable('session_status', function(table) {
    table.increments('id').primary('pk_session_status');
    table.string('name').notNullable().unique();
    table.string('description').nullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());
  });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('session_status');
};
