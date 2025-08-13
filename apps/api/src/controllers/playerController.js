const playerUseCase = require("@useCase/playerUseCase");

const create = async (req, res) => {
  const { name, classId, level, lore } = req.body;
  const { id: gameMasterId } = req.gameMaster;

  const player = await playerUseCase.create({
    name,
    classId,
    level,
    lore,
    gameMasterId
  });

  res.status(201).json(player);
};

const update = async (req, res) => {
  const { id } = req.params;
  const { name, classId, level, lore } = req.body;

  const player = await playerUseCase.update({
    id,
    name,
    classId,
    level,
    lore
  });

  res.status(200).json(player);
};

const getById = async (req, res) => {
  const { id } = req.params;
  const player = await playerUseCase.getById({ id });
  res.status(200).json(player);
};

const getByGameMasterIdWithFilters = async (req, res) => {
  const { id: gameMasterId } = req.gameMaster;
  const { sessionId, guildId, name, page = 1, limit = 10 } = req.query;

  const result = await playerUseCase.getByGameMasterIdWithFilters({
    gameMasterId,
    sessionId: sessionId ? parseInt(sessionId) : null,
    guildId: guildId ? parseInt(guildId) : null,
    name,
    page: parseInt(page),
    limit: parseInt(limit)
  });

  res.status(200).json(result);
};

const deletePlayer = async (req, res) => {
  const { id } = req.params;
  await playerUseCase.deletePlayer({ id });
  res.status(204).send();
};

module.exports = {
  create,
  update,
  getById,
  getByGameMasterIdWithFilters,
  deletePlayer
};
