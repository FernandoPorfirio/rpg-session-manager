module.exports = {
  seed: async function (knex) {
    await knex('class').insert([
      { name: 'Guerreiro' },
      { name: 'Mago' },
      { name: 'Arqueiro ' },
      { name: 'Clérigo ' },
    ]);
  },
};
