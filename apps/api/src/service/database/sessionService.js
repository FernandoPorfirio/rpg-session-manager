const db = require("./db");

const create = async ({ name, max_level, game_master_id, lore, session_status_id = 1 }) => {
  const result = await db("session")
    .insert({
      name,
      max_level,
      game_master_id,
      lore,
      session_status_id,
      updated_at: db.fn.now()
    })
    .returning(["id", "name", "max_level", "game_master_id", "lore", "session_status_id", "started_at", "finished_at", "created_at", "updated_at"]);

  return result[0];
};

const update = async ({ id, name, max_level, session_status_id, lore, started_at, finished_at }) => {
  const updateData = {
    updated_at: db.fn.now()
  };

  if (name !== undefined) updateData.name = name;
  if (max_level !== undefined) updateData.max_level = max_level;
  if (session_status_id !== undefined) updateData.session_status_id = session_status_id;
  if (lore !== undefined) updateData.lore = lore;
  if (started_at !== undefined) updateData.started_at = started_at;
  if (finished_at !== undefined) updateData.finished_at = finished_at;

  const result = await db("session")
    .where({ id, is_deleted: false })
    .update(updateData)
    .returning(["id", "name", "max_level", "game_master_id", "lore", "session_status_id", "started_at", "finished_at", "created_at", "updated_at"]);

  return result[0];
};

const getById = async (id) => {
  const result = await db("session")
    .select("session.id", "session.name", "session.max_level", "session.game_master_id", "session.lore", "session.session_status_id", "session.started_at", "session.finished_at", "session.created_at", "session.updated_at", "session_status.name as status_name")
    .leftJoin("session_status", "session.session_status_id", "session_status.id")
    .where({ "session.id": id, "session.is_deleted": false })
    .first();

  return result;
};


const getByGameMasterId = async (game_master_id) => {
  const result = await db("session")
    .select("session.id", "session.name", "session.max_level", "session.game_master_id", "session.lore", "session.session_status_id", "session.started_at", "session.finished_at", "session.created_at", "session.updated_at", "session_status.name as status_name")
    .join("session_status", "session.session_status_id", "session_status.id")
    .where({ "session.game_master_id": game_master_id, "session.is_deleted": false });

  return result;
};

const softDelete = async (id) => {
  const result = await db("session")
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
  update,
  getById,
  getByGameMasterId,
  softDelete,
};
