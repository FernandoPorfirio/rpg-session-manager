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
    .where({ id, is_deleted: false })
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
    .where({ "player.id": id, "player.is_deleted": false })
    .first();

  return result;
};

const getByGameMasterIdWithFilters = async (gameMasterId, { sessionId, guildId, name, page = 1, limit = 10 } = {}) => {
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
    .where({ "player.game_master_id": gameMasterId, "player.is_deleted": false });

  if (name !== undefined && name !== "") {
    query = query.where("player.name", "ilike", `%${name}%`);
  }

  if (sessionId) {
    query = query
      .leftJoin("guild_member", function() {
        this.on("player.id", "=", "guild_member.player_id")
            .on("guild_member.is_deleted", "=", db.raw("false"));
      })
      .leftJoin("guild", function() {
        this.on("guild_member.guild_id", "=", "guild.id")
            .on("guild.is_deleted", "=", db.raw("false"));
      })
      .where("guild.session_id", sessionId);
  }

  if (guildId) {
    if (!sessionId) {
      query = query
        .leftJoin("guild_member", function() {
          this.on("player.id", "=", "guild_member.player_id")
              .on("guild_member.is_deleted", "=", db.raw("false"));
        });
    }
    query = query.where("guild_member.guild_id", guildId);
  }

  query = query.distinct();

  const countQuery = query.clone().clearSelect().count('* as total');
  const countResult = await countQuery;
  const total = parseInt(countResult[0].total);

  const offset = (page - 1) * limit;
  const result = await query.limit(limit).offset(offset).orderBy('player.created_at', 'desc');

  return {
    data: result,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      pages: Math.ceil(total / limit)
    }
  };
};

const softDelete = async (id) => {
  const result = await db("player")
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
  getByGameMasterIdWithFilters,
  softDelete,
};
