require('dotenv').config({ path: '.env.test' });

const request = require('supertest');
const app = require('../../../src/app');
const db = require('../../../src/service/database/db');

beforeEach(async () => {
  // Reset class table to seed data
  await db('class').del();
  await db('class').insert([
    { name: 'Guerreiro' },
    { name: 'Mago' },
    { name: 'Arqueiro' },
    { name: 'Clérigo' },
  ]);
});

afterAll(async () => {
  await db.destroy();
});

describe('Class API', () => {

  describe('GET /api/class', () => {

    it('deve retornar todas as classes disponíveis', async () => {
      const response = await request(app)
        .get('/api/class');

      expect(response.statusCode).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body).toHaveLength(4);

      expect(response.body[0]).toHaveProperty('name', 'Arqueiro');
      expect(response.body[1]).toHaveProperty('name', 'Clérigo');
      expect(response.body[2]).toHaveProperty('name', 'Guerreiro');
      expect(response.body[3]).toHaveProperty('name', 'Mago');

      response.body.forEach(classItem => {
        expect(classItem).toHaveProperty('id');
        expect(classItem).toHaveProperty('name');
        expect(typeof classItem.id).toBe('number');
        expect(typeof classItem.name).toBe('string');
      });
    });

    it('deve retornar array vazio se não existirem classes', async () => {
      await db('class').del();

      const response = await request(app)
        .get('/api/class');

      expect(response.statusCode).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body).toHaveLength(0);
    });

  });

  describe('GET /api/class/:id', () => {

    it('deve retornar uma classe específica por id', async () => {
      // Busca uma classe existente para usar seu ID
      const classes = await db('class').select('*');
      const firstClass = classes[0];

      const response = await request(app)
        .get(`/api/class/${firstClass.id}`);

      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty('id', firstClass.id);
      expect(response.body).toHaveProperty('name', firstClass.name);
    });

    it('deve retornar erro 404 se a classe não existir', async () => {
      const response = await request(app)
        .get('/api/class/-999999');

      expect(response.statusCode).toBe(404);
      expect(response.body).toHaveProperty('message', 'Classe não encontrada!');
    });
  });
});
