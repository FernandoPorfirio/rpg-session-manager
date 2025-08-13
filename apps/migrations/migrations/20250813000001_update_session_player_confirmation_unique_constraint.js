exports.up = function(knex) {
  return knex.schema.alterTable('session_player_confirmation', function(table) {
    table.dropUnique(['session_id', 'player_id', 'game_master_id'], 'unique_session_player_confirmation');
  })
  .then(() => {
    return knex.raw(`
      CREATE UNIQUE INDEX unique_session_player_confirmation_not_deleted
      ON session_player_confirmation (session_id, player_id, game_master_id)
      WHERE is_deleted = false
    `);
  });
};

exports.down = function(knex) {
  return knex.raw('DROP INDEX IF EXISTS unique_session_player_confirmation_not_deleted')
  .then(() => {
    return knex.schema.alterTable('session_player_confirmation', function(table) {
      table.unique(['session_id', 'player_id', 'game_master_id'], 'unique_session_player_confirmation');
    });
  });
};
