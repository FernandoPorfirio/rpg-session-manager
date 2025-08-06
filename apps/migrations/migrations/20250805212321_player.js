exports.up = function(knex) {
  return knex.schema.createTable('player', function(table) {
    table.increments('id').primary('pk_player');
    table.string('name').notNullable();
    table.integer('class_id').unsigned().notNullable();
    table.foreign('class_id').references('id').inTable('class');
    table.integer('level').defaultTo(0).notNullable();
    table.text('lore');
    table.integer('game_master_id').unsigned().notNullable();
    table.foreign('game_master_id').references('id').inTable('game_master');
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').nullable();
  });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('player');
};






