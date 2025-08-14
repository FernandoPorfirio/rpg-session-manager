const db = require("./db");

const create = async ({ name, sessionId, lore, gameMasterId }) => {
  const result = await db("guild")
    .insert({
      name,
      session_id: sessionId,
      lore,
      game_master_id: gameMasterId,
      updated_at: db.fn.now()
    })
    .returning(["id", "name", "session_id", "lore", "game_master_id", "created_at", "updated_at"]);

  return result[0];
};

const update = async ({ id, name, lore, gameMasterId }) => {
  const updateData = {
    updated_at: db.fn.now()
  };

  if (name !== undefined) updateData.name = name;
  if (lore !== undefined) updateData.lore = lore;

  const result = await db("guild")
    .where({ id, game_master_id: gameMasterId, is_deleted: false })
    .update(updateData)
    .returning(["id", "name", "session_id", "lore", "game_master_id", "created_at", "updated_at"]);

  return result[0];
};

const getById = async (id, gameMasterId) => {
  const whereClause = { "guild.id": id, "guild.is_deleted": false };

  if (gameMasterId !== undefined) {
    whereClause["guild.game_master_id"] = gameMasterId;
  }

  const result = await db("guild")
    .select(
      "guild.id",
      "guild.name",
      "guild.session_id",
      "guild.lore",
      "guild.game_master_id",
      "guild.created_at",
      "guild.updated_at",
      "session.name as session_name"
    )
    .leftJoin("session", "guild.session_id", "session.id")
    .where(whereClause)
    .andWhere("session.is_deleted", false)
    .first();

  return result;
};

const getByGameMasterId = async (gameMasterId) => {
  const result = await db("guild")
    .select(
      "guild.id",
      "guild.name",
      "guild.session_id",
      "guild.lore",
      "guild.game_master_id",
      "guild.created_at",
      "guild.updated_at",
      "session.name as session_name"
    )
    .leftJoin("session", "guild.session_id", "session.id")
    .where({ "guild.game_master_id": gameMasterId, "guild.is_deleted": false, "session.is_deleted": false });

  return result;
};

const softDelete = async (id, gameMasterId) => {
  const result = await db("guild")
    .where({ id, game_master_id: gameMasterId, is_deleted: false })
    .update({
      is_deleted: true,
      updated_at: db.fn.now()
    })
    .returning(["id"]);

  return result[0];
};

module.exports = {
  create,
  update,
  getById,
  getByGameMasterId,
  softDelete,
};
