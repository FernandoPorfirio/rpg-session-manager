require('dotenv').config();

const baseConfig = {
  client: 'pg',
  connection: {
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
  }
};

module.exports = {
  development: baseConfig,
  test: {
    ...baseConfig,
    connection: {
      ...baseConfig.connection,
      database: process.env.DB_NAME || 'app_db_test',
    },
  },
  production: baseConfig,
};
