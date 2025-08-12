const Joi = require('joi');

const createSessionSchema = Joi.object({
  name: Joi.string().min(3).required(),
  maxLevel: Joi.number().integer().min(1).optional().allow(null),
  lore: Joi.string().optional().allow(null, '')
});

const updateSessionSchema = Joi.object({
  name: Joi.string().min(3).optional(),
  maxLevel: Joi.number().integer().min(1).optional().allow(null),
  sessionStatusId: Joi.number().integer().valid(1, 2, 3, 4).optional(),
  lore: Joi.string().optional().allow(null, '')
});

module.exports = {
  createSessionSchema,
  updateSessionSchema
};
