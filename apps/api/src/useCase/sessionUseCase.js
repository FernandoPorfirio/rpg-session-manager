const AppError = require("@errors/AppError");
const sessionService = require("@service/database/sessionService");

const create = async ({ name, maxLevel, gameMasterId, lore }) => {
  return await sessionService.create({
    name,
    maxLevel,
    gameMasterId,
    lore,
    sessionStatusId: 1
  });
};

const update = async ({ id, name, maxLevel, sessionStatusId, lore }) => {
  const currentSession = await sessionService.getById(id);

  if (!currentSession) {
    throw new AppError("Session não encontrada!", 404);
  }

  let startedAt;
  let finishedAt;

  if (sessionStatusId !== undefined) {
    if (sessionStatusId === 2 && currentSession.sessionStatusId !== 2) {
      startedAt = new Date();
    }

    if (sessionStatusId === 3 && currentSession.sessionStatusId !== 3) {
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
    finishedAt
  });
};

const getById = async ({ id }) => {
  const session = await sessionService.getById(id);

  if (!session) {
    throw new AppError("Session não encontrada!", 404);
  }

  return session;
};

const getByGameMasterId = async ({ gameMasterId }) => {
  return await sessionService.getByGameMasterId(gameMasterId);
};

const deleteSession = async ({ id }) => {
  const session = await sessionService.getById(id);

  if (!session) {
    throw new AppError("Session não encontrada!", 404);
  }

  return await sessionService.softDelete(id);
};

module.exports = {
  create,
  update,
  getById,
  getByGameMasterId,
  deleteSession
};
