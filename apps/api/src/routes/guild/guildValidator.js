const Joi = require('joi');

const createGuildSchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  sessionId: Joi.number().integer().positive().required(),
  lore: Joi.string().max(2000).optional().allow(null, '')
});

const updateGuildSchema = Joi.object({
  name: Joi.string().min(2).max(100).optional(),
  lore: Joi.string().max(2000).optional().allow(null, '')
});

module.exports = {
  createGuildSchema,
  updateGuildSchema
};
