require("dotenv").config({ path: ".env.test" });
const db = require('../src/service/database/db');

beforeAll(async () => {
  // await db.migrate.latest();  // Se estiver usando Knex
});

beforeEach(async () => {
  // await db.truncateAllTables(); // Função custom para limpar dados
});

afterAll(async () => {
  await db.destroy(); // Fechar conexão
});
