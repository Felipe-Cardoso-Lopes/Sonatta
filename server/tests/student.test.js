const request = require('supertest');
const express = require('express');
const db = require('../config/db');
const { 
  getUserProfile, 
  updateUserProfile, 
  completeRegistration, 
  saveMusicalPreferences 
} = require('../controllers/userController');

// Mock do banco de dados
jest.mock('../config/db');

const app = express();
app.use(express.json());

// Mock do middleware de autenticação (Simulando um Aluno logado com ID 50)
app.use((req, res, next) => {
  req.user = { id: 50, role: 'aluno' };
  next();
});

// Configuração das rotas para o teste
app.get('/api/users/profile', getUserProfile);
app.put('/api/users/profile', updateUserProfile);
app.put('/api/users/:id/complete', completeRegistration);
app.post('/api/users/preferences', saveMusicalPreferences);

describe('Rotas de Alunos (Student Scope - UserController)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/users/profile', () => {
    it('Happy Path: Deve retornar o perfil do aluno com sucesso', async () => {
      db.query.mockResolvedValueOnce({
        rows: [{ id: 50, name: 'João Aluno', email: 'joao@teste.com', role: 'aluno' }]
      });

      const res = await request(app).get('/api/users/profile');

      expect(res.statusCode).toEqual(200);
      expect(res.body.name).toBe('João Aluno');
      expect(db.query).toHaveBeenCalledTimes(1);
    });

    it('Validation: Deve retornar 404 se o aluno não for encontrado', async () => {
      db.query.mockResolvedValueOnce({ rows: [] });

      const res = await request(app).get('/api/users/profile');

      expect(res.statusCode).toEqual(404);
      expect(res.body.message).toBe('Usuário não encontrado.');
    });

    it('Database Failure: Deve retornar 500 se o banco falhar', async () => {
      db.query.mockRejectedValueOnce(new Error('Erro DB'));

      const res = await request(app).get('/api/users/profile');

      expect(res.statusCode).toEqual(500);
    });
  });

  describe('PUT /api/users/profile', () => {
    it('Happy Path: Deve atualizar o perfil do aluno com sucesso', async () => {
      db.query.mockResolvedValueOnce({
        rows: [{ id: 50, name: 'João Atualizado', nickname: 'Joaozinho' }]
      });

      const res = await request(app)
        .put('/api/users/profile')
        .send({ name: 'João Atualizado', nickname: 'Joaozinho' });

      expect(res.statusCode).toEqual(200);
      expect(res.body.message).toBe('Perfil atualizado com sucesso!');
      expect(res.body.user.name).toBe('João Atualizado');
    });

    it('Validation: Deve retornar 400 se o e-mail já estiver em uso (Erro 23505 do Postgres)', async () => {
      // Simulando o erro de violação de restrição única do PostgreSQL
      const dbError = new Error('Duplicate key');
      dbError.code = '23505';
      db.query.mockRejectedValueOnce(dbError);

      const res = await request(app)
        .put('/api/users/profile')
        .send({ email: 'email_usado@teste.com' });

      expect(res.statusCode).toEqual(400);
      expect(res.body.message).toBe('Este e-mail já está em uso por outra conta.');
    });
  });

  describe('PUT /api/users/:id/complete', () => {
    it('Happy Path: Deve finalizar o cadastro do aluno', async () => {
      db.query.mockResolvedValueOnce({
        rows: [{ id: 50, nickname: 'Jony', birth_date: '2000-01-01' }]
      });

      const res = await request(app)
        .put('/api/users/50/complete')
        .send({ nickname: 'Jony', birth_date: '2000-01-01' });

      expect(res.statusCode).toEqual(200);
      expect(res.body.message).toBe('Cadastro finalizado com sucesso!');
    });
  });

  describe('POST /api/users/preferences', () => {
    it('Happy Path: Deve salvar as preferências musicais do aluno', async () => {
      db.query.mockResolvedValueOnce({
        rows: [{ user_id: 50, nivel_musical: 'Iniciante', instrumentos: ['Violão'] }]
      });

      const res = await request(app)
        .post('/api/users/preferences')
        .send({ userId: 50, nivel: 'Iniciante', instrumentos: ['Violão'], generos: ['Rock'] });

      expect(res.statusCode).toEqual(200);
      expect(res.body.message).toBe('Preferências salvas com sucesso!');
    });

    it('Database Failure: Deve retornar 500 se o banco falhar ao salvar preferências', async () => {
      db.query.mockRejectedValueOnce(new Error('Erro DB'));

      const res = await request(app)
        .post('/api/users/preferences')
        .send({ userId: 50 });

      expect(res.statusCode).toEqual(500);
    });
  });
});