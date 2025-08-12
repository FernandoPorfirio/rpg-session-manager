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
  lore = 'Test player lore'
} = {}, token) {
  const response = await request(app)
    .post('/api/player')
    .set('Authorization', `Bearer ${token}`)
    .send({ name, classId, level, lore });

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

async function createGuildMember({
  guildId,
  playerId
} = {}, token) {
  const response = await request(app)
    .post('/api/guild_member')
    .set('Authorization', `Bearer ${token}`)
    .send({ guildId, playerId });

  return response.body;
}

beforeEach(async () => {
  // Clean up test data in the correct order due to foreign key constraints
  await db('guild_member').del();
  await db('guild').del();
  await db('player').del();
  await db('session').del();
  await db('class').del();
  await db('game_master').del();
});

afterAll(async () => {
  await db.destroy();
});

describe('Guild Member API', () => {

  describe('POST /api/guild_member', () => {

    it('deve criar um novo guild member', async () => {
      const gameMaster = await createGameMaster();
      const token = await loginGameMaster();
      const session = await createSession({}, token);
      const testClass = await createClass({ name: 'Guerreiro' });
      const player = await createPlayer({ 
        name: 'Test Player', 
        classId: testClass.id 
      }, token);
      const guild = await createGuild({ 
        name: 'Test Guild', 
        sessionId: session.id 
      }, token);

      const guildMemberData = {
        guildId: guild.id,
        playerId: player.id
      };

      const response = await request(app)
        .post('/api/guild_member')
        .set('Authorization', `Bearer ${token}`)
        .send(guildMemberData);

      expect(response.statusCode).toBe(201);
      expect(response.body).toHaveProperty('guild_id', guild.id);
      expect(response.body).toHaveProperty('player_id', player.id);
      expect(response.body).toHaveProperty('game_master_id', gameMaster.id);
      expect(response.body).toHaveProperty('id');
    });

    it('deve falhar se tentar adicionar o mesmo player à mesma guild novamente', async () => {
      await createGameMaster();
      const token = await loginGameMaster();
      const session = await createSession({}, token);
      const testClass = await createClass({ name: 'Guerreiro' });
      const player = await createPlayer({ 
        name: 'Test Player', 
        classId: testClass.id 
      }, token);
      const guild = await createGuild({ 
        name: 'Test Guild', 
        sessionId: session.id 
      }, token);

      // Criar o primeiro guild member
      await createGuildMember({
        guildId: guild.id,
        playerId: player.id
      }, token);

      // Tentar criar novamente
      const response = await request(app)
        .post('/api/guild_member')
        .set('Authorization', `Bearer ${token}`)
        .send({
          guildId: guild.id,
          playerId: player.id
        });

      expect(response.statusCode).toBe(400);
      expect(response.body.message).toBe('Player já é membro desta guild!');
    });

    it('deve falhar se não enviar o token de autenticação', async () => {
      const response = await request(app)
        .post('/api/guild_member')
        .send({
          guildId: 1,
          playerId: 1
        });

      expect(response.statusCode).toBe(401);
    });

    it('deve falhar se não enviar o guildId (campo obrigatório)', async () => {
      await createGameMaster();
      const token = await loginGameMaster();

      const response = await request(app)
        .post('/api/guild_member')
        .set('Authorization', `Bearer ${token}`)
        .send({
          playerId: 1
        });

      expect(response.statusCode).toBe(400);
    });

    it('deve falhar se não enviar o playerId (campo obrigatório)', async () => {
      await createGameMaster();
      const token = await loginGameMaster();

      const response = await request(app)
        .post('/api/guild_member')
        .set('Authorization', `Bearer ${token}`)
        .send({
          guildId: 1
        });

      expect(response.statusCode).toBe(400);
    });

    it('deve falhar se enviar guildId inválido', async () => {
      await createGameMaster();
      const token = await loginGameMaster();

      const response = await request(app)
        .post('/api/guild_member')
        .set('Authorization', `Bearer ${token}`)
        .send({
          guildId: -1,
          playerId: 1
        });

      expect(response.statusCode).toBe(400);
    });

    it('deve falhar se enviar playerId inválido', async () => {
      await createGameMaster();
      const token = await loginGameMaster();

      const response = await request(app)
        .post('/api/guild_member')
        .set('Authorization', `Bearer ${token}`)
        .send({
          guildId: 1,
          playerId: 0
        });

      expect(response.statusCode).toBe(400);
    });
  });

  describe('GET /api/guild_member/:id', () => {

    it('deve retornar um guild member por id com informações da guild e player', async () => {
      await createGameMaster();
      const token = await loginGameMaster();
      const session = await createSession({}, token);
      const testClass = await createClass({ name: 'Mago' });
      const player = await createPlayer({ 
        name: 'Test Player', 
        classId: testClass.id 
      }, token);
      const guild = await createGuild({ 
        name: 'Test Guild', 
        sessionId: session.id 
      }, token);

      const guildMember = await createGuildMember({
        guildId: guild.id,
        playerId: player.id
      }, token);

      const response = await request(app)
        .get(`/api/guild_member/${guildMember.id}`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty('id', guildMember.id);
      expect(response.body).toHaveProperty('guild_id', guild.id);
      expect(response.body).toHaveProperty('player_id', player.id);
      expect(response.body).toHaveProperty('guild_name', 'Test Guild'); // join com guild
      expect(response.body).toHaveProperty('player_name', 'Test Player'); // join com player
    });

    it('deve falhar se o guild member não existir', async () => {
      await createGameMaster();
      const token = await loginGameMaster();

      const response = await request(app)
        .get('/api/guild_member/999999')
        .set('Authorization', `Bearer ${token}`);

      expect(response.statusCode).toBe(404);
      expect(response.body.message).toBe('Membro da guild não encontrado!');
    });

    it('deve falhar se não enviar o token de autenticação', async () => {
      const response = await request(app)
        .get('/api/guild_member/1');

      expect(response.statusCode).toBe(401);
    });
  });

  describe('GET /api/guild_member', () => {

    it('deve retornar todos os guild members do game master', async () => {
      await createGameMaster();
      const token = await loginGameMaster();
      const session = await createSession({}, token);
      const testClass = await createClass();
      const guild = await createGuild({ 
        name: 'Test Guild', 
        sessionId: session.id 
      }, token);

      const player1 = await createPlayer({ 
        name: 'Player 1', 
        classId: testClass.id 
      }, token);
      const player2 = await createPlayer({ 
        name: 'Player 2', 
        classId: testClass.id 
      }, token);
      const player3 = await createPlayer({ 
        name: 'Player 3', 
        classId: testClass.id 
      }, token);

      await createGuildMember({ guildId: guild.id, playerId: player1.id }, token);
      await createGuildMember({ guildId: guild.id, playerId: player2.id }, token);
      await createGuildMember({ guildId: guild.id, playerId: player3.id }, token);

      const response = await request(app)
        .get('/api/guild_member')
        .set('Authorization', `Bearer ${token}`);

      expect(response.statusCode).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body).toHaveLength(3);
      expect(response.body[0]).toHaveProperty('guild_name');
      expect(response.body[0]).toHaveProperty('player_name');
      expect(response.body[0]).toHaveProperty('session_name');
      expect(response.body[0]).toHaveProperty('player_level');
      expect(response.body[0]).toHaveProperty('player_class');
    });

    it('deve filtrar guild members por guildId quando fornecido', async () => {
      await createGameMaster();
      const token = await loginGameMaster();
      const session = await createSession({}, token);
      const testClass = await createClass();
      
      const guild1 = await createGuild({ 
        name: 'Guild 1', 
        sessionId: session.id 
      }, token);
      const guild2 = await createGuild({ 
        name: 'Guild 2', 
        sessionId: session.id 
      }, token);

      const player1 = await createPlayer({ 
        name: 'Player 1', 
        classId: testClass.id 
      }, token);
      const player2 = await createPlayer({ 
        name: 'Player 2', 
        classId: testClass.id 
      }, token);

      await createGuildMember({ guildId: guild1.id, playerId: player1.id }, token);
      await createGuildMember({ guildId: guild2.id, playerId: player2.id }, token);

      const response = await request(app)
        .get(`/api/guild_member?guildId=${guild1.id}`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.statusCode).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body).toHaveLength(1);
      expect(response.body[0]).toHaveProperty('guild_name', 'Guild 1');
      expect(response.body[0]).toHaveProperty('player_name', 'Player 1');
    });

    it('deve filtrar guild members por sessionId quando fornecido', async () => {
      await createGameMaster();
      const token = await loginGameMaster();
      
      const session1 = await createSession({ name: 'Session 1' }, token);
      const session2 = await createSession({ name: 'Session 2' }, token);
      const testClass = await createClass();
      
      const guild1 = await createGuild({ 
        name: 'Guild 1', 
        sessionId: session1.id 
      }, token);
      const guild2 = await createGuild({ 
        name: 'Guild 2', 
        sessionId: session2.id 
      }, token);

      const player1 = await createPlayer({ 
        name: 'Player 1', 
        classId: testClass.id 
      }, token);
      const player2 = await createPlayer({ 
        name: 'Player 2', 
        classId: testClass.id 
      }, token);

      await createGuildMember({ guildId: guild1.id, playerId: player1.id }, token);
      await createGuildMember({ guildId: guild2.id, playerId: player2.id }, token);

      const response = await request(app)
        .get(`/api/guild_member?sessionId=${session1.id}`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.statusCode).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body).toHaveLength(1);
      expect(response.body[0]).toHaveProperty('session_name', 'Session 1');
      expect(response.body[0]).toHaveProperty('player_name', 'Player 1');
    });

    it('deve filtrar guild members por guildId e sessionId quando ambos fornecidos', async () => {
      await createGameMaster();
      const token = await loginGameMaster();
      
      const session1 = await createSession({ name: 'Session 1' }, token);
      const session2 = await createSession({ name: 'Session 2' }, token);
      const testClass = await createClass();
      
      const guild1 = await createGuild({ 
        name: 'Guild 1', 
        sessionId: session1.id 
      }, token);
      const guild2 = await createGuild({ 
        name: 'Guild 2', 
        sessionId: session2.id 
      }, token);

      const player1 = await createPlayer({ 
        name: 'Player 1', 
        classId: testClass.id 
      }, token);
      const player2 = await createPlayer({ 
        name: 'Player 2', 
        classId: testClass.id 
      }, token);

      await createGuildMember({ guildId: guild1.id, playerId: player1.id }, token);
      await createGuildMember({ guildId: guild2.id, playerId: player2.id }, token);

      const response = await request(app)
        .get(`/api/guild_member?guildId=${guild1.id}&sessionId=${session1.id}`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.statusCode).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body).toHaveLength(1);
      expect(response.body[0]).toHaveProperty('guild_name', 'Guild 1');
      expect(response.body[0]).toHaveProperty('session_name', 'Session 1');
      expect(response.body[0]).toHaveProperty('player_name', 'Player 1');
    });

    it('deve retornar array vazio se o game master não tiver guild members', async () => {
      await createGameMaster();
      const token = await loginGameMaster();

      const response = await request(app)
        .get('/api/guild_member')
        .set('Authorization', `Bearer ${token}`);

      expect(response.statusCode).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body).toHaveLength(0);
    });

    it('deve retornar apenas guild members não deletados', async () => {
      await createGameMaster();
      const token = await loginGameMaster();
      const session = await createSession({}, token);
      const testClass = await createClass();
      const guild = await createGuild({ 
        name: 'Test Guild', 
        sessionId: session.id 
      }, token);

      const player1 = await createPlayer({ 
        name: 'Player 1', 
        classId: testClass.id 
      }, token);
      const player2 = await createPlayer({ 
        name: 'Player 2', 
        classId: testClass.id 
      }, token);

      const guildMember1 = await createGuildMember({ guildId: guild.id, playerId: player1.id }, token);
      await createGuildMember({ guildId: guild.id, playerId: player2.id }, token);

      await request(app)
        .delete(`/api/guild_member/${guildMember1.id}`)
        .set('Authorization', `Bearer ${token}`);

      const response = await request(app)
        .get('/api/guild_member')
        .set('Authorization', `Bearer ${token}`);

      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveLength(1);
      expect(response.body[0]).toHaveProperty('player_name', 'Player 2');
    });

    it('deve falhar se não enviar o token de autenticação', async () => {
      const response = await request(app)
        .get('/api/guild_member');

      expect(response.statusCode).toBe(401);
    });
  });

  describe('DELETE /api/guild_member/:id', () => {

    it('deve deletar um guild member (soft delete)', async () => {
      await createGameMaster();
      const token = await loginGameMaster();
      const session = await createSession({}, token);
      const testClass = await createClass();
      const player = await createPlayer({ 
        name: 'Test Player', 
        classId: testClass.id 
      }, token);
      const guild = await createGuild({ 
        name: 'Test Guild', 
        sessionId: session.id 
      }, token);

      const guildMember = await createGuildMember({
        guildId: guild.id,
        playerId: player.id
      }, token);

      const response = await request(app)
        .delete(`/api/guild_member/${guildMember.id}`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.statusCode).toBe(204);

      const getResponse = await request(app)
        .get(`/api/guild_member/${guildMember.id}`)
        .set('Authorization', `Bearer ${token}`);

      expect(getResponse.statusCode).toBe(404);
    });

    it('deve falhar se o guild member não existir', async () => {
      await createGameMaster();
      const token = await loginGameMaster();

      const response = await request(app)
        .delete('/api/guild_member/999999')
        .set('Authorization', `Bearer ${token}`);

      expect(response.statusCode).toBe(404);
      expect(response.body.message).toBe('Membro da guild não encontrado!');
    });

    it('deve falhar se não enviar o token de autenticação', async () => {
      const response = await request(app)
        .delete('/api/guild_member/1');

      expect(response.statusCode).toBe(401);
    });
  });

  describe('Regras de negócio', () => {

    it('deve permitir que o mesmo player seja membro de guilds diferentes', async () => {
      await createGameMaster();
      const token = await loginGameMaster();
      const session = await createSession({}, token);
      const testClass = await createClass();
      const player = await createPlayer({ 
        name: 'Test Player', 
        classId: testClass.id 
      }, token);
      
      const guild1 = await createGuild({ 
        name: 'Guild 1', 
        sessionId: session.id 
      }, token);
      const guild2 = await createGuild({ 
        name: 'Guild 2', 
        sessionId: session.id 
      }, token);

      // Adicionar o player à primeira guild
      const response1 = await request(app)
        .post('/api/guild_member')
        .set('Authorization', `Bearer ${token}`)
        .send({
          guildId: guild1.id,
          playerId: player.id
        });

      expect(response1.statusCode).toBe(201);

      // Adicionar o mesmo player à segunda guild
      const response2 = await request(app)
        .post('/api/guild_member')
        .set('Authorization', `Bearer ${token}`)
        .send({
          guildId: guild2.id,
          playerId: player.id
        });

      expect(response2.statusCode).toBe(201);
    });

    it('deve permitir que uma guild tenha vários players', async () => {
      await createGameMaster();
      const token = await loginGameMaster();
      const session = await createSession({}, token);
      const testClass = await createClass();
      const guild = await createGuild({ 
        name: 'Test Guild', 
        sessionId: session.id 
      }, token);

      const player1 = await createPlayer({ 
        name: 'Player 1', 
        classId: testClass.id 
      }, token);
      const player2 = await createPlayer({ 
        name: 'Player 2', 
        classId: testClass.id 
      }, token);

      // Adicionar primeiro player
      const response1 = await request(app)
        .post('/api/guild_member')
        .set('Authorization', `Bearer ${token}`)
        .send({
          guildId: guild.id,
          playerId: player1.id
        });

      expect(response1.statusCode).toBe(201);

      // Adicionar segundo player
      const response2 = await request(app)
        .post('/api/guild_member')
        .set('Authorization', `Bearer ${token}`)
        .send({
          guildId: guild.id,
          playerId: player2.id
        });

      expect(response2.statusCode).toBe(201);
    });
  });

});
