const Joi = require('joi');

const createSessionSchema = Joi.object({
  name: Joi.string().min(3).required(),
  max_level: Joi.number().integer().min(1).optional().allow(null),
  lore: Joi.string().optional().allow(null, '')
});

const updateSessionSchema = Joi.object({
  name: Joi.string().min(3).optional(),
  max_level: Joi.number().integer().min(1).optional().allow(null),
  session_status_id: Joi.number().integer().valid(1, 2, 3, 4).optional(),
  lore: Joi.string().optional().allow(null, '')
});

module.exports = {
  createSessionSchema,
  updateSessionSchema
};
