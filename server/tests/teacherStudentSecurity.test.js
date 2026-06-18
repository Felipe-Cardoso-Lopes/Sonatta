const request = require('supertest');
const { app } = require('../server');
const db = require('../config/db');
const jwt = require('jsonwebtoken');
const { suppressExpectedConsoleError } = require('./helpers/console');

jest.mock('../config/db', () => ({
  query: jest.fn(),
}));

describe('Teacher and Student Security Sprint Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const generateToken = (payload) => jwt.sign(payload, process.env.JWT_SECRET || 'secret');

  // Institution A Users
  const instA_id = 1;
  const teacherA_id = 10;
  const studentA_id = 100;
  const teacherAToken = generateToken({ id: teacherA_id, role: 'professor' });
  const studentAToken = generateToken({ id: studentA_id, role: 'aluno' });

  // Institution B Users
  const instB_id = 2;
  const teacherB_id = 20;
  const studentB_id = 200;
  const teacherBToken = generateToken({ id: teacherB_id, role: 'professor' });
  const studentBToken = generateToken({ id: studentB_id, role: 'aluno' });

  suppressExpectedConsoleError();

  describe('1. Authentication & Basic RBAC', () => {
    it('deve retornar 401 para endpoints sem token (Lesson API)', async () => {
      const response = await request(app).get('/api/lessons');
      expect(response.status).toBe(401);
    });

    it('deve retornar 401 para token inválido (Course API)', async () => {
      const response = await request(app)
        .post('/api/courses/student/enroll')
        .set('Authorization', 'Bearer invalidtoken');
      expect(response.status).toBe(401);
    });

    it('deve retornar 403 se student tentar acessar rotas de teacher', async () => {
      const response = await request(app)
        .post('/api/courses/teacher')
        .set('Authorization', `Bearer ${studentAToken}`)
        .send({ title: 'T', description: 'D', instrument: 'I' });
      expect(response.status).toBe(403);
    });

    it('deve retornar 403 se teacher tentar acessar rotas de student', async () => {
      const response = await request(app)
        .post('/api/courses/student/enroll')
        .set('Authorization', `Bearer ${teacherAToken}`)
        .send({ course_id: 1 });
      expect(response.status).toBe(403);
    });
  });

  describe('2. Multi-Tenant Isolation: Course List (Student)', () => {
    it('deve retornar APENAS os cursos da mesma instituição do aluno (getAllCoursesForStudent)', async () => {
      // O mock retornaria cursos de ambas instituições se a query fosse burra.
      // Vamos simular a nova query que buscará o instituicao_id do aluno primeiro (ou usará JOIN)
      db.query.mockResolvedValueOnce({
        rows: [
          { id: 1, title: 'Curso Inst A', teacher_id: teacherA_id, instituicao_id: instA_id }
        ]
      });

      const response = await request(app)
        .get('/api/courses/student')
        .set('Authorization', `Bearer ${studentAToken}`);

      expect(response.status).toBe(200);
      expect(db.query).toHaveBeenCalledWith(
        expect.stringContaining('WHERE u.instituicao_id ='),
        expect.any(Array)
      );
    });
  });

  describe('3. Multi-Tenant Isolation: Course Enrollment (Student)', () => {
    it('NÃO deve permitir que um aluno se matricule no curso de OUTRA instituição', async () => {
      // Mock 1: userCheck para o studentA (instituicao_id = 1)
      db.query.mockResolvedValueOnce({ rows: [{ instituicao_id: instA_id }] });

      // Mock 2: enrollment check (ainda não matriculado)
      db.query.mockResolvedValueOnce({ rows: [] });

      // Mock 3: Verifica se o curso pertence à mesma instituição! (DEVE FALHAR SE NÃO PERTENCER)
      // O controller atual não tem esse mock 3, ele vai direto pro INSERT, o que fará o teste falhar
      // Vamos assumir que a nova query fará esse check e retornará 0 linhas se for de outra inst.
      db.query.mockResolvedValueOnce({ rows: [] }); // Simula curso não encontrado ou não permitido

      const response = await request(app)
        .post('/api/courses/student/enroll')
        .set('Authorization', `Bearer ${studentAToken}`)
        .send({ course_id: 999 }); // Curso da Inst B

      expect(response.status).toBe(403);
      expect(response.body.message).toContain('Não é permitido'); // ou algo similar
    });
  });

  describe('4. Multi-Tenant Isolation: Get Lessons', () => {
    it('NÃO deve retornar todas as aulas globalmente (getLessons)', async () => {
      // O controller original simplesmente retornava TUDO:
      // SELECT l.*, u.name as teacher_name FROM lessons l JOIN users u ON l.teacher_id = u.id
      // O novo controller precisa filtrar pela instituicao do usuario logado
      
      db.query.mockResolvedValueOnce({ rows: [{ instituicao_id: instA_id }] }); // Obter a inst do usuario (se necessario)
      db.query.mockResolvedValueOnce({ rows: [] }); // As aulas retornadas

      const response = await request(app)
        .get('/api/lessons')
        .set('Authorization', `Bearer ${studentAToken}`);
        
      expect(response.status).toBe(200);
      // O teste de segurança verifica se a query enviada para o db possui cláusula de restrição
      expect(db.query.mock.calls[0][0]).toMatch(/instituicao_id/i);
    });
  });
});
