const gameMasterUseCase = require("@useCase/gameMasterUseCase");

const create = async (req, res) => {
  const { name, email, password } = req.body;
  const gameMaster = await gameMasterUseCase.create({ name, email, password });
  res.status(201).json(gameMaster);
};

const login = async (req, res) => {
  const { email, password } = req.body;
  const token = await gameMasterUseCase.getToken({ email, password });
  return res.json({ token });
};

const getById = async (req, res) => {
  const { id } = req.params;
  const gameMaster = await gameMasterUseCase.getById({ id });
  res.status(200).json(gameMaster);
};

module.exports = {
  create,
  login,
  getById,
};
