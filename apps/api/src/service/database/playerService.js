const db = require("./db");

const create = async ({ name, classId, level = 1, lore, gameMasterId }) => {
  const result = await db("player")
    .insert({
      name,
      class_id: classId,
      level,
      lore,
      game_master_id: gameMasterId,
      updated_at: db.fn.now()
    })
    .returning(["id", "name", "class_id", "level", "lore", "game_master_id", "created_at", "updated_at"]);

  return result[0];
};

const update = async ({ id, name, classId, level, lore }) => {
  const updateData = {
    updated_at: db.fn.now()
  };

  if (name !== undefined) updateData.name = name;
  if (classId !== undefined) updateData.class_id = classId;
  if (level !== undefined) updateData.level = level;
  if (lore !== undefined) updateData.lore = lore;

  const result = await db("player")
    .where({ id })
    .update(updateData)
    .returning(["id", "name", "class_id", "level", "lore", "game_master_id", "created_at", "updated_at"]);

  return result[0];
};

const getById = async (id) => {
  const result = await db("player")
    .select(
      "player.id",
      "player.name",
      "player.class_id",
      "player.level",
      "player.lore",
      "player.game_master_id",
      "player.created_at",
      "player.updated_at",
      "class.name as class_name"
    )
    .leftJoin("class", "player.class_id", "class.id")
    .where({ "player.id": id })
    .first();

  return result;
};

const getByGameMasterIdWithFilters = async (gameMasterId, { sessionId, guildId } = {}) => {
  let query = db("player")
    .select(
      "player.id",
      "player.name",
      "player.class_id",
      "player.level",
      "player.lore",
      "player.game_master_id",
      "player.created_at",
      "player.updated_at",
      "class.name as class_name"
    )
    .leftJoin("class", "player.class_id", "class.id")
    .where({ "player.game_master_id": gameMasterId });

  if (sessionId) {
    query = query
      .leftJoin("guild_member", "player.id", "guild_member.player_id")
      .leftJoin("guild", "guild_member.guild_id", "guild.id")
      .where("guild.session_id", sessionId);
  }

  if (guildId) {
    if (!sessionId) {
      query = query
        .leftJoin("guild_member", "player.id", "guild_member.player_id");
    }
    query = query.where("guild_member.guild_id", guildId);
  }

  query = query.distinct();

  const result = await query;
  return result;
};

const deleteById = async (id) => {
  const result = await db("player")
    .where({ id })
    .del()
    .returning(["id"]);

  return result[0];
};

module.exports = {
  create,
  update,
  getById,
  getByGameMasterIdWithFilters,
  deleteById,
};
