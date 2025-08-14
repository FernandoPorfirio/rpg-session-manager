const db = require("./db");

const create = async ({
  name,
  maxLevel,
  gameMasterId,
  lore,
  sessionStatusId = 1,
}) => {
  const result = await db("session")
    .insert({
      name,
      max_level: maxLevel,
      game_master_id: gameMasterId,
      lore,
      session_status_id: sessionStatusId,
      updated_at: db.fn.now(),
    })
    .returning([
      "id",
      "name",
      "max_level",
      "game_master_id",
      "lore",
      "session_status_id",
      "started_at",
      "finished_at",
      "created_at",
      "updated_at",
    ]);

  return result[0];
};

const update = async ({
  id,
  name,
  maxLevel,
  sessionStatusId,
  lore,
  startedAt,
  finishedAt,
  gameMasterId,
}) => {
  const updateData = {
    updated_at: db.fn.now(),
  };

  if (name !== undefined) updateData.name = name;
  if (maxLevel !== undefined) updateData.max_level = maxLevel;
  if (sessionStatusId !== undefined)
    updateData.session_status_id = sessionStatusId;
  if (lore !== undefined) updateData.lore = lore;
  if (startedAt !== undefined) updateData.started_at = startedAt;
  if (finishedAt !== undefined) updateData.finished_at = finishedAt;

  const result = await db("session")
    .where({ id, game_master_id: gameMasterId, is_deleted: false })
    .update(updateData)
    .returning([
      "id",
      "name",
      "max_level",
      "game_master_id",
      "lore",
      "session_status_id",
      "started_at",
      "finished_at",
      "created_at",
      "updated_at",
    ]);

  return result[0];
};

const getById = async (id, gameMasterId) => {
  const whereClause = { "session.id": id, "session.is_deleted": false };

  if (gameMasterId !== undefined) {
    whereClause["session.game_master_id"] = gameMasterId;
  }

  const result = await db("session")
    .select(
      "session.id",
      "session.name",
      "session.max_level",
      "session.game_master_id",
      "session.lore",
      "session.session_status_id",
      "session.started_at",
      "session.finished_at",
      "session.created_at",
      "session.updated_at",
      "session_status.name as status_name"
    )
    .leftJoin(
      "session_status",
      "session.session_status_id",
      "session_status.id"
    )
    .where(whereClause)
    .first();

  return result;
};

const getByGameMasterId = async (gameMasterId) => {
  const result = await db("session")
    .select(
      "session.id",
      "session.name",
      "session.max_level",
      "session.game_master_id",
      "session.lore",
      "session.session_status_id",
      "session.started_at",
      "session.finished_at",
      "session.created_at",
      "session.updated_at",
      "session_status.name as status_name"
    )
    .join("session_status", "session.session_status_id", "session_status.id")
    .where({
      "session.game_master_id": gameMasterId,
      "session.is_deleted": false,
    });

  return result;
};

const softDelete = async (id, gameMasterId) => {
  const result = await db("session")
    .where({ id, game_master_id: gameMasterId, is_deleted: false })
    .update({
      is_deleted: true,
      updated_at: db.fn.now(),
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
