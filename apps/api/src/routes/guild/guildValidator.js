const Joi = require("joi");

const createGuildSchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  sessionId: Joi.number().integer().positive().required(),
  lore: Joi.string().max(2000).optional().allow(null, ""),
});

const updateGuildSchema = Joi.object({
  name: Joi.string().min(2).max(100).optional(),
  lore: Joi.string().max(2000).optional().allow(null, ""),
});

const formGuildsSchema = Joi.object({
  sessionId: Joi.number().integer().positive().required(),
  numberOfGuilds: Joi.number().integer().min(1).max(50).required(),
});

module.exports = {
  createGuildSchema,
  updateGuildSchema,
  formGuildsSchema,
};
