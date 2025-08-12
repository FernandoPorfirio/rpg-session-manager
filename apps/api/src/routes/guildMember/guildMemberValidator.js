const Joi = require('joi');

const createGuildMemberSchema = Joi.object({
  guildId: Joi.number().integer().positive().required(),
  playerId: Joi.number().integer().positive().required()
});

module.exports = {
  createGuildMemberSchema
};
