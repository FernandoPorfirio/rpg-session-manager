const AppError = require("@errors/AppError");
const guildService = require("@service/database/guildService");
const guildMemberService = require("@service/database/guildMemberService");
const sessionPlayerConfirmationService = require("@service/database/sessionPlayerConfirmationService");
const sessionService = require("@service/database/sessionService");

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
 * Cria N guildas vazias com os metadados de composição.
 * @param {number} numberOfGuilds
 * @returns {Guild[]}
 * @private
 */
const _initGuilds = (numberOfGuilds) => {
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
  return guilds;
};

/**
 * Separa e ordena os jogadores confirmados por classe, nivelando `level`.
 * @param {Array<Object>} confirmedPlayers
 * @returns {{ clerics: Object[], warriors: Object[], mages: Object[], archers: Object[] }}
 * @private
 */
const _splitAndSortPlayersByClass = (confirmedPlayers) => {
  const clerics = [];
  const warriors = [];
  const mages = [];
  const archers = [];

  for (const p of confirmedPlayers) {
    const level = Number.isFinite(Number(p.level)) ? Number(p.level) : 1;
    if (p.class_name === "Clérigo") {
      clerics.push({ ...p, level, class_name: "Clérigo" });
    } else if (p.class_name === "Guerreiro") {
      warriors.push({ ...p, level, class_name: "Guerreiro" });
    } else if (p.class_name === "Mago") {
      mages.push({ ...p, level, class_name: "Mago" });
    } else if (p.class_name === "Arqueiro") {
      archers.push({ ...p, level, class_name: "Arqueiro" });
    }
  }

  clerics.sort((a, b) => b.level - a.level);
  warriors.sort((a, b) => b.level - a.level);
  mages.sort((a, b) => b.level - a.level);
  archers.sort((a, b) => b.level - a.level);

  return { clerics, warriors, mages, archers };
};

/**
 * Retorna o índice da guilda de MENOR XP que ainda falta (flagA) OU (flagBOptional).
 * Desempata por: menos membros → menor índice (determinístico).
 * @param {Guild[]} guilds
 * @param {"hasCleric"|"hasWarrior"|"hasMage"|"hasArcher"} flagA
 * @param {"hasMage"|"hasArcher"} [flagBOptional]
 * @returns {number} índice da guilda alvo, ou -1 se nenhuma falta o requisito.
 * @private
 */
const _findMinXpGuildMissing = (guilds, flagA, flagBOptional) => {
  let idx = -1;
  for (let i = 0; i < guilds.length; i++) {
    const g = guilds[i];
    const missing = flagBOptional ? !g[flagA] && !g[flagBOptional] : !g[flagA];
    if (!missing) continue;
    if (idx === -1) {
      idx = i;
      continue;
    }
    const t = guilds[idx];
    if (
      g.totalXP < t.totalXP ||
      (g.totalXP === t.totalXP && g.members.length < t.members.length) ||
      (g.totalXP === t.totalXP &&
        g.members.length === t.members.length &&
        i < idx)
    ) {
      idx = i;
    }
  }
  return idx;
};

/**
 * Retorna o índice da guilda de MENOR XP (desempate: menos membros → menor índice).
 * @param {Guild[]} guilds
 * @returns {number}
 * @private
 */
const _findMinXpGuild = (guilds) => {
  let idx = 0;
  for (let i = 1; i < guilds.length; i++) {
    const g = guilds[i];
    const t = guilds[idx];
    if (
      g.totalXP < t.totalXP ||
      (g.totalXP === t.totalXP && g.members.length < t.members.length) ||
      (g.totalXP === t.totalXP &&
        g.members.length === t.members.length &&
        i < idx)
    ) {
      idx = i;
    }
  }
  return idx;
};

/**
 * Insere o player na guilda alvo e atualiza flags/XP.
 * @param {Guild[]} guilds
 * @param {number} guildIndex
 * @param {Object} player
 * @private
 */
const _place = (guilds, guildIndex, player) => {
  const g = guilds[guildIndex];
  g.members.push(player);
  g.totalXP += player.level;
  if (player.class_name === "Clérigo") g.hasCleric = true;
  if (player.class_name === "Guerreiro") g.hasWarrior = true;
  if (player.class_name === "Mago") g.hasMage = true;
  if (player.class_name === "Arqueiro") g.hasArcher = true;
};

/**
 * Gera avisos de composição mínima por guilda.
 * @param {Guild[]} guilds
 * @returns {string[]}
 * @private
 */
const _buildWarnings = (guilds) => {
  const warnings = [];
  for (let i = 0; i < guilds.length; i++) {
    const g = guilds[i];
    const faltas = [];
    if (!g.hasCleric) faltas.push("sem Clérigo");
    if (!g.hasWarrior) faltas.push("sem Guerreiro");
    if (!g.hasMage && !g.hasArcher) faltas.push("sem atacante à distância");
    if (faltas.length) warnings.push(`Guilda ${i + 1}: ${faltas.join(", ")}`);
  }
  return warnings;
};

/**
 * Persiste as guildas e seus membros no banco, mantendo a ordem como "Guilda 1..N".
 * Observação: se disponível, considere envolver em transação (Knex) para atomicidade.
 *
 * @param {Guild[]} balancedGuilds - guildas balanceadas (em memória)
 * @param {number} sessionId
 * @param {number} gameMasterId
 * @returns {Promise<Array>} guildas persistidas com `members`, `totalXP` e `memberCount`
 * @private
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

    // Adiciona membros à guilda (mantém ordem do balanceamento)
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
 * Gera um resumo estatístico da formação (sem alterar o modelo original).
 * @param {Array<Object>} confirmedPlayers
 * @param {number} numberOfGuilds
 * @param {Guild[]} guilds
 * @returns {{ totalPlayers:number, numberOfGuilds:number, averagePlayersPerGuild:number, xpDistribution:Array<{guild:number,totalXP:number}> }}
 * @private
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

/**
 * Forma guildas automaticamente para uma sessão, persistindo o resultado.
 *
 * Pipeline:
 *  1) Validar sessão e entradas
 *  2) Buscar confirmados
 *  3) Inicializar guildas vazias
 *  4) Separar/ordenar por classe fixa (Clérigo, Guerreiro, Mago, Arqueiro)
 *  5) Fase A (Viabilidade): distribuir essenciais na guilda de MENOR XP que ainda precisa
 *  6) Fase B (Equilíbrio): distribuir excedentes (das quatro classes) SEMPRE para a guilda de MENOR XP
 *  7) Avisos de composição
 *  8) Persistência (guilds + members)
 *  9) Summary
 *
 * @param {Object} params
 * @param {number} params.sessionId
 * @param {number} params.numberOfGuilds
 * @param {number} params.gameMasterId
 * @returns {Promise<{ guilds: Array, warnings: string[], summary: Object }>}
 */
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

  // Delete existing guilds for this session before creating new ones
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

  const { clerics, warriors, mages, archers } =
    _splitAndSortPlayersByClass(confirmedPlayers);

  while (clerics.length) {
    const target = _findMinXpGuildMissing(guilds, "hasCleric");
    if (target === -1) break;
    const p = clerics.shift();
    _place(guilds, target, p);
  }

  while (warriors.length) {
    const target = _findMinXpGuildMissing(guilds, "hasWarrior");
    if (target === -1) break;
    const p = warriors.shift();
    _place(guilds, target, p);
  }

  while (mages.length || archers.length) {
    const target = _findMinXpGuildMissing(guilds, "hasMage", "hasArcher");
    if (target === -1) break;

    const mageTop = mages.length ? mages[0].level : -1;
    const archerTop = archers.length ? archers[0].level : -1;
    if (mageTop >= archerTop) {
      _place(guilds, target, mages.shift());
    } else {
      _place(guilds, target, archers.shift());
    }
  }

  while (clerics.length || warriors.length || mages.length || archers.length) {
    const topC = clerics.length ? clerics[0].level : -1;
    const topW = warriors.length ? warriors[0].level : -1;
    const topM = mages.length ? mages[0].level : -1;
    const topA = archers.length ? archers[0].level : -1;

    let choice = "cleric";
    let best = topC;
    if (topW > best) {
      best = topW;
      choice = "warrior";
    }
    if (topM > best) {
      best = topM;
      choice = "mage";
    }
    if (topA > best) {
      best = topA;
      choice = "archer";
    }

    if (best < 0) break;

    const target = _findMinXpGuild(guilds);
    if (choice === "cleric") {
      _place(guilds, target, clerics.shift());
      continue;
    }
    if (choice === "warrior") {
      _place(guilds, target, warriors.shift());
      continue;
    }
    if (choice === "mage") {
      _place(guilds, target, mages.shift());
      continue;
    }
    if (choice === "archer") {
      _place(guilds, target, archers.shift());
      continue;
    }
  }

  const warnings = _buildWarnings(guilds);

  const createdGuilds = await _createGuildsInDatabase(
    guilds,
    sessionId,
    gameMasterId
  );

  const summary = _generateFormationSummary(
    confirmedPlayers,
    numberOfGuilds,
    guilds
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
