const request = require('supertest');
const express = require('express');
const db = require('../config/db');
const {
  addAvailability,
  getTeacherAvailability,
  deleteAvailability,
  bookClass
} = require('../controllers/scheduleController');

// Mock do banco de dados
jest.mock('../config/db');

const app = express();
app.use(express.json());

// Mock do Socket.io para não quebrar o teste do agendamento
const emitMock = jest.fn();
const toMock = jest.fn(() => ({ emit: emitMock }));
app.set('io', { to: toMock });

// Middleware dinâmico para simular Usuários Diferentes
// Passaremos o ID pelo Header no teste para alternar entre Professor e Aluno
app.use((req, res, next) => {
  const userId = req.headers['x-user-id'] || 10; // Padrão: ID 10 (Professor)
  req.user = { id: parseInt(userId, 10) };
  next();
});

// Configuração das rotas para o teste
app.post('/api/schedule/availability', addAvailability);
app.get('/api/schedule/availability/:teacherId', getTeacherAvailability);
app.delete('/api/schedule/availability/:id', deleteAvailability);
app.post('/api/schedule/book', bookClass);

describe('Rotas de Agenda (Schedule Scope - ScheduleController)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/schedule/availability', () => {
    const payload = { day_of_week: 'Segunda-feira', start_time: '08:00', end_time: '12:00' };

    it('Happy Path: Deve adicionar um horário livre com sucesso', async () => {
      db.query.mockResolvedValueOnce({ rows: [] }); // overlapCheck retorna vazio (sem conflito)
      db.query.mockResolvedValueOnce({ rows: [{ id: 1, ...payload }] }); // Insert sucesso

      const res = await request(app)
        .post('/api/schedule/availability')
        .set('x-user-id', '10') // Logado como Professor
        .send(payload);

      expect(res.statusCode).toEqual(201);
      expect(res.body).toHaveProperty('id');
    });

    it('Business Rule: Deve retornar 400 se houver sobreposição de horário', async () => {
      db.query.mockResolvedValueOnce({ rows: [{ id: 1 }] }); // overlapCheck acha um conflito

      const res = await request(app)
        .post('/api/schedule/availability')
        .set('x-user-id', '10')
        .send(payload);

      expect(res.statusCode).toEqual(400);
      expect(res.body.message).toMatch(/conflito com uma disponibilidade já cadastrada/);
    });

    it('Database Failure: Deve retornar 500 se o banco falhar', async () => {
      db.query.mockRejectedValueOnce(new Error('Erro DB'));

      const res = await request(app)
        .post('/api/schedule/availability')
        .set('x-user-id', '10')
        .send(payload);

      expect(res.statusCode).toEqual(500);
    });
  });

  describe('GET /api/schedule/availability/:teacherId', () => {
    it('Happy Path: Deve listar as disponibilidades do professor', async () => {
      db.query.mockResolvedValueOnce({ rows: [{ id: 1, day_of_week: 'Segunda-feira' }] });

      const res = await request(app).get('/api/schedule/availability/10');

      expect(res.statusCode).toEqual(200);
      expect(res.body.length).toBeGreaterThan(0);
    });
  });

  describe('DELETE /api/schedule/availability/:id', () => {
    it('Happy Path: Deve remover o horário com sucesso', async () => {
      db.query.mockResolvedValueOnce({ rows: [{ id: 1 }] }); // Banco apaga a linha

      const res = await request(app)
        .delete('/api/schedule/availability/1')
        .set('x-user-id', '10');

      expect(res.statusCode).toEqual(200);
      expect(res.body.message).toBe('Horário removido com sucesso.');
    });

    it('Validation: Deve retornar 404 se o horário não existir ou não pertencer ao professor', async () => {
      db.query.mockResolvedValueOnce({ rows: [] }); // Banco não apaga nada

      const res = await request(app)
        .delete('/api/schedule/availability/99')
        .set('x-user-id', '10');

      expect(res.statusCode).toEqual(404);
    });
  });

  describe('POST /api/schedule/book (Ação do Aluno)', () => {
    const bookPayload = {
      teacher_id: 10,
      course_id: 2,
      appointment_date: '2026-05-10',
      start_time: '14:00',
      end_time: '15:00'
    };

    it('Happy Path: Deve agendar a aula com sucesso e emitir notificação no socket', async () => {
      db.query.mockResolvedValueOnce({ rows: [] }); // conflictCheck sem double booking
      db.query.mockResolvedValueOnce({ rows: [{ id: 100, status: 'confirmed' }] }); // Insert sucesso

      const res = await request(app)
        .post('/api/schedule/book')
        .set('x-user-id', '50') // Logado como Aluno
        .send(bookPayload);

      expect(res.statusCode).toEqual(201);
      expect(res.body.status).toBe('confirmed');
      
      // Valida se o sistema mandou a notificação para a "sala" correta do professor
      expect(toMock).toHaveBeenCalledWith('10'); 
      expect(emitMock).toHaveBeenCalledWith('new_appointment', expect.any(Object));
    });

    it('Business Rule: Deve retornar 400 se a aula tentar sobrepor um horário ocupado (Double Booking)', async () => {
      db.query.mockResolvedValueOnce({ rows: [{ id: 99 }] }); // Banco detectou que o horário está ocupado

      const res = await request(app)
        .post('/api/schedule/book')
        .set('x-user-id', '50')
        .send(bookPayload);

      expect(res.statusCode).toEqual(400);
      expect(res.body.message).toMatch(/já possui uma aula agendada/);
    });
  });
});