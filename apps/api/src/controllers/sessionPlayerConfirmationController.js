const sessionPlayerConfirmationUseCase = require("@useCase/sessionPlayerConfirmationUseCase");

const create = async (req, res) => {
  const { sessionId, playerId } = req.body;
  const { id: gameMasterId } = req.gameMaster;

  const confirmation = await sessionPlayerConfirmationUseCase.create({
    sessionId,
    playerId,
    gameMasterId
  });

  res.status(201).json(confirmation);
};

const getById = async (req, res) => {
  const { id } = req.params;
  const confirmation = await sessionPlayerConfirmationUseCase.getById({ id });
  res.status(200).json(confirmation);
};

const getByGameMasterIdWithFilters = async (req, res) => {
  const { id: gameMasterId } = req.gameMaster;
  const { sessionId, playerId } = req.query;

  const confirmations = await sessionPlayerConfirmationUseCase.getByGameMasterIdWithFilters({ 
    gameMasterId,
    sessionId: sessionId ? parseInt(sessionId) : undefined,
    playerId: playerId ? parseInt(playerId) : undefined
  });

  res.status(200).json(confirmations);
};

const getConfirmedPlayersBySessionId = async (req, res) => {
  const { sessionId } = req.params;
  const { id: gameMasterId } = req.gameMaster;

  const players = await sessionPlayerConfirmationUseCase.getConfirmedPlayersBySessionId({
    sessionId: parseInt(sessionId),
    gameMasterId
  });

  res.status(200).json(players);
};

const deleteConfirmation = async (req, res) => {
  const { id } = req.params;
  const { id: gameMasterId } = req.gameMaster;

  await sessionPlayerConfirmationUseCase.deleteConfirmation({ id, gameMasterId });
  res.status(204).send();
};

module.exports = {
  create,
  getById,
  getByGameMasterIdWithFilters,
  getConfirmedPlayersBySessionId,
  deleteConfirmation
};
