const AppError = require("@errors/AppError");
const guildMemberService = require("@service/database/guildMemberService");

const create = async ({ guildId, playerId, gameMasterId }) => {
  const existingMember = await guildMemberService.getByGuildIdAndPlayerId(
    guildId,
    playerId
  );

  if (existingMember) {
    throw new AppError("Player já é membro desta guild!", 400);
  }

  return await guildMemberService.create({
    guildId,
    playerId,
    gameMasterId,
  });
};

const getById = async ({ id, gameMasterId }) => {
  const guildMember = await guildMemberService.getById(id, gameMasterId);

  if (!guildMember) {
    throw new AppError("Membro da guild não encontrado!", 404);
  }

  return guildMember;
};

const getByGameMasterIdWithFilters = async ({
  gameMasterId,
  guildId,
  sessionId,
}) => {
  return await guildMemberService.getByGameMasterIdWithFilters(gameMasterId, {
    guildId,
    sessionId,
  });
};

const deleteGuildMember = async ({ id, gameMasterId }) => {
  const result = await guildMemberService.softDelete(id, gameMasterId);

  if (!result) {
    throw new AppError("Membro da guild não encontrado!", 404);
  }

  return result;
};

module.exports = {
  create,
  getById,
  getByGameMasterIdWithFilters,
  deleteGuildMember,
};
