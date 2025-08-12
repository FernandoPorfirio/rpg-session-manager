const guildMemberUseCase = require("@useCase/guildMemberUseCase");

const create = async (req, res) => {
  const { guildId, playerId } = req.body;
  const { id: gameMasterId } = req.gameMaster;

  const guildMember = await guildMemberUseCase.create({
    guildId,
    playerId,
    gameMasterId
  });

  res.status(201).json(guildMember);
};

const getById = async (req, res) => {
  const { id } = req.params;
  const guildMember = await guildMemberUseCase.getById({ id });
  res.status(200).json(guildMember);
};

const getByGameMasterIdWithFilters = async (req, res) => {
  const { id: gameMasterId } = req.gameMaster;
  const { guildId, sessionId } = req.query;

  const guildMembers = await guildMemberUseCase.getByGameMasterIdWithFilters({ 
    gameMasterId,
    guildId: guildId ? parseInt(guildId) : undefined,
    sessionId: sessionId ? parseInt(sessionId) : undefined
  });

  res.status(200).json(guildMembers);
};

const deleteGuildMember = async (req, res) => {
  const { id } = req.params;
  await guildMemberUseCase.deleteGuildMember({ id });
  res.status(204).send();
};

module.exports = {
  create,
  getById,
  getByGameMasterIdWithFilters,
  deleteGuildMember
};
