const request = require('supertest');
const express = require('express');
const db = require('../config/db');
const { getTeacherStudents, updateTeacherShowcase } = require('../controllers/teacherController');

// Mock do banco de dados
jest.mock('../config/db');

const app = express();
app.use(express.json());

// Mock do middleware de autenticação (Simulando um Professor logado com ID 10)
app.use((req, res, next) => {
  req.user = { id: 10, role: 'professor' };
  next();
});

// Rotas simuladas para o teste
app.get('/api/teachers/students', getTeacherStudents);
app.put('/api/teachers/showcase', updateTeacherShowcase);

describe('Rotas de Professor (Teacher Scope - TeacherController)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/teachers/students', () => {
    it('Happy Path: Deve listar os alunos vinculados ao professor', async () => {
      db.query.mockResolvedValueOnce({
        rows: [{ id: 50, name: 'João Aluno', email: 'joao@teste.com' }]
      });

      const res = await request(app).get('/api/teachers/students');

      expect(res.statusCode).toEqual(200);
      expect(res.body.length).toBe(1);
      expect(res.body[0].name).toBe('João Aluno');
      expect(db.query).toHaveBeenCalledTimes(1);
    });

    it('Database Failure: Deve retornar erro 500 se o banco falhar ao buscar alunos', async () => {
      db.query.mockRejectedValueOnce(new Error('DB Error'));

      const res = await request(app).get('/api/teachers/students');

      expect(res.statusCode).toEqual(500);
    });
  });

  describe('PUT /api/teachers/showcase', () => {
    const showcasePayload = {
      specialty: 'Guitarra Clássica e Teoria',
      bio: 'Professor focado em iniciantes.',
      youtube_intro_url: 'https://youtube.com/watch?v=123',
      spotify_artist_url: '',
      offers_trial_lesson: true
    };

    it('Happy Path: Deve atualizar a vitrine do professor com sucesso', async () => {
      db.query.mockResolvedValueOnce({
        rows: [{ id: 10, ...showcasePayload }]
      });

      const res = await request(app)
        .put('/api/teachers/showcase')
        .send(showcasePayload);

      expect(res.statusCode).toEqual(200);
      expect(res.body.message).toBe('Vitrine atualizada com sucesso!');
      expect(res.body.data.specialty).toBe('Guitarra Clássica e Teoria');
    });

    it('Validation: Deve retornar 404 se o usuário no banco não for professor', async () => {
      db.query.mockResolvedValueOnce({ rows: [] }); // Update retorna vazio

      const res = await request(app)
        .put('/api/teachers/showcase')
        .send(showcasePayload);

      expect(res.statusCode).toEqual(404);
      expect(res.body.message).toMatch(/Professor não encontrado/);
    });
  });
});