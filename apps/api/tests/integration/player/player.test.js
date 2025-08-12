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

async function createClass({
  name = 'Test Class'
} = {}) {
  const result = await db('class')
    .insert({ name })
    .returning(['id', 'name']);

  return result[0];
}

async function createPlayer({
  name = 'Test Player',
  classId,
  level = 1,
  lore = 'Test lore for the player'
} = {}, token) {
  const response = await request(app)
    .post('/api/player')
    .set('Authorization', `Bearer ${token}`)
    .send({ name, classId, level, lore });

  return response.body;
}

beforeEach(async () => {
  // Clean up test data in the correct order due to foreign key constraints
  await db('guild_member').del();
  await db('guild').del();
  await db('player').del();
  await db('class').del();
  await db('game_master').del();
});

afterAll(async () => {
  await db.destroy();
});

describe('Player API', () => {

  describe('POST /api/player', () => {

    it('deve criar um novo player', async () => {
      const gameMaster = await createGameMaster();
      const token = await loginGameMaster();
      const testClass = await createClass({ name: 'Guerreiro' });

      const playerData = {
        name: 'Aragorn',
        classId: testClass.id,
        level: 10,
        lore: 'Um ranger do norte, herdeiro do trono de Gondor'
      };

      const response = await request(app)
        .post('/api/player')
        .set('Authorization', `Bearer ${token}`)
        .send(playerData);

      expect(response.statusCode).toBe(201);
      expect(response.body).toHaveProperty('name', 'Aragorn');
      expect(response.body).toHaveProperty('class_id', testClass.id);
      expect(response.body).toHaveProperty('level', 10);
      expect(response.body).toHaveProperty('lore', 'Um ranger do norte, herdeiro do trono de Gondor');
      expect(response.body).toHaveProperty('game_master_id', gameMaster.id);
      expect(response.body).toHaveProperty('id');
    });

    it('deve criar um player com level padrão 1', async () => {
      await createGameMaster();
      const token = await loginGameMaster();
      const testClass = await createClass({ name: 'Mago' });

      const playerData = {
        name: 'Gandalf',
        classId: testClass.id,
        lore: 'Um mago cinzento'
      };

      const response = await request(app)
        .post('/api/player')
        .set('Authorization', `Bearer ${token}`)
        .send(playerData);

      expect(response.statusCode).toBe(201);
      expect(response.body).toHaveProperty('name', 'Gandalf');
      expect(response.body).toHaveProperty('level', 1);
    });

    it('deve criar um player sem lore (campo opcional)', async () => {
      await createGameMaster();
      const token = await loginGameMaster();
      const testClass = await createClass({ name: 'Arqueiro' });

      const playerData = {
        name: 'Legolas',
        classId: testClass.id,
        level: 15
      };

      const response = await request(app)
        .post('/api/player')
        .set('Authorization', `Bearer ${token}`)
        .send(playerData);

      expect(response.statusCode).toBe(201);
      expect(response.body).toHaveProperty('name', 'Legolas');
      expect(response.body).toHaveProperty('lore', null);
    });

    it('deve falhar se não enviar o token de autenticação', async () => {
      const testClass = await createClass();

      const response = await request(app)
        .post('/api/player')
        .send({
          name: 'Test Player',
          classId: testClass.id
        });

      expect(response.statusCode).toBe(401);
    });

    it('deve falhar se não enviar o name (campo obrigatório)', async () => {
      await createGameMaster();
      const token = await loginGameMaster();
      const testClass = await createClass();

      const response = await request(app)
        .post('/api/player')
        .set('Authorization', `Bearer ${token}`)
        .send({
          classId: testClass.id,
          level: 10
        });

      expect(response.statusCode).toBe(400);
    });

    it('deve falhar se não enviar o classId (campo obrigatório)', async () => {
      await createGameMaster();
      const token = await loginGameMaster();

      const response = await request(app)
        .post('/api/player')
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: 'Test Player',
          level: 10
        });

      expect(response.statusCode).toBe(400);
    });

    it('deve falhar se enviar name muito curto', async () => {
      await createGameMaster();
      const token = await loginGameMaster();
      const testClass = await createClass();

      const response = await request(app)
        .post('/api/player')
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: 'A',
          classId: testClass.id
        });

      expect(response.statusCode).toBe(400);
    });

    it('deve falhar se enviar level inválido', async () => {
      await createGameMaster();
      const token = await loginGameMaster();
      const testClass = await createClass();

      const response = await request(app)
        .post('/api/player')
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: 'Test Player',
          classId: testClass.id,
          level: 0
        });

      expect(response.statusCode).toBe(400);
    });
  });

  describe('PUT /api/player/:id', () => {

    it('deve atualizar um player existente', async () => {
      await createGameMaster();
      const token = await loginGameMaster();
      const testClass1 = await createClass({ name: 'Guerreiro' });
      const testClass2 = await createClass({ name: 'Paladino' });

      const player = await createPlayer({
        name: 'Test Player',
        classId: testClass1.id,
        level: 5
      }, token);

      const updateData = {
        name: 'Updated Player',
        classId: testClass2.id,
        level: 10,
        lore: 'Updated lore'
      };

      const response = await request(app)
        .put(`/api/player/${player.id}`)
        .set('Authorization', `Bearer ${token}`)
        .send(updateData);

      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty('name', 'Updated Player');
      expect(response.body).toHaveProperty('class_id', testClass2.id);
      expect(response.body).toHaveProperty('level', 10);
      expect(response.body).toHaveProperty('lore', 'Updated lore');
    });

    it('deve atualizar apenas os campos enviados', async () => {
      await createGameMaster();
      const token = await loginGameMaster();
      const testClass = await createClass();

      const player = await createPlayer({
        name: 'Original Name',
        classId: testClass.id,
        level: 5,
        lore: 'Original Lore'
      }, token);

      const updateData = {
        name: 'New Name'
      };

      const response = await request(app)
        .put(`/api/player/${player.id}`)
        .set('Authorization', `Bearer ${token}`)
        .send(updateData);

      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty('name', 'New Name');
      expect(response.body).toHaveProperty('class_id', testClass.id);
      expect(response.body).toHaveProperty('level', 5);
      expect(response.body).toHaveProperty('lore', 'Original Lore');
    });

    it('deve falhar se o player não existir', async () => {
      await createGameMaster();
      const token = await loginGameMaster();

      const response = await request(app)
        .put('/api/player/999999')
        .set('Authorization', `Bearer ${token}`)
        .send({ name: 'Test' });

      expect(response.statusCode).toBe(404);
      expect(response.body.message).toBe('Player não encontrado!');
    });

    it('deve falhar se não enviar o token de autenticação', async () => {
      const response = await request(app)
        .put('/api/player/1')
        .send({ name: 'Test' });

      expect(response.statusCode).toBe(401);
    });
  });

  describe('GET /api/player/:id', () => {

    it('deve retornar um player por id com informações da classe', async () => {
      await createGameMaster();
      const token = await loginGameMaster();
      const testClass = await createClass({ name: 'Clérigo' });

      const player = await createPlayer({
        name: 'Test Player',
        classId: testClass.id,
        level: 12,
        lore: 'Test lore'
      }, token);

      const response = await request(app)
        .get(`/api/player/${player.id}`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty('id', player.id);
      expect(response.body).toHaveProperty('name', 'Test Player');
      expect(response.body).toHaveProperty('class_id', testClass.id);
      expect(response.body).toHaveProperty('level', 12);
      expect(response.body).toHaveProperty('lore', 'Test lore');
      expect(response.body).toHaveProperty('class_name', 'Clérigo');
    });

    it('deve falhar se o player não existir', async () => {
      await createGameMaster();
      const token = await loginGameMaster();

      const response = await request(app)
        .get('/api/player/999999')
        .set('Authorization', `Bearer ${token}`);

      expect(response.statusCode).toBe(404);
      expect(response.body.message).toBe('Player não encontrado!');
    });

    it('deve falhar se não enviar o token de autenticação', async () => {
      const response = await request(app)
        .get('/api/player/1');

      expect(response.statusCode).toBe(401);
    });
  });

  describe('GET /api/player', () => {

    it('deve retornar todos os players do game master', async () => {
      await createGameMaster();
      const token = await loginGameMaster();
      const testClass = await createClass();

      await createPlayer({ name: 'Player 1', classId: testClass.id }, token);
      await createPlayer({ name: 'Player 2', classId: testClass.id }, token);
      await createPlayer({ name: 'Player 3', classId: testClass.id }, token);

      const response = await request(app)
        .get('/api/player')
        .set('Authorization', `Bearer ${token}`);

      expect(response.statusCode).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body).toHaveLength(3);
      expect(response.body[0]).toHaveProperty('name');
      expect(response.body[0]).toHaveProperty('class_name');
    });

    it('deve retornar array vazio se o game master não tiver players', async () => {
      await createGameMaster();
      const token = await loginGameMaster();

      const response = await request(app)
        .get('/api/player')
        .set('Authorization', `Bearer ${token}`);

      expect(response.statusCode).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body).toHaveLength(0);
    });

    it('deve retornar apenas players não deletados', async () => {
      await createGameMaster();
      const token = await loginGameMaster();
      const testClass = await createClass();

      const player1 = await createPlayer({ name: 'Player 1', classId: testClass.id }, token);
      await createPlayer({ name: 'Player 2', classId: testClass.id }, token);

      await request(app)
        .delete(`/api/player/${player1.id}`)
        .set('Authorization', `Bearer ${token}`);

      const response = await request(app)
        .get('/api/player')
        .set('Authorization', `Bearer ${token}`);

      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveLength(1);
      expect(response.body[0]).toHaveProperty('name', 'Player 2');
    });

    it('deve filtrar players por sessionId quando fornecido', async () => {
      await createGameMaster();
      const token = await loginGameMaster();
      const testClass = await createClass();

      await createPlayer({ name: 'Player 1', classId: testClass.id }, token);
      await createPlayer({ name: 'Player 2', classId: testClass.id }, token);

      const response = await request(app)
        .get('/api/player?sessionId=1')
        .set('Authorization', `Bearer ${token}`);

      expect(response.statusCode).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });

    it('deve filtrar players por guildId quando fornecido', async () => {
      await createGameMaster();
      const token = await loginGameMaster();
      const testClass = await createClass();

      await createPlayer({ name: 'Player 1', classId: testClass.id }, token);

      const response = await request(app)
        .get('/api/player?guildId=1')
        .set('Authorization', `Bearer ${token}`);

      expect(response.statusCode).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });

    it('deve filtrar players por sessionId e guildId quando ambos fornecidos', async () => {
      await createGameMaster();
      const token = await loginGameMaster();
      const testClass = await createClass();

      await createPlayer({ name: 'Player 1', classId: testClass.id }, token);

      const response = await request(app)
        .get('/api/player?sessionId=1&guildId=1')
        .set('Authorization', `Bearer ${token}`);

      expect(response.statusCode).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });

    it('deve falhar se não enviar o token de autenticação', async () => {
      const response = await request(app)
        .get('/api/player');

      expect(response.statusCode).toBe(401);
    });
  });

  describe('DELETE /api/player/:id', () => {

    it('deve deletar um player', async () => {
      await createGameMaster();
      const token = await loginGameMaster();
      const testClass = await createClass();
      const player = await createPlayer({ classId: testClass.id }, token);

      const response = await request(app)
        .delete(`/api/player/${player.id}`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.statusCode).toBe(204);

      const getResponse = await request(app)
        .get(`/api/player/${player.id}`)
        .set('Authorization', `Bearer ${token}`);

      expect(getResponse.statusCode).toBe(404);
    });

    it('deve falhar se o player não existir', async () => {
      await createGameMaster();
      const token = await loginGameMaster();

      const response = await request(app)
        .delete('/api/player/999999')
        .set('Authorization', `Bearer ${token}`);

      expect(response.statusCode).toBe(404);
      expect(response.body.message).toBe('Player não encontrado!');
    });

    it('deve falhar se não enviar o token de autenticação', async () => {
      const response = await request(app)
        .delete('/api/player/1');

      expect(response.statusCode).toBe(401);
    });
  });

  describe('Validações específicas', () => {

    it('deve falhar com classId inválido', async () => {
      await createGameMaster();
      const token = await loginGameMaster();

      const response = await request(app)
        .post('/api/player')
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: 'Test Player',
          classId: -1
        });

      expect(response.statusCode).toBe(400);
    });

    it('deve falhar com level maior que 100', async () => {
      await createGameMaster();
      const token = await loginGameMaster();
      const testClass = await createClass();

      const response = await request(app)
        .post('/api/player')
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: 'Test Player',
          classId: testClass.id,
          level: 101
        });

      expect(response.statusCode).toBe(400);
    });

    it('deve falhar com name muito longo', async () => {
      await createGameMaster();
      const token = await loginGameMaster();
      const testClass = await createClass();

      const longName = 'a'.repeat(101);

      const response = await request(app)
        .post('/api/player')
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: longName,
          classId: testClass.id
        });

      expect(response.statusCode).toBe(400);
    });

    it('deve falhar com lore muito longa', async () => {
      await createGameMaster();
      const token = await loginGameMaster();
      const testClass = await createClass();

      const longLore = 'a'.repeat(2001);

      const response = await request(app)
        .post('/api/player')
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: 'Test Player',
          classId: testClass.id,
          lore: longLore
        });

      expect(response.statusCode).toBe(400);
    });
  });

});
