const AppError = require("@errors/AppError");
const playerService = require("@service/database/playerService");

const create = async ({ name, classId, level, lore, gameMasterId }) => {
  return await playerService.create({
    name,
    classId,
    level,
    lore,
    gameMasterId
  });
};

const update = async ({ id, name, classId, level, lore }) => {
  const currentPlayer = await playerService.getById(id);

  if (!currentPlayer) {
    throw new AppError("Player não encontrado!", 404);
  }

  return await playerService.update({
    id,
    name,
    classId,
    level,
    lore
  });
};

const getById = async ({ id }) => {
  const player = await playerService.getById(id);

  if (!player) {
    throw new AppError("Player não encontrado!", 404);
  }

  return player;
};

const getByGameMasterIdWithFilters = async ({ gameMasterId, sessionId, guildId, name, page, limit }) => {
  return await playerService.getByGameMasterIdWithFilters(gameMasterId, { sessionId, guildId, name, page, limit });
};

const deletePlayer = async ({ id }) => {
  const player = await playerService.getById(id);

  if (!player) {
    throw new AppError("Player não encontrado!", 404);
  }

  return await playerService.softDelete(id);
};

module.exports = {
  create,
  update,
  getById,
  getByGameMasterIdWithFilters,
  deletePlayer
};
