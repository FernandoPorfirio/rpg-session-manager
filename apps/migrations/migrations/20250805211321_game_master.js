exports.up = function(knex) {
  return knex.schema.createTable('game_master', function(table) {
    table.increments('id').primary('pk_game_master');
    table.string('name').notNullable();
    table.string('email').notNullable().unique();
    table.string('password').notNullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());
  });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('game_master');
};




