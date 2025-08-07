require('dotenv').config({ path: '.env.test' });

const request = require('supertest');
const app = require('../../../src/app');
const db = require('../../../src/service/database/db');

async function createGameMaster({
  name = 'test',
  email = 'test@example.com',
  password = '123456'
} = {}) {
  const response = await request(app)
    .post('/api/game_master')
    .send({ name, email, password });

  return response.body;
}

async function loginGameMaster({
  email = 'test@example.com',
  password = '123456'
} = {}) {
  const response = await request(app)
    .post('/api/game_master/login')
    .send({ email, password });

  return response.body.token;
}

beforeEach(async () => {
  await db('game_master').del();
});

afterAll(async () => {
  await db.destroy();
});

describe('GameMaster API', () => {

  describe('POST /api/game_master', () => {

    it('deve criar um novo game master', async () => {
      const response = await request(app)
        .post('/api/game_master')
        .send({
          name: 'test',
          email: 'test@example.com',
          password: '123456'
        });

      expect(response.statusCode).toBe(201);
      expect(response.body).toHaveProperty('name', 'test');
      expect(response.body).toHaveProperty('email', 'test@example.com');
    });

    it('deve falhar se o email já estiver cadastrado', async () => {
      await createGameMaster();

      const response = await request(app)
        .post('/api/game_master')
        .send({
          name: 'test',
          email: 'test@example.com',
          password: '123456'
        });

      expect(response.statusCode).toBe(400);
      expect(response.body).toHaveProperty('message', 'Email já cadastrado!');
    });

    it('deve falhar com email inválido', async () => {
      const response = await request(app)
        .post('/api/game_master')
        .send({
          name: 'test',
          email: 'email-invalido',
          password: '123456'
        });

      expect(response.statusCode).toBe(400);
    });
  });

  describe('POST /api/game_master/login', () => {

    it('deve retornar um token válido', async () => {
      await createGameMaster();
      const response = await request(app)
        .post('/api/game_master/login')
        .send({
          email: 'test@example.com',
          password: '123456'
        });

      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty('token');
    });

    it('deve falhar com senha inválida', async () => {
      await createGameMaster();

      const response = await request(app)
        .post('/api/game_master/login')
        .send({
          email: 'test@example.com',
          password: 'senhaerrada'
        });

      expect(response.statusCode).toBe(401);
      expect(response.body.message).toBe('Senha inválida!');
    });

    it('deve falhar com usuário inexistente', async () => {
      const response = await request(app)
        .post('/api/game_master/login')
        .send({
          email: 'naoexiste@example.com',
          password: '123456'
        });

      expect(response.statusCode).toBe(404);
      expect(response.body.message).toBe('Game Master não encontrado!');
    });
  });

  describe('GET /api/game_master/:id', () => {

    it('deve retornar o game master por id com token válido', async () => {
      const { id } = await createGameMaster();
      const token = await loginGameMaster();

      const response = await request(app)
        .get(`/api/game_master/${id}`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.statusCode).toBe(201);
      expect(response.body).toHaveProperty('id', id);
    });

    it('deve retornar 401 se o token não for enviado', async () => {
      const { id } = await createGameMaster();

      const response = await request(app)
        .get(`/api/game_master/${id}`);

      expect(response.statusCode).toBe(401);
    });

    it('deve retornar 404 se o id não existir', async () => {
      await createGameMaster();
      const token = await loginGameMaster();

      const response = await request(app)
        .get(`/api/game_master/999999`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.statusCode).toBe(404);
      expect(response.body.message).toBe('Game Master não encontrado!');
    });
  });

});
