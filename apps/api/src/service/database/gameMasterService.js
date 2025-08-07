const db = require("./db");

const create = async ({ name, email, password }) => {
  const result = await db("game_master")
    .insert({ name, email, password })
    .returning(["name", "email"]);

  return result[0];
};

const getByEmail = async (email) => {
  const result = await db('game_master')
    .select('id', 'name', 'email')
    .where({ email })
    .first();

  return result;
};

module.exports = {
  create,
  getByEmail
};
