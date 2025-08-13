const AppError = require("@errors/AppError");
const sessionPlayerConfirmationService = require("@service/database/sessionPlayerConfirmationService");
const sessionService = require("@service/database/sessionService");
const playerService = require("@service/database/playerService");

const create = async ({ sessionId, playerId, gameMasterId }) => {
  const session = await sessionService.getById(sessionId);
  if (!session || session.game_master_id !== gameMasterId) {
    throw new AppError("Sessão não encontrada!", 404);
  }

  const player = await playerService.getById(playerId);
  if (!player || player.game_master_id !== gameMasterId) {
    throw new AppError("Jogador não encontrado!", 404);
  }

  const existingConfirmation = await sessionPlayerConfirmationService.getBySessionIdAndPlayerId(sessionId, playerId);

  if (existingConfirmation) {
    throw new AppError("Jogador já está confirmado para esta sessão!", 400);
  }

  return await sessionPlayerConfirmationService.create({
    sessionId,
    playerId,
    gameMasterId
  });
};

const getById = async ({ id }) => {
  const confirmation = await sessionPlayerConfirmationService.getById(id);

  if (!confirmation) {
    throw new AppError("Confirmação não encontrada!", 404);
  }

  return confirmation;
};

const getByGameMasterIdWithFilters = async ({ gameMasterId, sessionId, playerId }) => {
  return await sessionPlayerConfirmationService.getByGameMasterIdWithFilters(gameMasterId, { sessionId, playerId });
};

const getConfirmedPlayersBySessionId = async ({ sessionId, gameMasterId }) => {
  const session = await sessionService.getById(sessionId);
  if (!session || session.game_master_id !== gameMasterId) {
    throw new AppError("Sessão não encontrada", 404);
  }

  return await sessionPlayerConfirmationService.getConfirmedPlayersBySessionId(sessionId);
};

const deleteConfirmation = async ({ id, gameMasterId }) => {
  const confirmation = await sessionPlayerConfirmationService.getById(id);

  if (!confirmation) {
    throw new AppError("Confirmação não encontrada!", 404);
  }

  if (confirmation.game_master_id !== gameMasterId) {
    throw new AppError("Confirmação não pertence a este Game Master!", 403);
  }

  return await sessionPlayerConfirmationService.softDelete(id);
};

module.exports = {
  create,
  getById,
  getByGameMasterIdWithFilters,
  getConfirmedPlayersBySessionId,
  deleteConfirmation
};
