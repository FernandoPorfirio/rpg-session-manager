exports.up = function(knex) {
  return knex.schema.createTable('guild_member', function(table) {
    table.increments('id').primary('pk_guild_member');
    table.integer('guild_id').unsigned().notNullable();
    table.foreign('guild_id').references('id').inTable('guild');
    table.integer('player_id').unsigned().notNullable();
    table.foreign('player_id').references('id').inTable('player');
    table.integer('game_master_id').unsigned().notNullable();
    table.foreign('game_master_id').references('id').inTable('game_master');
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').nullable();
  });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('guild_member');
};
