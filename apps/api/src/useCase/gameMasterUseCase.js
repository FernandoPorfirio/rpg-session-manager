const AppError = require('@errors/AppError');
const gameMasterService = require("@service/database/gameMasterService");

const create = async ({ name, email, password }) => {
  const databaseGameMaster = await gameMasterService.getByEmail(email);

  console.log('databaseGameMaster',databaseGameMaster);

  if (databaseGameMaster) {
    throw new AppError('Email já cadastrado!', 400);
  }

  return await gameMasterService.create({ name, email, password });
};

module.exports = {
  create,
};
