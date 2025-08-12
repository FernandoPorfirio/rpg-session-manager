const AppError = require("@errors/AppError");
const guildService = require("@service/database/guildService");

const create = async ({ name, sessionId, lore, gameMasterId }) => {
  return await guildService.create({
    name,
    sessionId,
    lore,
    gameMasterId
  });
};

const update = async ({ id, name, lore }) => {
  const currentGuild = await guildService.getById(id);

  if (!currentGuild) {
    throw new AppError("Guild não encontrada!", 404);
  }

  return await guildService.update({
    id,
    name,
    lore
  });
};

const getById = async ({ id }) => {
  const guild = await guildService.getById(id);

  if (!guild) {
    throw new AppError("Guild não encontrada!", 404);
  }

  return guild;
};

const getByGameMasterId = async ({ gameMasterId }) => {
  return await guildService.getByGameMasterId(gameMasterId);
};

const deleteGuild = async ({ id }) => {
  const guild = await guildService.getById(id);

  if (!guild) {
    throw new AppError("Guild não encontrada!", 404);
  }

  return await guildService.softDelete(id);
};

module.exports = {
  create,
  update,
  getById,
  getByGameMasterId,
  deleteGuild
};
