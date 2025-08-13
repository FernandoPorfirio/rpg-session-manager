const Joi = require('joi');

const createSessionPlayerConfirmationSchema = Joi.object({
  sessionId: Joi.number().integer().positive().required(),
  playerId: Joi.number().integer().positive().required()
});

module.exports = {
  createSessionPlayerConfirmationSchema
};
