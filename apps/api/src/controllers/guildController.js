const guildUseCase = require("@useCase/guildUseCase");

const create = async (req, res) => {
  const { name, sessionId, lore } = req.body;
  const { id: gameMasterId } = req.gameMaster;

  const guild = await guildUseCase.create({
    name,
    sessionId,
    lore,
    gameMasterId,
  });

  res.status(201).json(guild);
};

const update = async (req, res) => {
  const { id } = req.params;
  const { name, lore } = req.body;
  const { id: gameMasterId } = req.gameMaster;

  const guild = await guildUseCase.update({
    id,
    name,
    lore,
    gameMasterId,
  });

  res.status(200).json(guild);
};

const getById = async (req, res) => {
  const { id } = req.params;
  const { id: gameMasterId } = req.gameMaster;
  const guild = await guildUseCase.getById({ id, gameMasterId });
  res.status(200).json(guild);
};

const getByGameMasterId = async (req, res) => {
  const { id: gameMasterId } = req.gameMaster;
  const guilds = await guildUseCase.getByGameMasterId({ gameMasterId });
  res.status(200).json(guilds);
};

const deleteGuild = async (req, res) => {
  const { id } = req.params;
  const { id: gameMasterId } = req.gameMaster;
  await guildUseCase.deleteGuild({ id, gameMasterId });
  res.status(204).send();
};

const formGuildsAutomatically = async (req, res) => {
  const { sessionId, numberOfGuilds } = req.body;
  const { id: gameMasterId } = req.gameMaster;

  const result = await guildUseCase.formGuildsAutomatically({
    sessionId: parseInt(sessionId),
    numberOfGuilds: parseInt(numberOfGuilds),
    gameMasterId,
  });

  res.status(201).json(result);
};

const getGuildsBySessionId = async (req, res) => {
  const { sessionId } = req.params;
  const { id: gameMasterId } = req.gameMaster;

  const guilds = await guildUseCase.getGuildsBySessionId({
    sessionId: parseInt(sessionId),
    gameMasterId,
  });

  res.status(200).json(guilds);
};

module.exports = {
  create,
  update,
  getById,
  getByGameMasterId,
  deleteGuild,
  formGuildsAutomatically,
  getGuildsBySessionId,
};
