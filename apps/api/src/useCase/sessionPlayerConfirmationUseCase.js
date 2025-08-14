const AppError = require("@errors/AppError");
const sessionPlayerConfirmationService = require("@service/database/sessionPlayerConfirmationService");
const sessionService = require("@service/database/sessionService");
const playerService = require("@service/database/playerService");

const create = async ({ sessionId, playerId, gameMasterId }) => {
  const session = await sessionService.getById(sessionId, gameMasterId);
  if (!session) {
    throw new AppError("Sessão não encontrada!", 404);
  }

  const player = await playerService.getById(playerId, gameMasterId);
  if (!player) {
    throw new AppError("Jogador não encontrado!", 404);
  }

  const existingConfirmation = await sessionPlayerConfirmationService.getBySessionIdAndPlayerId(sessionId, playerId, gameMasterId);

  if (existingConfirmation) {
    throw new AppError("Jogador já está confirmado para esta sessão!", 400);
  }

  return await sessionPlayerConfirmationService.create({
    sessionId,
    playerId,
    gameMasterId
  });
};

const getById = async ({ id, gameMasterId }) => {
  const confirmation = await sessionPlayerConfirmationService.getById(id, gameMasterId);

  if (!confirmation) {
    throw new AppError("Confirmação não encontrada!", 404);
  }

  return confirmation;
};

const getByGameMasterIdWithFilters = async ({ gameMasterId, sessionId, playerId }) => {
  return await sessionPlayerConfirmationService.getByGameMasterIdWithFilters(gameMasterId, { sessionId, playerId });
};

const getConfirmedPlayersBySessionId = async ({ sessionId, gameMasterId }) => {
  const session = await sessionService.getById(sessionId, gameMasterId);
  if (!session) {
    throw new AppError("Sessão não encontrada", 404);
  }

  return await sessionPlayerConfirmationService.getConfirmedPlayersBySessionId(sessionId, gameMasterId);
};

const deleteConfirmation = async ({ id, gameMasterId }) => {
  const confirmation = await sessionPlayerConfirmationService.getById(id, gameMasterId);

  if (!confirmation) {
    throw new AppError("Confirmação não encontrada!", 404);
  }

  return await sessionPlayerConfirmationService.softDelete(id, gameMasterId);
};

module.exports = {
  create,
  getById,
  getByGameMasterIdWithFilters,
  getConfirmedPlayersBySessionId,
  deleteConfirmation
};
