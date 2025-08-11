exports.up = function(knex) {
  return knex.schema.alterTable('session', function(table) {
    table.integer('session_status_id').unsigned().nullable();
    table.foreign('session_status_id').references('id').inTable('session_status');
  });
};

exports.down = function(knex) {
  return knex.schema.alterTable('session', function(table) {
    table.dropForeign('session_status_id');
    table.dropColumn('session_status_id');
  });
};
