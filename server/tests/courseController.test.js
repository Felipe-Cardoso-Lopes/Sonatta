process.env.JWT_SECRET = 'segredo-de-teste';
process.env.SUPABASE_URL = 'http://localhost';
process.env.SUPABASE_SERVICE_ROLE_KEY = 'dummy-key';

const request = require('supertest');
const { app } = require('../server');
const db = require('../config/db');
const jwt = require('jsonwebtoken');

jest.mock('../config/db', () => ({
  query: jest.fn(),
}));

describe('Course Controller Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const generateToken = (payload) => {
    return jwt.sign(payload, process.env.JWT_SECRET);
  };

  describe('Teacher Area', () => {
    const teacherToken = generateToken({ id: 10, role: 'professor' });

    describe('POST /api/courses/teacher', () => {
      it('deve criar um curso com sucesso', async () => {
        const coursePayload = { title: 'Piano Básico', description: 'Curso intro', instrument: 'Piano' };
        
        db.query.mockResolvedValueOnce({
          rows: [{ id: 1, ...coursePayload, teacher_id: 10 }]
        });

        const response = await request(app)
          .post('/api/courses/teacher')
          .set('Authorization', `Bearer ${teacherToken}`)
          .send(coursePayload);

        expect(response.status).toBe(201);
        expect(response.body.message).toBe('Curso criado com sucesso!');
        expect(response.body.course.title).toBe('Piano Básico');
        expect(db.query).toHaveBeenCalledWith(
          'INSERT INTO courses (title, description, instrument, teacher_id) VALUES ($1, $2, $3, $4) RETURNING *',
          ['Piano Básico', 'Curso intro', 'Piano', 10]
        );
      });

      it('deve retornar erro 500 se o db.query falhar', async () => {
        db.query.mockRejectedValueOnce(new Error('DB Error'));

        const response = await request(app)
          .post('/api/courses/teacher')
          .set('Authorization', `Bearer ${teacherToken}`)
          .send({ title: 'Piano Básico', description: 'Curso', instrument: 'Piano' });

        expect(response.status).toBe(500);
        expect(response.body.message).toBe('Erro ao criar curso no banco de dados.');
      });
    });

    describe('PUT /api/courses/:id', () => {
      it('deve retornar 403 se o professor não for dono do curso', async () => {
        db.query.mockResolvedValueOnce({ rows: [] }); // Curso não encontrado para este professor

        const response = await request(app)
          .put('/api/courses/1')
          .set('Authorization', `Bearer ${teacherToken}`)
          .send({ title: 'Violão' });

        expect(response.status).toBe(403);
        expect(response.body.message).toBe('Curso não encontrado ou sem permissão para editá-lo.');
      });

      it('deve atualizar o curso com sucesso se for dono', async () => {
        // Mock ownership check
        db.query.mockResolvedValueOnce({ rows: [{ id: 1, teacher_id: 10 }] });
        // Mock update
        db.query.mockResolvedValueOnce({ rows: [{ id: 1, title: 'Violão Avançado', description: 'Desc', instrument: 'Violão' }] });

        const response = await request(app)
          .put('/api/courses/1')
          .set('Authorization', `Bearer ${teacherToken}`)
          .send({ title: 'Violão Avançado', description: 'Desc', instrument: 'Violão' });

        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Curso atualizado com sucesso!');
        expect(response.body.course.title).toBe('Violão Avançado');
      });
    });

    describe('GET /api/courses/teacher', () => {
      it('deve retornar a lista de cursos do professor', async () => {
        db.query.mockResolvedValueOnce({ rows: [{ id: 1, title: 'Piano', students_count: 5 }] });

        const response = await request(app)
          .get('/api/courses/teacher')
          .set('Authorization', `Bearer ${teacherToken}`);

        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
        expect(response.body[0].title).toBe('Piano');
      });
    });

    describe('GET /api/courses/teacher/students', () => {
      it('deve retornar os alunos do professor', async () => {
        db.query.mockResolvedValueOnce({ rows: [{ id: 50, name: 'João', course_title: 'Piano' }] });

        const response = await request(app)
          .get('/api/courses/teacher/students')
          .set('Authorization', `Bearer ${teacherToken}`);

        expect(response.status).toBe(200);
        expect(response.body[0].name).toBe('João');
      });
    });
  });

  describe('Student Area', () => {
    const studentToken = generateToken({ id: 50, role: 'aluno' });

    describe('GET /api/courses/student', () => {
      it('deve retornar os cursos com is_enrolled para o aluno', async () => {
        db.query.mockResolvedValueOnce({ rows: [{ id: 1, title: 'Piano', is_enrolled: false }] });

        const response = await request(app)
          .get('/api/courses/student')
          .set('Authorization', `Bearer ${studentToken}`);

        expect(response.status).toBe(200);
        expect(response.body[0].title).toBe('Piano');
        expect(response.body[0].is_enrolled).toBe(false);
      });
    });

    describe('GET /api/courses/enrolled', () => {
      it('deve retornar cursos nos quais o aluno está matriculado', async () => {
        db.query.mockResolvedValueOnce({ rows: [{ id: 1, title: 'Bateria', progress: 50 }] });

        const response = await request(app)
          .get('/api/courses/enrolled')
          .set('Authorization', `Bearer ${studentToken}`);

        expect(response.status).toBe(200);
        expect(response.body[0].title).toBe('Bateria');
      });
    });

    describe('POST /api/courses/unenroll', () => {
      it('deve desmatricular o aluno com sucesso', async () => {
        db.query.mockResolvedValueOnce({ rowCount: 1 }); // Mock delete

        const response = await request(app)
          .post('/api/courses/unenroll')
          .set('Authorization', `Bearer ${studentToken}`)
          .send({ course_id: 1 });

        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Matrícula cancelada com sucesso.');
        expect(db.query).toHaveBeenCalledWith(
          'DELETE FROM enrollments WHERE user_id = $1 AND course_id = $2',
          [50, 1]
        );
      });

      it('deve retornar 500 se o db.query falhar no unenroll', async () => {
        db.query.mockRejectedValueOnce(new Error('DB Error'));

        const response = await request(app)
          .post('/api/courses/unenroll')
          .set('Authorization', `Bearer ${studentToken}`)
          .send({ course_id: 1 });

        expect(response.status).toBe(500);
        expect(response.body.message).toBe('Erro ao desmatricular.');
      });
    });
  });
});
