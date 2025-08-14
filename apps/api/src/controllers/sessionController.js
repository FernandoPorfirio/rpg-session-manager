const sessionUseCase = require("@useCase/sessionUseCase");

const create = async (req, res) => {
  const { name, maxLevel, lore } = req.body;
  const { id: gameMasterId } = req.gameMaster;

  const session = await sessionUseCase.create({
    name,
    maxLevel,
    gameMasterId,
    lore,
  });

  res.status(201).json(session);
};

const update = async (req, res) => {
  const { id } = req.params;
  const { name, maxLevel, sessionStatusId, lore } = req.body;
  const { id: gameMasterId } = req.gameMaster;

  const session = await sessionUseCase.update({
    id,
    name,
    maxLevel,
    sessionStatusId,
    lore,
    gameMasterId,
  });

  res.status(200).json(session);
};

const getById = async (req, res) => {
  const { id } = req.params;
  const { id: gameMasterId } = req.gameMaster;
  const session = await sessionUseCase.getById({ id, gameMasterId });
  res.status(200).json(session);
};

const getByGameMasterId = async (req, res) => {
  const { id: gameMasterId } = req.gameMaster;
  const sessions = await sessionUseCase.getByGameMasterId({ gameMasterId });
  res.status(200).json(sessions);
};

const deleteSession = async (req, res) => {
  const { id } = req.params;
  const { id: gameMasterId } = req.gameMaster;
  await sessionUseCase.deleteSession({ id, gameMasterId });
  res.status(204).send();
};

module.exports = {
  create,
  update,
  getById,
  getByGameMasterId,
  deleteSession,
};
