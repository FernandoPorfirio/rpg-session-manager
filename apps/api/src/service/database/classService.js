const db = require("./db");

const getAll = async () => {
  const result = await db("class")
    .select("id", "name")
    .orderBy("name", "asc");

  return result;
};

const getById = async (id) => {
  const result = await db("class")
    .select("id", "name")
    .where({ id })
    .first();

  return result;
};

module.exports = {
  getAll,
  getById,
};
