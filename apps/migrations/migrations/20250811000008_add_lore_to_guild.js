exports.up = function(knex) {
  return knex.schema.alterTable('guild', function(table) {
    table.text('lore').nullable();
  });
};

exports.down = function(knex) {
  return knex.schema.alterTable('guild', function(table) {
    table.dropColumn('lore');
  });
};
