const guildUseCase = require("@useCase/guildUseCase");

const create = async (req, res) => {
  const { name, sessionId, lore } = req.body;
  const { id: gameMasterId } = req.gameMaster;

  const guild = await guildUseCase.create({
    name,
    sessionId,
    lore,
    gameMasterId
  });

  res.status(201).json(guild);
};

const update = async (req, res) => {
  const { id } = req.params;
  const { name, lore } = req.body;

  const guild = await guildUseCase.update({
    id,
    name,
    lore
  });

  res.status(200).json(guild);
};

const getById = async (req, res) => {
  const { id } = req.params;
  const guild = await guildUseCase.getById({ id });
  res.status(200).json(guild);
};

const getByGameMasterId = async (req, res) => {
  const { id: gameMasterId } = req.gameMaster;
  const guilds = await guildUseCase.getByGameMasterId({ gameMasterId });
  res.status(200).json(guilds);
};

const deleteGuild = async (req, res) => {
  const { id } = req.params;
  await guildUseCase.deleteGuild({ id });
  res.status(204).send();
};

module.exports = {
  create,
  update,
  getById,
  getByGameMasterId,
  deleteGuild
};
