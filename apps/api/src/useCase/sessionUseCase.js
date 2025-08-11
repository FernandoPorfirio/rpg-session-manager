const AppError = require("@errors/AppError");
const sessionService = require("@service/database/sessionService");

const create = async ({ name, max_level, game_master_id, lore }) => {
  return await sessionService.create({
    name,
    max_level,
    game_master_id,
    lore,
    session_status_id: 1
  });
};

const update = async ({ id, name, max_level, session_status_id, lore }) => {
  const currentSession = await sessionService.getById(id);

  if (!currentSession) {
    throw new AppError("Session não encontrada!", 404);
  }

  let started_at;
  let finished_at;

  if (session_status_id !== undefined) {
    if (session_status_id === 2 && currentSession.session_status_id !== 2) {
      started_at = new Date();
    }

    if (session_status_id === 3 && currentSession.session_status_id !== 3) {
      finished_at = new Date();
    }
  }

  return await sessionService.update({
    id,
    name,
    max_level,
    session_status_id,
    lore,
    started_at,
    finished_at
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
