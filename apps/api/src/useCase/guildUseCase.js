const AppError = require("@errors/AppError");
const guildService = require("@service/database/guildService");
const guildMemberService = require("@service/database/guildMemberService");
const sessionPlayerConfirmationService = require("@service/database/sessionPlayerConfirmationService");
const sessionService = require("@service/database/sessionService");

const CLASS = {
  WARRIOR: 1,
  MAGE: 2,
  ARCHER: 3,
  CLERIC: 4,
};

const _getClassId = (className) => {
  switch (className) {
    case "Guerreiro":
      return CLASS.WARRIOR;
    case "Mago":
      return CLASS.MAGE;
    case "Arqueiro":
      return CLASS.ARCHER;
    case "Clérigo":
      return CLASS.CLERIC;
    default:
      return 0;
  }
};

const _groupNeedClass = (group, player) => {
  const hasWarrior = group.players.some((p) => p.classId === CLASS.WARRIOR);
  const hasCleric = group.players.some((p) => p.classId === CLASS.CLERIC);
  const hasRanged = group.players.some(
    (p) => p.classId === CLASS.MAGE || p.classId === CLASS.ARCHER
  );

  if (!hasWarrior && player.classId === CLASS.WARRIOR) {
    return true;
  }

  if (!hasCleric && player.classId === CLASS.CLERIC) {
    return true;
  }

  if (
    !hasRanged &&
    (player.classId === CLASS.MAGE || player.classId === CLASS.ARCHER)
  ) {
    return true;
  }

  return false;
};

const _initGuilds = (numberOfGuilds) => {
  const guilds = [];
  for (let i = 0; i < numberOfGuilds; i++) {
    guilds.push({
      players: [],
      totalLevel: 0,
    });
  }
  return guilds;
};

const _preparePlayersWithClassId = (confirmedPlayers) => {
  const players = [];

  for (const p of confirmedPlayers) {
    const level = Number.isFinite(Number(p.level)) ? Number(p.level) : 1;
    const classId = _getClassId(p.class_name);

    players.push({
      ...p,
      level,
      classId,
    });
  }

  players.sort((a, b) => b.level - a.level);

  return players;
};

const _distributePlayersToGuilds = (players, guilds) => {
  for (const player of players) {
    let candidatedGroup = guilds.find((g) => _groupNeedClass(g, player));

    if (!candidatedGroup) {
      candidatedGroup = guilds.reduce((prev, curr) => {
        return curr.totalLevel < prev.totalLevel ? curr : prev;
      }, guilds[0]);
    }

    candidatedGroup.players.push(player);
    candidatedGroup.totalLevel += player.level;
  }

  return guilds;
};

const _buildWarnings = (guilds) => {
  const warnings = [];
  for (let i = 0; i < guilds.length; i++) {
    const g = guilds[i];
    const faltas = [];

    const hasWarrior = g.players.some((p) => p.classId === CLASS.WARRIOR);
    const hasCleric = g.players.some((p) => p.classId === CLASS.CLERIC);
    const hasRanged = g.players.some(
      (p) => p.classId === CLASS.MAGE || p.classId === CLASS.ARCHER
    );

    if (!hasCleric) faltas.push("sem Clérigo");
    if (!hasWarrior) faltas.push("sem Guerreiro");
    if (!hasRanged) faltas.push("sem atacante à distância");
    if (faltas.length) warnings.push(`Guilda ${i + 1}: ${faltas.join(", ")}`);
  }
  return warnings;
};

const _createGuildsInDatabase = async (
  balancedGuilds,
  sessionId,
  gameMasterId
) => {
  const createdGuilds = [];

  for (let i = 0; i < balancedGuilds.length; i++) {
    const guildData = balancedGuilds[i];
    const guildName = `Guilda ${i + 1}`;

    const guild = await guildService.create({
      name: guildName,
      sessionId,
      lore: `Guilda formada automaticamente com ${guildData.players.length} membros (XP total: ${guildData.totalLevel})`,
      gameMasterId,
    });

    for (const member of guildData.players) {
      await guildMemberService.create({
        guildId: guild.id,
        playerId: member.id,
        gameMasterId,
      });
    }

    createdGuilds.push({
      ...guild,
      members: guildData.players,
      totalXP: guildData.totalLevel,
      memberCount: guildData.players.length,
    });
  }

  return createdGuilds;
};

const _generateFormationSummary = (
  confirmedPlayers,
  numberOfGuilds,
  guilds
) => {
  return {
    totalPlayers: confirmedPlayers.length,
    numberOfGuilds: numberOfGuilds,
    averagePlayersPerGuild:
      Math.round((confirmedPlayers.length / numberOfGuilds) * 100) / 100,
    xpDistribution: guilds.map((g, i) => ({
      guild: i + 1,
      totalXP: g.totalLevel,
    })),
  };
};

const create = async ({ name, sessionId, lore, gameMasterId }) => {
  return await guildService.create({
    name,
    sessionId,
    lore,
    gameMasterId,
  });
};

const update = async ({ id, name, lore, gameMasterId }) => {
  const guild = await guildService.update({
    id,
    name,
    lore,
    gameMasterId,
  });

  if (!guild) {
    throw new AppError("Guild não encontrada!", 404);
  }

  return guild;
};

const getById = async ({ id, gameMasterId }) => {
  const guild = await guildService.getById(id, gameMasterId);

  if (!guild) {
    throw new AppError("Guild não encontrada!", 404);
  }

  return guild;
};

const getByGameMasterId = async ({ gameMasterId }) => {
  return await guildService.getByGameMasterId(gameMasterId);
};

const deleteGuild = async ({ id, gameMasterId }) => {
  const result = await guildService.softDelete(id, gameMasterId);

  if (!result) {
    throw new AppError("Guild não encontrada!", 404);
  }

  return result;
};

const formGuildsAutomatically = async ({
  sessionId,
  numberOfGuilds,
  gameMasterId,
}) => {
  if (numberOfGuilds == 0) {
    throw new AppError("Número de guildas deve ser maior que 0!", 400);
  }

  const session = await sessionService.getById(sessionId, gameMasterId);
  if (!session) {
    throw new AppError("Sessão não encontrada!", 404);
  }

  const existingGuilds = await guildService.getByGameMasterId(gameMasterId);
  const sessionGuilds = existingGuilds.filter(
    (guild) => guild.session_id === sessionId
  );

  for (const guild of sessionGuilds) {
    await guildService.softDelete(guild.id, gameMasterId);
  }

  const confirmedPlayers =
    await sessionPlayerConfirmationService.getConfirmedPlayersBySessionId(
      sessionId,
      gameMasterId
    );

  if (confirmedPlayers.length === 0) {
    throw new AppError(
      "Nenhum jogador confirmado encontrado para esta sessão!",
      400
    );
  }

  const guilds = _initGuilds(numberOfGuilds);

  const players = _preparePlayersWithClassId(confirmedPlayers);

  const balancedGuilds = _distributePlayersToGuilds(players, guilds);

  const warnings = _buildWarnings(balancedGuilds);

  const createdGuilds = await _createGuildsInDatabase(
    balancedGuilds,
    sessionId,
    gameMasterId
  );

  const summary = _generateFormationSummary(
    confirmedPlayers,
    numberOfGuilds,
    balancedGuilds
  );

  return {
    guilds: createdGuilds,
    warnings,
    summary,
  };
};

const getGuildsBySessionId = async ({ sessionId, gameMasterId }) => {
  const allGuilds = await guildService.getByGameMasterId(gameMasterId);
  const sessionGuilds = allGuilds.filter(
    (guild) => guild.session_id === sessionId
  );

  if (sessionGuilds.length === 0) {
    return [];
  }

  const latestGuildsByName = sessionGuilds.reduce((acc, guild) => {
    const existingGuild = acc[guild.name];
    if (
      !existingGuild ||
      new Date(guild.created_at) > new Date(existingGuild.created_at)
    ) {
      acc[guild.name] = guild;
    }
    return acc;
  }, {});

  const currentSessionGuilds = Object.values(latestGuildsByName);

  const allMembers = await guildMemberService.getByGameMasterIdWithFilters(
    gameMasterId,
    { sessionId }
  );

  const currentGuildIds = currentSessionGuilds.map((guild) => guild.id);
  const currentMembers = allMembers.filter((member) =>
    currentGuildIds.includes(member.guild_id)
  );

  const membersByGuildId = currentMembers.reduce((acc, member) => {
    if (!acc[member.guild_id]) {
      acc[member.guild_id] = [];
    }
    const mappedMember = {
      ...member,
      name: member.player_name,
      level: member.player_level,
      class_name: member.player_class,
      lore: member.player_lore || null,
    };
    acc[member.guild_id].push(mappedMember);
    return acc;
  }, {});

  const guildsWithMembers = currentSessionGuilds.map((guild) => {
    const members = membersByGuildId[guild.id] || [];
    const totalXP = members.reduce((sum, member) => {
      return sum + (member.level || 1);
    }, 0);

    return {
      ...guild,
      members,
      memberCount: members.length,
      totalXP,
    };
  });

  // Sort guilds by name to maintain consistent order
  guildsWithMembers.sort((a, b) => {
    const aNum = parseInt(a.name.match(/\d+/)?.[0] || "0");
    const bNum = parseInt(b.name.match(/\d+/)?.[0] || "0");
    return aNum - bNum;
  });

  return guildsWithMembers;
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
