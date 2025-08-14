exports.seed = async function(knex) {
  await knex('session_status').del();
  
  return knex('session_status').insert([
    { id: 1, name: 'planejamento', description: 'Session em fase de planejamento' },
    { id: 2, name: 'iniciada', description: 'Session em andamento' },
    { id: 3, name: 'finalizada', description: 'Session finalizada' },
    { id: 4, name: 'inativo', description: 'Session inativa' }
  ]);
};
