const AppError = require("@errors/AppError");
const guildService = require("@service/database/guildService");
const guildMemberService = require("@service/database/guildMemberService");
const sessionPlayerConfirmationService = require("@service/database/sessionPlayerConfirmationService");

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
  const confirmedPlayers =
    await sessionPlayerConfirmationService.getConfirmedPlayersBySessionId(
      sessionId
    );

  if (confirmedPlayers.length === 0) {
    throw new AppError(
      "Nenhum jogador confirmado encontrado para esta sessão!",
      400
    );
  }

  if (numberOfGuilds <= 0 || numberOfGuilds > confirmedPlayers.length) {
    throw new AppError(
      "Número de guildas deve ser maior que 0 e menor ou igual ao número de jogadores!",
      400
    );
  }

  const essentialClasses = ["Clérigo", "Guerreiro", "Mago", "Arqueiro"];

  const playersByClass = {};
  const unclassifiedPlayers = [];

  confirmedPlayers.forEach((player) => {
    const className = player.class_name;
    if (!className) {
      unclassifiedPlayers.push(player);
    } else {
      if (!playersByClass[className]) {
        playersByClass[className] = [];
      }
      playersByClass[className].push(player);
    }
  });

  const guilds = Array.from({ length: numberOfGuilds }, () => ({
    members: [],
    totalXP: 0,
    hasCleric: false,
    hasWarrior: false,
    hasMage: false,
    hasArcher: false,
  }));

  const calculateXP = (level) => {
    return Math.pow(level, 2) * 1000;
  };

  essentialClasses.forEach((className) => {
    const classPlayers = playersByClass[className] || [];
    classPlayers.sort((a, b) => b.level - a.level);

    classPlayers.forEach((player, index) => {
      const guildIndex = index % numberOfGuilds;
      const xp = calculateXP(player.level);

      guilds[guildIndex].members.push(player);
      guilds[guildIndex].totalXP += xp;

      switch (className) {
        case "Clérigo":
          guilds[guildIndex].hasCleric = true;
          break;
        case "Guerreiro":
          guilds[guildIndex].hasWarrior = true;
          break;
        case "Mago":
          guilds[guildIndex].hasMage = true;
          break;
        case "Arqueiro":
          guilds[guildIndex].hasArcher = true;
          break;
      }
    });
  });

  const remainingPlayers = [];
  Object.keys(playersByClass).forEach((className) => {
    if (!essentialClasses.includes(className)) {
      remainingPlayers.push(...playersByClass[className]);
    }
  });
  remainingPlayers.push(...unclassifiedPlayers);

  remainingPlayers.sort((a, b) => b.level - a.level);

  remainingPlayers.forEach((player) => {
    let targetGuildIndex = 0;
    let minXP = guilds[0].totalXP;

    for (let i = 1; i < guilds.length; i++) {
      if (guilds[i].totalXP < minXP) {
        minXP = guilds[i].totalXP;
        targetGuildIndex = i;
      }
    }

    const xp = calculateXP(player.level);
    guilds[targetGuildIndex].members.push(player);
    guilds[targetGuildIndex].totalXP += xp;
  });

  const createdGuilds = [];
  const warnings = [];

  for (let i = 0; i < guilds.length; i++) {
    const guildData = guilds[i];

    const compositionWarnings = [];
    if (!guildData.hasCleric) compositionWarnings.push("sem Clérigo");
    if (!guildData.hasWarrior) compositionWarnings.push("sem Guerreiro");
    if (!guildData.hasMage && !guildData.hasArcher)
      compositionWarnings.push("sem atacante à distância");

    if (compositionWarnings.length > 0) {
      warnings.push(`Guilda ${i + 1}: ${compositionWarnings.join(", ")}`);
    }

    const guildName = `Guilda ${i + 1}`;
    const guild = await guildService.create({
      name: guildName,
      sessionId,
      lore: `Guilda formada automaticamente com ${guildData.members.length} membros (XP total: ${guildData.totalXP})`,
      gameMasterId,
    });

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

  return {
    guilds: createdGuilds,
    warnings,
    summary: {
      totalPlayers: confirmedPlayers.length,
      numberOfGuilds: numberOfGuilds,
      averagePlayersPerGuild:
        Math.round((confirmedPlayers.length / numberOfGuilds) * 100) / 100,
      xpDistribution: guilds.map((g, i) => ({
        guild: i + 1,
        totalXP: g.totalXP,
      })),
    },
  };
};

const getGuildsBySessionId = async ({ sessionId, gameMasterId }) => {
  const guilds = await guildService.getByGameMasterId(gameMasterId);
  const sessionGuilds = guilds.filter(
    (guild) => guild.session_id === sessionId
  );

  const guildsWithMembers = await Promise.all(
    sessionGuilds.map(async (guild) => {
      const members = await guildMemberService.getByGameMasterIdWithFilters(
        gameMasterId,
        { guildId: guild.id }
      );

      return {
        ...guild,
        members,
        memberCount: members.length,
        totalXP: members.reduce((sum, member) => {
          return sum + Math.pow(member.player_level || 1, 2) * 1000;
        }, 0),
      };
    })
  );

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
