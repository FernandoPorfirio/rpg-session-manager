const Joi = require('joi');

const createPlayerSchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  classId: Joi.number().integer().positive().required(),
  level: Joi.number().integer().min(1).max(100).optional().default(1),
  lore: Joi.string().max(2000).optional().allow(null, '')
});

const updatePlayerSchema = Joi.object({
  name: Joi.string().min(2).max(100).optional(),
  classId: Joi.number().integer().positive().optional(),
  level: Joi.number().integer().min(1).max(100).optional(),
  lore: Joi.string().max(2000).optional().allow(null, '')
});

module.exports = {
  createPlayerSchema,
  updatePlayerSchema
};
