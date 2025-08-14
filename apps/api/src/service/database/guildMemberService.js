const db = require("./db");

const create = async ({ guildId, playerId, gameMasterId }) => {
  const result = await db("guild_member")
    .insert({
      guild_id: guildId,
      player_id: playerId,
      game_master_id: gameMasterId,
      updated_at: db.fn.now()
    })
    .returning(["id", "guild_id", "player_id", "game_master_id", "created_at", "updated_at"]);

  return result[0];
};

const getById = async (id) => {
  const result = await db("guild_member")
    .select(
      "guild_member.id",
      "guild_member.guild_id",
      "guild_member.player_id",
      "guild_member.game_master_id",
      "guild_member.created_at",
      "guild_member.updated_at",
      "guild.name as guild_name",
      "player.name as player_name"
    )
    .leftJoin("guild", "guild_member.guild_id", "guild.id")
    .leftJoin("player", "guild_member.player_id", "player.id")
    .where({
      "guild_member.id": id,
      "guild_member.is_deleted": false,
      "guild.is_deleted": false,
      "player.is_deleted": false
    })
    .first();

  return result;
};

const getByGameMasterIdWithFilters = async (gameMasterId, { guildId, sessionId } = {}) => {
  let query = db("guild_member")
    .select(
      "guild_member.id",
      "guild_member.guild_id",
      "guild_member.player_id",
      "guild_member.game_master_id",
      "guild_member.created_at",
      "guild_member.updated_at",
      "guild.name as guild_name",
      "guild.session_id",
      "session.name as session_name",
      "player.name as player_name",
      "player.level as player_level",
      "class.name as player_class"
    )
    .leftJoin("guild", "guild_member.guild_id", "guild.id")
    .leftJoin("session", "guild.session_id", "session.id")
    .leftJoin("player", "guild_member.player_id", "player.id")
    .leftJoin("class", "player.class_id", "class.id")
    .where({
      "guild_member.game_master_id": gameMasterId,
      "guild_member.is_deleted": false,
      "guild.is_deleted": false,
      "session.is_deleted": false,
      "player.is_deleted": false
    });

  if (guildId) {
    query = query.where("guild_member.guild_id", guildId);
  }

  if (sessionId) {
    query = query.where("guild.session_id", sessionId);
  }

  const result = await query;
  return result;
};

const getByGuildIdAndPlayerId = async (guildId, playerId) => {
  const result = await db("guild_member")
    .select("id")
    .where({
      guild_id: guildId,
      player_id: playerId,
      is_deleted: false
    })
    .first();

  return result;
};

const softDelete = async (id) => {
  const result = await db("guild_member")
    .where({ id, is_deleted: false })
    .update({
      is_deleted: true,
      updated_at: db.fn.now()
    })
    .returning(["id"]);

  return result[0];
};

module.exports = {
  create,
  getById,
  getByGameMasterIdWithFilters,
  getByGuildIdAndPlayerId,
  softDelete,
};
