exports.up = function(knex) {
  return knex.schema.alterTable('guild', function(table) {
    table.boolean('is_deleted').defaultTo(false).notNullable();
  });
};

exports.down = function(knex) {
  return knex.schema.alterTable('guild', function(table) {
    table.dropColumn('is_deleted');
  });
};
