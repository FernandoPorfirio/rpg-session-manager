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
  lore = 'Test session lore'
} = {}, token) {
  const response = await request(app)
    .post('/api/session')
    .set('Authorization', `Bearer ${token}`)
    .send({ name, maxLevel, lore });

  return response.body;
}

async function createGuild({
  name = 'Test Guild',
  sessionId,
  lore = 'Test guild lore'
} = {}, token) {
  const response = await request(app)
    .post('/api/guild')
    .set('Authorization', `Bearer ${token}`)
    .send({ name, sessionId, lore });

  return response.body;
}

beforeEach(async () => {
  // Clean up test data in the correct order due to foreign key constraints
  await db('guild_member').del();
  await db('guild').del();
  await db('session').del();
  await db('game_master').del();
});

afterAll(async () => {
  await db.destroy();
});

describe('Guild API', () => {

  describe('POST /api/guild', () => {

    it('deve criar uma nova guild', async () => {
      const gameMaster = await createGameMaster();
      const token = await loginGameMaster();
      const session = await createSession({}, token);

      const guildData = {
        name: 'Os Corajosos',
        sessionId: session.id,
        lore: 'Uma guild de aventureiros corajosos'
      };

      const response = await request(app)
        .post('/api/guild')
        .set('Authorization', `Bearer ${token}`)
        .send(guildData);

      expect(response.statusCode).toBe(201);
      expect(response.body).toHaveProperty('name', 'Os Corajosos');
      expect(response.body).toHaveProperty('session_id', session.id);
      expect(response.body).toHaveProperty('lore', 'Uma guild de aventureiros corajosos');
      expect(response.body).toHaveProperty('game_master_id', gameMaster.id);
      expect(response.body).toHaveProperty('id');
    });

    it('deve criar uma guild sem lore (campo opcional)', async () => {
      await createGameMaster();
      const token = await loginGameMaster();
      const session = await createSession({}, token);

      const guildData = {
        name: 'Guild Simples',
        sessionId: session.id
      };

      const response = await request(app)
        .post('/api/guild')
        .set('Authorization', `Bearer ${token}`)
        .send(guildData);

      expect(response.statusCode).toBe(201);
      expect(response.body).toHaveProperty('name', 'Guild Simples');
      expect(response.body).toHaveProperty('lore', null);
    });

    it('deve falhar se não enviar o token de autenticação', async () => {
      const response = await request(app)
        .post('/api/guild')
        .send({
          name: 'Test Guild',
          sessionId: 1
        });

      expect(response.statusCode).toBe(401);
    });

    it('deve falhar se não enviar o name (campo obrigatório)', async () => {
      await createGameMaster();
      const token = await loginGameMaster();
      const session = await createSession({}, token);

      const response = await request(app)
        .post('/api/guild')
        .set('Authorization', `Bearer ${token}`)
        .send({
          sessionId: session.id,
          lore: 'Test lore'
        });

      expect(response.statusCode).toBe(400);
    });

    it('deve falhar se não enviar o sessionId (campo obrigatório)', async () => {
      await createGameMaster();
      const token = await loginGameMaster();

      const response = await request(app)
        .post('/api/guild')
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: 'Test Guild',
          lore: 'Test lore'
        });

      expect(response.statusCode).toBe(400);
    });

    it('deve falhar se enviar name muito curto', async () => {
      await createGameMaster();
      const token = await loginGameMaster();
      const session = await createSession({}, token);

      const response = await request(app)
        .post('/api/guild')
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: 'A',
          sessionId: session.id
        });

      expect(response.statusCode).toBe(400);
    });

    it('deve falhar se enviar sessionId inválido', async () => {
      await createGameMaster();
      const token = await loginGameMaster();

      const response = await request(app)
        .post('/api/guild')
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: 'Test Guild',
          sessionId: -1
        });

      expect(response.statusCode).toBe(400);
    });
  });

  describe('PUT /api/guild/:id', () => {

    it('deve atualizar uma guild existente (apenas name e lore)', async () => {
      await createGameMaster();
      const token = await loginGameMaster();
      const session = await createSession({}, token);

      const guild = await createGuild({
        name: 'Guild Original',
        sessionId: session.id,
        lore: 'Lore original'
      }, token);

      const updateData = {
        name: 'Guild Atualizada',
        lore: 'Lore atualizada'
      };

      const response = await request(app)
        .put(`/api/guild/${guild.id}`)
        .set('Authorization', `Bearer ${token}`)
        .send(updateData);

      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty('name', 'Guild Atualizada');
      expect(response.body).toHaveProperty('lore', 'Lore atualizada');
      expect(response.body).toHaveProperty('session_id', session.id); // sessionId não deve mudar
    });

    it('deve falhar se a guild não existir', async () => {
      await createGameMaster();
      const token = await loginGameMaster();

      const response = await request(app)
        .put('/api/guild/999999')
        .set('Authorization', `Bearer ${token}`)
        .send({ name: 'Test' });

      expect(response.statusCode).toBe(404);
      expect(response.body.message).toBe('Guild não encontrada!');
    });

    it('deve falhar se não enviar o token de autenticação', async () => {
      const response = await request(app)
        .put('/api/guild/1')
        .send({ name: 'Test' });

      expect(response.statusCode).toBe(401);
    });
  });

  describe('GET /api/guild/:id', () => {

    it('deve retornar uma guild por id com informações da session', async () => {
      await createGameMaster();
      const token = await loginGameMaster();
      const session = await createSession({ name: 'Session Teste' }, token);

      const guild = await createGuild({
        name: 'Test Guild',
        sessionId: session.id,
        lore: 'Test lore'
      }, token);

      const response = await request(app)
        .get(`/api/guild/${guild.id}`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty('id', guild.id);
      expect(response.body).toHaveProperty('name', 'Test Guild');
      expect(response.body).toHaveProperty('session_id', session.id);
      expect(response.body).toHaveProperty('lore', 'Test lore');
      expect(response.body).toHaveProperty('session_name', 'Session Teste'); // join com session
    });

    it('deve falhar se a guild não existir', async () => {
      await createGameMaster();
      const token = await loginGameMaster();

      const response = await request(app)
        .get('/api/guild/999999')
        .set('Authorization', `Bearer ${token}`);

      expect(response.statusCode).toBe(404);
      expect(response.body.message).toBe('Guild não encontrada!');
    });

    it('deve falhar se não enviar o token de autenticação', async () => {
      const response = await request(app)
        .get('/api/guild/1');

      expect(response.statusCode).toBe(401);
    });
  });

  describe('GET /api/guild', () => {

    it('deve retornar todas as guilds do game master', async () => {
      await createGameMaster();
      const token = await loginGameMaster();
      const session = await createSession({}, token);

      await createGuild({ name: 'Guild 1', sessionId: session.id }, token);
      await createGuild({ name: 'Guild 2', sessionId: session.id }, token);
      await createGuild({ name: 'Guild 3', sessionId: session.id }, token);

      const response = await request(app)
        .get('/api/guild')
        .set('Authorization', `Bearer ${token}`);

      expect(response.statusCode).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body).toHaveLength(3);
      expect(response.body[0]).toHaveProperty('name');
      expect(response.body[0]).toHaveProperty('session_name');
    });

    it('deve retornar array vazio se o game master não tiver guilds', async () => {
      await createGameMaster();
      const token = await loginGameMaster();

      const response = await request(app)
        .get('/api/guild')
        .set('Authorization', `Bearer ${token}`);

      expect(response.statusCode).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body).toHaveLength(0);
    });

    it('deve retornar apenas guilds não deletadas', async () => {
      await createGameMaster();
      const token = await loginGameMaster();
      const session = await createSession({}, token);

      const guild1 = await createGuild({ name: 'Guild 1', sessionId: session.id }, token);
      await createGuild({ name: 'Guild 2', sessionId: session.id }, token);

      await request(app)
        .delete(`/api/guild/${guild1.id}`)
        .set('Authorization', `Bearer ${token}`);

      const response = await request(app)
        .get('/api/guild')
        .set('Authorization', `Bearer ${token}`);

      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveLength(1);
      expect(response.body[0]).toHaveProperty('name', 'Guild 2');
    });

    it('deve falhar se não enviar o token de autenticação', async () => {
      const response = await request(app)
        .get('/api/guild');

      expect(response.statusCode).toBe(401);
    });
  });

  describe('DELETE /api/guild/:id', () => {

    it('deve deletar uma guild (soft delete)', async () => {
      await createGameMaster();
      const token = await loginGameMaster();
      const session = await createSession({}, token);
      const guild = await createGuild({ sessionId: session.id }, token);

      const response = await request(app)
        .delete(`/api/guild/${guild.id}`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.statusCode).toBe(204);

      const getResponse = await request(app)
        .get(`/api/guild/${guild.id}`)
        .set('Authorization', `Bearer ${token}`);

      expect(getResponse.statusCode).toBe(404);
    });

    it('deve falhar se a guild não existir', async () => {
      await createGameMaster();
      const token = await loginGameMaster();

      const response = await request(app)
        .delete('/api/guild/999999')
        .set('Authorization', `Bearer ${token}`);

      expect(response.statusCode).toBe(404);
      expect(response.body.message).toBe('Guild não encontrada!');
    });

    it('deve falhar se não enviar o token de autenticação', async () => {
      const response = await request(app)
        .delete('/api/guild/1');

      expect(response.statusCode).toBe(401);
    });
  });

  describe('Validações específicas', () => {

    it('deve falhar com sessionId inválido', async () => {
      await createGameMaster();
      const token = await loginGameMaster();

      const response = await request(app)
        .post('/api/guild')
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: 'Test Guild',
          sessionId: 0
        });

      expect(response.statusCode).toBe(400);
    });

    it('deve falhar com name muito longo', async () => {
      await createGameMaster();
      const token = await loginGameMaster();
      const session = await createSession({}, token);

      const longName = 'a'.repeat(101);

      const response = await request(app)
        .post('/api/guild')
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: longName,
          sessionId: session.id
        });

      expect(response.statusCode).toBe(400);
    });

    it('deve falhar com lore muito longa', async () => {
      await createGameMaster();
      const token = await loginGameMaster();
      const session = await createSession({}, token);

      const longLore = 'a'.repeat(2001);

      const response = await request(app)
        .post('/api/guild')
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: 'Test Guild',
          sessionId: session.id,
          lore: longLore
        });

      expect(response.statusCode).toBe(400);
    });
  });

});
