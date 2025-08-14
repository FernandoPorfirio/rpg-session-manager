require("dotenv").config({ path: ".env.test" });
const db = require('../src/service/database/db');

beforeAll(async () => {
});

beforeEach(async () => {
});

afterAll(async () => {
  await db.destroy();
});
