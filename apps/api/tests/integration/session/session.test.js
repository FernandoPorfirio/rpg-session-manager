require('dotenv').config({ path: '.env.test' });

const request = require('supertest');
const app = require('../../../src/app');
const db = require('../../../src/service/database/db');

async function createGameMaster({
  name = 'Test Game Master',
  email = 'gamemaster@example.com',
  password = '123456'
} = {}) {
  const response = await request(app)
    .post('/api/game_master')
    .send({ name, email, password });

  return response.body;
}

async function loginGameMaster({
  email = 'gamemaster@example.com',
  password = '123456'
} = {}) {
  const response = await request(app)
    .post('/api/game_master/login')
    .send({ email, password });

  return response.body.token;
}

async function createSession({
  name = 'Test Session',
  maxLevel = 10,
  lore = 'Test lore for the session'
} = {}, token) {
  const response = await request(app)
    .post('/api/session')
    .set('Authorization', `Bearer ${token}`)
    .send({ name, maxLevel, lore });

  return response.body;
}

beforeEach(async () => {
  // Clean up test data in the correct order due to foreign key constraints
  await db('session').del();
  await db('game_master').del();
});

afterAll(async () => {
  await db.destroy();
});

describe('Session API', () => {

  describe('POST /api/session', () => {

    it('deve criar uma nova session', async () => {
      const gameMaster = await createGameMaster();
      const token = await loginGameMaster();

      const sessionData = {
        name: 'Aventura Épica',
        maxLevel: 15,
        lore: 'Uma aventura épica nas terras místicas'
      };

      const response = await request(app)
        .post('/api/session')
        .set('Authorization', `Bearer ${token}`)
        .send(sessionData);

      expect(response.statusCode).toBe(201);
      expect(response.body).toHaveProperty('name', 'Aventura Épica');
      expect(response.body).toHaveProperty('max_level', 15);
      expect(response.body).toHaveProperty('lore', 'Uma aventura épica nas terras místicas');
      expect(response.body).toHaveProperty('game_master_id', gameMaster.id);
      expect(response.body).toHaveProperty('session_status_id', 1);
      expect(response.body).toHaveProperty('id');
    });

    it('deve criar uma session sem maxLevel e lore (campos opcionais)', async () => {
      await createGameMaster();
      const token = await loginGameMaster();

      const sessionData = {
        name: 'Session Simples'
      };

      const response = await request(app)
        .post('/api/session')
        .set('Authorization', `Bearer ${token}`)
        .send(sessionData);

      expect(response.statusCode).toBe(201);
      expect(response.body).toHaveProperty('name', 'Session Simples');
      expect(response.body).toHaveProperty('max_level', null);
      expect(response.body).toHaveProperty('lore', null);
    });

    it('deve falhar se não enviar o token de autenticação', async () => {
      const response = await request(app)
        .post('/api/session')
        .send({
          name: 'Test Session',
          maxLevel: 10
        });

      expect(response.statusCode).toBe(401);
    });

    it('deve falhar se não enviar o name (campo obrigatório)', async () => {
      await createGameMaster();
      const token = await loginGameMaster();

      const response = await request(app)
        .post('/api/session')
        .set('Authorization', `Bearer ${token}`)
        .send({
          maxLevel: 10,
          lore: 'Test lore'
        });

      expect(response.statusCode).toBe(400);
    });

    it('deve falhar se enviar name muito curto', async () => {
      await createGameMaster();
      const token = await loginGameMaster();

      const response = await request(app)
        .post('/api/session')
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: 'ab',
          maxLevel: 10
        });

      expect(response.statusCode).toBe(400);
    });
  });

  describe('PUT /api/session/:id', () => {

    it('deve atualizar uma session existente', async () => {
      await createGameMaster();
      const token = await loginGameMaster();
      const session = await createSession({}, token);

      const updateData = {
        name: 'Session Atualizada',
        maxLevel: 20,
        sessionStatusId: 2,
        lore: 'Lore atualizada'
      };

      const response = await request(app)
        .put(`/api/session/${session.id}`)
        .set('Authorization', `Bearer ${token}`)
        .send(updateData);

      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty('name', 'Session Atualizada');
      expect(response.body).toHaveProperty('max_level', 20);
      expect(response.body).toHaveProperty('session_status_id', 2);
      expect(response.body).toHaveProperty('lore', 'Lore atualizada');
      expect(response.body).toHaveProperty('started_at');
    });

    it('deve atualizar apenas os campos enviados', async () => {
      await createGameMaster();
      const token = await loginGameMaster();
      const session = await createSession({
        name: 'Nome Original',
        maxLevel: 10,
        lore: 'Lore Original'
      }, token);

      const updateData = {
        name: 'Novo Nome'
      };

      const response = await request(app)
        .put(`/api/session/${session.id}`)
        .set('Authorization', `Bearer ${token}`)
        .send(updateData);

      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty('name', 'Novo Nome');
      expect(response.body).toHaveProperty('max_level', 10);
      expect(response.body).toHaveProperty('lore', 'Lore Original');
    });

    it('deve definir finished_at quando status = 3', async () => {
      await createGameMaster();
      const token = await loginGameMaster();
      const session = await createSession({}, token);

      const response = await request(app)
        .put(`/api/session/${session.id}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ sessionStatusId: 3 });

      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty('session_status_id', 3);
      expect(response.body).toHaveProperty('finished_at');
      expect(response.body.finished_at).not.toBeNull();
    });

    it('deve falhar se a session não existir', async () => {
      await createGameMaster();
      const token = await loginGameMaster();

      const response = await request(app)
        .put('/api/session/999999')
        .set('Authorization', `Bearer ${token}`)
        .send({ name: 'Test' });

      expect(response.statusCode).toBe(404);
      expect(response.body.message).toBe('Session não encontrada!');
    });

    it('deve falhar se não enviar o token de autenticação', async () => {
      const response = await request(app)
        .put('/api/session/1')
        .send({ name: 'Test' });

      expect(response.statusCode).toBe(401);
    });
  });

  describe('GET /api/session/:id', () => {

    it('deve retornar uma session por id', async () => {
      await createGameMaster();
      const token = await loginGameMaster();
      const session = await createSession({
        name: 'Test Session',
        maxLevel: 12,
        lore: 'Test lore'
      }, token);

      const response = await request(app)
        .get(`/api/session/${session.id}`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty('id', session.id);
      expect(response.body).toHaveProperty('name', 'Test Session');
      expect(response.body).toHaveProperty('max_level', 12);
      expect(response.body).toHaveProperty('lore', 'Test lore');
      expect(response.body).toHaveProperty('status_name'); // join com session_status
    });

    it('deve falhar se a session não existir', async () => {
      await createGameMaster();
      const token = await loginGameMaster();

      const response = await request(app)
        .get('/api/session/999999')
        .set('Authorization', `Bearer ${token}`);

      expect(response.statusCode).toBe(404);
      expect(response.body.message).toBe('Session não encontrada!');
    });

    it('deve falhar se não enviar o token de autenticação', async () => {
      const response = await request(app)
        .get('/api/session/1');

      expect(response.statusCode).toBe(401);
    });
  });

  describe('GET /api/session', () => {

    it('deve retornar todas as sessions do game master', async () => {
      await createGameMaster();
      const token = await loginGameMaster();

      await createSession({ name: 'Session 1' }, token);
      await createSession({ name: 'Session 2' }, token);
      await createSession({ name: 'Session 3' }, token);

      const response = await request(app)
        .get('/api/session')
        .set('Authorization', `Bearer ${token}`);

      expect(response.statusCode).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body).toHaveLength(3);
      expect(response.body[0]).toHaveProperty('name');
      expect(response.body[0]).toHaveProperty('status_name');
    });

    it('deve retornar array vazio se o game master não tiver sessions', async () => {
      await createGameMaster();
      const token = await loginGameMaster();

      const response = await request(app)
        .get('/api/session')
        .set('Authorization', `Bearer ${token}`);

      expect(response.statusCode).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body).toHaveLength(0);
    });

    it('deve retornar apenas sessions não deletadas', async () => {
      await createGameMaster();
      const token = await loginGameMaster();

      const session1 = await createSession({ name: 'Session 1' }, token);
      await createSession({ name: 'Session 2' }, token);

      await request(app)
        .delete(`/api/session/${session1.id}`)
        .set('Authorization', `Bearer ${token}`);

      const response = await request(app)
        .get('/api/session')
        .set('Authorization', `Bearer ${token}`);

      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveLength(1);
      expect(response.body[0]).toHaveProperty('name', 'Session 2');
    });

    it('deve falhar se não enviar o token de autenticação', async () => {
      const response = await request(app)
        .get('/api/session');

      expect(response.statusCode).toBe(401);
    });
  });

  describe('DELETE /api/session/:id', () => {

    it('deve deletar uma session (soft delete)', async () => {
      await createGameMaster();
      const token = await loginGameMaster();
      const session = await createSession({}, token);

      const response = await request(app)
        .delete(`/api/session/${session.id}`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.statusCode).toBe(204);

      const getResponse = await request(app)
        .get(`/api/session/${session.id}`)
        .set('Authorization', `Bearer ${token}`);

      expect(getResponse.statusCode).toBe(404);
    });

    it('deve falhar se a session não existir', async () => {
      await createGameMaster();
      const token = await loginGameMaster();

      const response = await request(app)
        .delete('/api/session/999999')
        .set('Authorization', `Bearer ${token}`);

      expect(response.statusCode).toBe(404);
      expect(response.body.message).toBe('Session não encontrada!');
    });

    it('deve falhar se não enviar o token de autenticação', async () => {
      const response = await request(app)
        .delete('/api/session/1');

      expect(response.statusCode).toBe(401);
    });
  });

  describe('Validações específicas', () => {

    it('deve falhar com sessionStatusId inválido no update', async () => {
      await createGameMaster();
      const token = await loginGameMaster();
      const session = await createSession({}, token);

      const response = await request(app)
        .put(`/api/session/${session.id}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ sessionStatusId: 999 }); // ID inválido

      expect(response.statusCode).toBe(400);
    });

    it('deve falhar com maxLevel negativo', async () => {
      await createGameMaster();
      const token = await loginGameMaster();

      const response = await request(app)
        .post('/api/session')
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: 'Test Session',
          maxLevel: -1
        });

      expect(response.statusCode).toBe(400);
    });
  });

});
