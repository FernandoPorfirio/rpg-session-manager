const AppError = require("@errors/AppError");
const classService = require("@service/database/classService");

const getAll = async () => {
  return await classService.getAll();
};

const getById = async ({ id }) => {
  const classEntity = await classService.getById(id);

  if (!classEntity) {
    throw new AppError("Classe não encontrada!", 404);
  }

  return classEntity;
};

module.exports = {
  getAll,
  getById
};
