exports.up = function(knex) {
  return knex.schema.createTable('session_player_confirmation', function(table) {
    table.increments('id').primary('pk_session_player_confirmation');
    table.integer('session_id').unsigned().notNullable();
    table.foreign('session_id').references('id').inTable('session');
    table.integer('player_id').unsigned().notNullable();
    table.foreign('player_id').references('id').inTable('player');
    table.integer('game_master_id').unsigned().notNullable();
    table.foreign('game_master_id').references('id').inTable('game_master');
    table.boolean('is_deleted').defaultTo(false).notNullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').nullable();

    table.unique(['session_id', 'player_id', 'game_master_id'], 'unique_session_player_confirmation');
  });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('session_player_confirmation');
};
