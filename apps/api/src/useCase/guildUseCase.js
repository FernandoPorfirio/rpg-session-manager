const AppError = require("@errors/AppError");
const guildService = require("@service/database/guildService");
const guildMemberService = require("@service/database/guildMemberService");
const sessionPlayerConfirmationService = require("@service/database/sessionPlayerConfirmationService");
const sessionService = require("@service/database/sessionService");
const { balanceGuilds } = require("./helpers/guildBalancer");

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

/**
 * Cria guildas no banco de dados com base nos dados balanceados
 * @param {Array} balancedGuilds
 * @param {number} sessionId
 * @param {number} gameMasterId
 * @returns {Array} Array de guildas criadas com membros
 */
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
      lore: `Guilda formada automaticamente com ${guildData.members.length} membros (XP total: ${guildData.totalXP})`,
      gameMasterId,
    });

    // Adiciona membros à guilda
    for (const member of guildData.members) {
      await guildMemberService.create({
        guildId: guild.id,
        playerId: member.id,
        gameMasterId,
      });
    }

    createdGuilds.push({
      ...guild,
      members: guildData.members,
      totalXP: guildData.totalXP,
      memberCount: guildData.members.length,
    });
  }

  return createdGuilds;
};

/**
 * Gera resumo estatístico da formação das guildas
 * @param {Array} confirmedPlayers
 * @param {number} numberOfGuilds
 * @param {Array} guilds
 * @returns {Object} Objeto com estatísticas do balanceamento
 */
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
      totalXP: g.totalXP,
    })),
  };
};

const formGuildsAutomatically = async ({
  sessionId,
  numberOfGuilds,
  gameMasterId,
}) => {
  const session = await sessionService.getById(sessionId, gameMasterId);
  if (!session) {
    throw new AppError("Sessão não encontrada!", 404);
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

  if (numberOfGuilds == 0) {
    throw new AppError("Número de guildas deve ser maior que 0!", 400);
  }

  const guilds = [];
  for (let i = 0; i < numberOfGuilds; i++) {
    guilds.push({
      members: [],
      totalXP: 0,
      hasCleric: false,
      hasWarrior: false,
      hasMage: false,
      hasArcher: false,
    });
  }

  const assignedIds = new Set();
  const clerics = [];
  const warriors = [];
  const mages = [];
  const archers = [];

  for (const p of confirmedPlayers) {
    const level = p.level;
    const className = p.class_name;
    const player = { ...p, level, class_name: className };

    if (className === "Clérigo") {
      clerics.push(player);
    }

    if (className === "Guerreiro") {
      warriors.push(player);
    }

    if (className === "Mago") {
      mages.push(player);
    }

    if (className === "Arqueiro") {
      archers.push(player);
    }
  }

  clerics.sort((a, b) => b.level - a.level);
  warriors.sort((a, b) => b.level - a.level);
  mages.sort((a, b) => b.level - a.level);
  archers.sort((a, b) => b.level - a.level);

  let rrIndex = 0;
  for (const p of clerics) {
    const gIndex = rrIndex % guilds.length;
    guilds[gIndex].members.push(p);
    guilds[gIndex].totalXP += p.level;
    guilds[gIndex].hasCleric = true;
    assignedIds.add(p.id);
    rrIndex++;
  }

  rrIndex = 0;
  for (const p of warriors) {
    const gIndex = rrIndex % guilds.length;
    guilds[gIndex].members.push(p);
    guilds[gIndex].totalXP += p.level;
    guilds[gIndex].hasWarrior = true;
    assignedIds.add(p.id);
    rrIndex++;
  }

  const ranged = mages.concat(archers).sort((a, b) => b.level - a.level);
  rrIndex = 0;
  for (const p of ranged) {
    const gIndex = rrIndex % guilds.length;
    guilds[gIndex].members.push(p);
    guilds[gIndex].totalXP += p.level;
    if (p.class_name === "Mago") guilds[gIndex].hasMage = true;
    if (p.class_name === "Arqueiro") guilds[gIndex].hasArcher = true;
    assignedIds.add(p.id);
    rrIndex++;
  }

  const warnings = [];
  for (let i = 0; i < guilds.length; i++) {
    const g = guilds[i];
    const faltas = [];
    if (!g.hasCleric) faltas.push("sem Clérigo");
    if (!g.hasWarrior) faltas.push("sem Guerreiro");
    if (!g.hasMage && !g.hasArcher) faltas.push("sem atacante à distância");
    if (faltas.length) warnings.push(`Guilda ${i + 1}: ${faltas.join(", ")}`);
  }

  const totals = guilds.map((g) => g.totalXP);
  const maxXP = Math.max(...totals);
  const minXP = Math.min(...totals);
  const summary = {
    totalPlayers: confirmedPlayers.length,
    numberOfGuilds,
    averagePlayersPerGuild:
      Math.round((confirmedPlayers.length / numberOfGuilds) * 100) / 100,
    xpDistribution: guilds.map((g, idx) => ({
      guild: idx + 1,
      totalXP: g.totalXP,
      members: g.members.length,
    })),
    xpSpread: maxXP - minXP,
  };

  return;

  // // Cria guildas no banco de dados
  // const createdGuilds = await _createGuildsInDatabase(
  //   balancedGuilds,
  //   sessionId,
  //   gameMasterId
  // );

  // // Gera resumo
  // const summary = _generateFormationSummary(
  //   confirmedPlayers,
  //   numberOfGuilds,
  //   balancedGuilds
  // );

  // return {
  //   guilds: createdGuilds,
  //   warnings,
  //   summary,
  // };
};

const getGuildsBySessionId = async ({ sessionId, gameMasterId }) => {
  const allGuilds = await guildService.getByGameMasterId(gameMasterId);
  const sessionGuilds = allGuilds.filter(
    (guild) => guild.session_id === sessionId
  );

  if (sessionGuilds.length === 0) {
    return [];
  }

  const allMembers = await guildMemberService.getByGameMasterIdWithFilters(
    gameMasterId,
    { sessionId }
  );

  const membersByGuildId = allMembers.reduce((acc, member) => {
    if (!acc[member.guild_id]) {
      acc[member.guild_id] = [];
    }
    acc[member.guild_id].push(member);
    return acc;
  }, {});

  const guildsWithMembers = sessionGuilds.map((guild) => {
    const members = membersByGuildId[guild.id] || [];
    const totalXP = members.reduce((sum, member) => {
      return sum + (member.player_level || 1);
    }, 0);

    return {
      ...guild,
      members,
      memberCount: members.length,
      totalXP,
    };
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
