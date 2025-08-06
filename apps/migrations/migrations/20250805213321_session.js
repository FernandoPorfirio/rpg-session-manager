exports.up = function(knex) {
  return knex.schema.createTable('session', function(table) {
    table.increments('id').primary('pk_session');
    table.string('name').notNullable();
    table.integer('game_master_id').unsigned().notNullable();
    table.foreign('game_master_id').references('id').inTable('game_master');
    table.timestamp('started_at').nullable();
    table.timestamp('finished_at').nullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').nullable();
  });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('session');
};
