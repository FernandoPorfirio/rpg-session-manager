const classUseCase = require("@useCase/classUseCase");

const getAll = async (req, res) => {
  const classes = await classUseCase.getAll();
  res.status(200).json(classes);
};

const getById = async (req, res) => {
  const { id } = req.params;
  const classEntity = await classUseCase.getById({ id });
  res.status(200).json(classEntity);
};

module.exports = {
  getAll,
  getById
};
