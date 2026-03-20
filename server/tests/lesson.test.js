const request = require('supertest');
const express = require('express');
const lessonRoutes = require('../routes/lessonRoutes');
const db = require('../config/db');

// Mock do banco de dados
jest.mock('../config/db');

// Mock do middleware de autenticação (simulando um professor logado com ID 1)
jest.mock('../middlewares/authMiddleware', () => ({
  protect: (req, res, next) => {
    req.user = { id: 1, role: 'professor' }; 
    next();
  }
}));

const app = express();
app.use(express.json());
app.use('/api/lessons', lessonRoutes);

describe('Rotas de Aulas (Lessons)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('Deve criar uma nova aula com sucesso (POST /api/lessons)', async () => {
    const novaAula = {
      title: 'Aula de Violão Iniciante',
      description: 'Acordes básicos e ritmo',
      instrument: 'Violão',
      lesson_date: '2026-03-25T14:00:00Z'
    };

    // Simulando o retorno de sucesso do Supabase
    db.query.mockResolvedValueOnce({
      rows: [{ id: 1, teacher_id: 1, ...novaAula, status: 'agendada' }]
    });

    const res = await request(app)
      .post('/api/lessons')
      .send(novaAula);

    expect(res.statusCode).toEqual(201);
    expect(res.body.message).toBe('Aula criada com sucesso!');
    expect(res.body.lesson.title).toBe('Aula de Violão Iniciante');
    expect(db.query).toHaveBeenCalledTimes(1);
  });

  it('Deve listar todas as aulas (GET /api/lessons)', async () => {
    // Simulando o retorno de uma lista de aulas do Supabase
    db.query.mockResolvedValueOnce({
      rows: [
        { id: 1, title: 'Aula de Violão Iniciante', teacher_name: 'Professor John' },
        { id: 2, title: 'Teoria Musical', teacher_name: 'Professor John' }
      ]
    });

    const res = await request(app).get('/api/lessons');

    expect(res.statusCode).toEqual(200);
    expect(res.body.length).toBe(2);
    expect(res.body[0].title).toBe('Aula de Violão Iniciante');
    expect(db.query).toHaveBeenCalledTimes(1);
  });
});