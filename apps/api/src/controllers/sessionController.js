const sessionUseCase = require("@useCase/sessionUseCase");

//TODO: Ajustar em todos os locais os nomes dos parametros para usar camelCase

const create = async (req, res) => {
  const { name, max_level, lore } = req.body;
  const { id: game_master_id } = req.gameMaster;

  const session = await sessionUseCase.create({
    name,
    max_level,
    game_master_id,
    lore
  });

  res.status(201).json(session);
};

const update = async (req, res) => {
  const { id } = req.params;
  const { name, max_level, session_status_id, lore } = req.body;

  const session = await sessionUseCase.update({
    id,
    name,
    max_level,
    session_status_id,
    lore
  });

  res.status(200).json(session);
};

const getById = async (req, res) => {
  const { id } = req.params;
  const session = await sessionUseCase.getById({ id });
  res.status(200).json(session);
};

const getByGameMasterId = async (req, res) => {
  const { gameMasterId } = req.params;
  const sessions = await sessionUseCase.getByGameMasterId({ gameMasterId });
  res.status(200).json(sessions);
};

const deleteSession = async (req, res) => {
  const { id } = req.params;
  await sessionUseCase.deleteSession({ id });
  res.status(204).send();
};

module.exports = {
  create,
  update,
  getById,
  getByGameMasterId,
  deleteSession
};
