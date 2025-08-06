exports.up = function(knex) {
  return knex.schema.createTable('guild', function(table) {
    table.increments('id').primary('pk_guild');
    table.string('name').notNullable();
    table.integer('session_id').unsigned().notNullable();
    table.foreign('session_id').references('id').inTable('session');
    table.integer('game_master_id').unsigned().notNullable();
    table.foreign('game_master_id').references('id').inTable('game_master');
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').nullable();
  });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('guild');
};
