const db = require("./db");

const create = async ({ sessionId, playerId, gameMasterId }) => {
  const result = await db("session_player_confirmation")
    .insert({
      session_id: sessionId,
      player_id: playerId,
      game_master_id: gameMasterId,
      updated_at: db.fn.now()
    })
    .returning(["id", "session_id", "player_id", "game_master_id", "created_at", "updated_at"]);

  return result[0];
};

const getById = async (id) => {
  const result = await db("session_player_confirmation")
    .select(
      "session_player_confirmation.id",
      "session_player_confirmation.session_id",
      "session_player_confirmation.player_id",
      "session_player_confirmation.game_master_id",
      "session_player_confirmation.created_at",
      "session_player_confirmation.updated_at",
      "session.name as session_name",
      "player.name as player_name",
      "player.level as player_level",
      "class.name as player_class"
    )
    .leftJoin("session", "session_player_confirmation.session_id", "session.id")
    .leftJoin("player", "session_player_confirmation.player_id", "player.id")
    .leftJoin("class", "player.class_id", "class.id")
    .where({
      "session_player_confirmation.id": id,
      "session_player_confirmation.is_deleted": false,
      "session.is_deleted": false,
      "player.is_deleted": false
    })
    .first();

  return result;
};

const getByGameMasterIdWithFilters = async (gameMasterId, { sessionId, playerId } = {}) => {
  let query = db("session_player_confirmation")
    .select(
      "session_player_confirmation.id",
      "session_player_confirmation.session_id",
      "session_player_confirmation.player_id",
      "session_player_confirmation.game_master_id",
      "session_player_confirmation.created_at",
      "session_player_confirmation.updated_at",
      "session.name as session_name",
      "player.name as player_name",
      "player.level as player_level",
      "class.name as player_class"
    )
    .leftJoin("session", "session_player_confirmation.session_id", "session.id")
    .leftJoin("player", "session_player_confirmation.player_id", "player.id")
    .leftJoin("class", "player.class_id", "class.id")
    .where({
      "session_player_confirmation.game_master_id": gameMasterId,
      "session_player_confirmation.is_deleted": false,
      "session.is_deleted": false,
      "player.is_deleted": false
    });

  if (sessionId) {
    query = query.where("session_player_confirmation.session_id", sessionId);
  }

  if (playerId) {
    query = query.where("session_player_confirmation.player_id", playerId);
  }

  const result = await query;
  return result;
};

const getBySessionIdAndPlayerId = async (sessionId, playerId) => {
  const result = await db("session_player_confirmation")
    .select("id")
    .where({
      session_id: sessionId,
      player_id: playerId,
      is_deleted: false
    })
    .first();

  return result;
};

const getConfirmedPlayersBySessionId = async (sessionId) => {
  const result = await db("session_player_confirmation")
    .select(
      "player.id",
      "player.name",
      "player.level",
      "player.class_id",
      "class.name as class_name"
    )
    .join("player", "session_player_confirmation.player_id", "player.id")
    .join("class", "player.class_id", "class.id")
    .where({
      "session_player_confirmation.session_id": sessionId,
      "session_player_confirmation.is_deleted": false,
      "player.is_deleted": false
    });

  return result;
};

const softDelete = async (id) => {
  const result = await db("session_player_confirmation")
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
  getBySessionIdAndPlayerId,
  getConfirmedPlayersBySessionId,
  softDelete,
};
