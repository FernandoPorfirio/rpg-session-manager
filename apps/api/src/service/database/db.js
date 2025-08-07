const knex = require('knex');
const knexConfig = require('@root/knexfile');

const db = knex(knexConfig);

module.exports = db;
