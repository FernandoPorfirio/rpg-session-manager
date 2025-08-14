const AppError = require("@errors/AppError");
const playerService = require("@service/database/playerService");

const create = async ({ name, classId, level, lore, gameMasterId }) => {
  return await playerService.create({
    name,
    classId,
    level,
    lore,
    gameMasterId,
  });
};

const update = async ({ id, name, classId, level, lore, gameMasterId }) => {
  const player = await playerService.update({
    id,
    name,
    classId,
    level,
    lore,
    gameMasterId,
  });

  if (!player) {
    throw new AppError("Player não encontrado!", 404);
  }

  return player;
};

const getById = async ({ id, gameMasterId }) => {
  const player = await playerService.getById(id, gameMasterId);

  if (!player) {
    throw new AppError("Player não encontrado!", 404);
  }

  return player;
};

const getByGameMasterIdWithFilters = async ({
  gameMasterId,
  sessionId,
  guildId,
  name,
  page,
  limit,
}) => {
  return await playerService.getByGameMasterIdWithFilters(gameMasterId, {
    sessionId,
    guildId,
    name,
    page,
    limit,
  });
};

const deletePlayer = async ({ id, gameMasterId }) => {
  const result = await playerService.softDelete(id, gameMasterId);

  if (!result) {
    throw new AppError("Player não encontrado!", 404);
  }

  return result;
};

module.exports = {
  create,
  update,
  getById,
  getByGameMasterIdWithFilters,
  deletePlayer,
};
