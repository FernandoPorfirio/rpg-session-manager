const AppError = require("@errors/AppError");
const sessionService = require("@service/database/sessionService");

const create = async ({ name, maxLevel, gameMasterId, lore }) => {
  return await sessionService.create({
    name,
    maxLevel,
    gameMasterId,
    lore,
    sessionStatusId: 1,
  });
};

const update = async ({
  id,
  name,
  maxLevel,
  sessionStatusId,
  lore,
  gameMasterId,
}) => {
  const currentSession = await sessionService.getById(id, gameMasterId);

  if (!currentSession) {
    throw new AppError("Session não encontrada!", 404);
  }

  let startedAt;
  let finishedAt;

  if (sessionStatusId !== undefined) {
    if (sessionStatusId === 2 && currentSession.session_status_id !== 2) {
      startedAt = new Date();
    }

    if (sessionStatusId === 3 && currentSession.session_status_id !== 3) {
      finishedAt = new Date();
    }
  }

  return await sessionService.update({
    id,
    name,
    maxLevel,
    sessionStatusId,
    lore,
    startedAt,
    finishedAt,
    gameMasterId,
  });
};

const getById = async ({ id, gameMasterId }) => {
  const session = await sessionService.getById(id, gameMasterId);

  if (!session) {
    throw new AppError("Session não encontrada!", 404);
  }

  return session;
};

const getByGameMasterId = async ({ gameMasterId }) => {
  return await sessionService.getByGameMasterId(gameMasterId);
};

const deleteSession = async ({ id, gameMasterId }) => {
  const result = await sessionService.softDelete(id, gameMasterId);

  if (!result) {
    throw new AppError("Session não encontrada!", 404);
  }

  return result;
};

module.exports = {
  create,
  update,
  getById,
  getByGameMasterId,
  deleteSession,
};
