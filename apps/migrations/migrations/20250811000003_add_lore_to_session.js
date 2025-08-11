exports.up = function(knex) {
  return knex.schema.alterTable('session', function(table) {
    table.text('lore').nullable();
  });
};

exports.down = function(knex) {
  return knex.schema.alterTable('session', function(table) {
    table.dropColumn('lore');
  });
};
