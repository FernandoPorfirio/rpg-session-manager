exports.up = function(knex) {
  return knex.schema.createTable('class', function(table) {
    table.increments('id').primary('pk_class');
    table.string('name').notNullable();
  });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('class');
};






