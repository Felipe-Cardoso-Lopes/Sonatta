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

  const teacherToken = generateToken({ id: 10, role: 'professor' });
  const studentToken = generateToken({ id: 50, role: 'aluno' });

  describe('RBAC & Auth Verification', () => {
    it('deve retornar 401 se nenhum token for fornecido', async () => {
      const response = await request(app).get('/api/courses/teacher');
      expect(response.status).toBe(401);
      expect(response.body.message).toBe('Não autorizado, nenhum token fornecido.');
    });

    it('deve retornar 401 se o token for inválido', async () => {
      const response = await request(app)
        .get('/api/courses/teacher')
        .set('Authorization', 'Bearer token_invalido_123');
      expect(response.status).toBe(401);
      expect(response.body.message).toBe('Não autorizado, token inválido ou expirado.');
    });

    it('deve retornar 403 quando aluno acessa rota de professor', async () => {
      const response = await request(app)
        .post('/api/courses/teacher')
        .set('Authorization', `Bearer ${studentToken}`)
        .send({ title: 'T', description: 'D', instrument: 'I' });
      expect(response.status).toBe(403);
      expect(response.body.message).toBe('Acesso negado: privilégios insuficientes.');
    });

    it('deve retornar 403 quando professor acessa rota de aluno', async () => {
      const response = await request(app)
        .post('/api/courses/student/enroll')
        .set('Authorization', `Bearer ${teacherToken}`)
        .send({ course_id: 1 });
      expect(response.status).toBe(403);
      expect(response.body.message).toBe('Acesso negado: privilégios insuficientes.');
    });
  });

  describe('Teacher Area', () => {
    describe('POST /api/courses/teacher', () => {
      it('deve retornar 400 se campos obrigatórios faltarem', async () => {
        const response = await request(app)
          .post('/api/courses/teacher')
          .set('Authorization', `Bearer ${teacherToken}`)
          .send({ title: 'Apenas título' });

        expect(response.status).toBe(400);
        expect(response.body.message).toBe('Todos os campos (title, description, instrument) são obrigatórios.');
      });

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
      });

      it('deve retornar erro 500 se o db.query falhar', async () => {
        db.query.mockRejectedValueOnce(new Error('DB Error'));

        const response = await request(app)
          .post('/api/courses/teacher')
          .set('Authorization', `Bearer ${teacherToken}`)
          .send({ title: 'Piano Básico', description: 'Curso', instrument: 'Piano' });

        expect(response.status).toBe(500);
      });
    });

    describe('PUT /api/courses/:id', () => {
      it('deve retornar 400 se ID não for numérico', async () => {
        const response = await request(app)
          .put('/api/courses/abc')
          .set('Authorization', `Bearer ${teacherToken}`)
          .send({ title: 'V', description: 'D', instrument: 'I' });

        expect(response.status).toBe(400);
        expect(response.body.message).toBe('O ID do curso deve ser um número válido.');
      });

      it('deve retornar 400 se campos faltarem na edição', async () => {
        const response = await request(app)
          .put('/api/courses/1')
          .set('Authorization', `Bearer ${teacherToken}`)
          .send({ title: 'Falta resto' });

        expect(response.status).toBe(400);
        expect(response.body.message).toBe('Todos os campos (title, description, instrument) são obrigatórios.');
      });

      it('deve retornar 403 se o professor não for dono do curso', async () => {
        db.query.mockResolvedValueOnce({ rows: [] }); // ownership check

        const response = await request(app)
          .put('/api/courses/1')
          .set('Authorization', `Bearer ${teacherToken}`)
          .send({ title: 'Violão', description: 'D', instrument: 'V' });

        expect(response.status).toBe(403);
      });

      it('deve atualizar o curso com sucesso se for dono', async () => {
        db.query.mockResolvedValueOnce({ rows: [{ id: 1, teacher_id: 10 }] }); // check
        db.query.mockResolvedValueOnce({ rows: [{ id: 1, title: 'Violão Avançado', description: 'Desc', instrument: 'Violão' }] }); // update

        const response = await request(app)
          .put('/api/courses/1')
          .set('Authorization', `Bearer ${teacherToken}`)
          .send({ title: 'Violão Avançado', description: 'Desc', instrument: 'Violão' });

        expect(response.status).toBe(200);
        expect(response.body.course.title).toBe('Violão Avançado');
      });

      it('deve retornar 500 se o DB falhar na atualização', async () => {
        db.query.mockRejectedValueOnce(new Error('DB falhou'));
        
        const response = await request(app)
          .put('/api/courses/1')
          .set('Authorization', `Bearer ${teacherToken}`)
          .send({ title: 'Violão Avançado', description: 'Desc', instrument: 'Violão' });

        expect(response.status).toBe(500);
      });
    });

    describe('GET /api/courses/teacher', () => {
      it('deve retornar lista vazia se professor não tiver cursos', async () => {
        db.query.mockResolvedValueOnce({ rows: [] });

        const response = await request(app)
          .get('/api/courses/teacher')
          .set('Authorization', `Bearer ${teacherToken}`);

        expect(response.status).toBe(200);
        expect(response.body).toEqual([]);
      });

      it('deve retornar 500 se o banco falhar', async () => {
        db.query.mockRejectedValueOnce(new Error('DB Error'));
        const response = await request(app)
          .get('/api/courses/teacher')
          .set('Authorization', `Bearer ${teacherToken}`);
        expect(response.status).toBe(500);
      });
    });
    it('deve retornar a lista de cursos do professor com dados', async () => {
        db.query.mockResolvedValueOnce({ rows: [{ id: 1, title: 'Violão', instrument: 'Violão' }] });

        const response = await request(app)
          .get('/api/courses/teacher')
          .set('Authorization', `Bearer ${teacherToken}`);

        expect(response.status).toBe(200);
        expect(response.body).toHaveLength(1);
        expect(response.body[0].title).toBe('Violão');
      });

    describe('GET /api/courses/teacher/students', () => {
      it('deve retornar 500 se o banco falhar', async () => {
        db.query.mockRejectedValueOnce(new Error('DB Error'));
        const response = await request(app)
          .get('/api/courses/teacher/students')
          .set('Authorization', `Bearer ${teacherToken}`);
        expect(response.status).toBe(500);
      });
    });
  });
  it('deve retornar a lista de alunos matriculados nos cursos do professor', async () => {
        db.query.mockResolvedValueOnce({ rows: [{ id: 50, name: 'João Aluno', course_title: 'Violão' }] });

        const response = await request(app)
          .get('/api/courses/teacher/students')
          .set('Authorization', `Bearer ${teacherToken}`);

        expect(response.status).toBe(200);
        expect(response.body[0].name).toBe('João Aluno');
      });

  describe('Student Area', () => {
    describe('GET /api/courses/student', () => {
      it('deve retornar 500 se o banco falhar', async () => {
        db.query.mockRejectedValueOnce(new Error('DB Error'));
        const response = await request(app)
          .get('/api/courses/student')
          .set('Authorization', `Bearer ${studentToken}`);
        expect(response.status).toBe(500);
      });
    });
    it('deve retornar a lista de cursos disponíveis para o aluno se matricular', async () => {
        db.query.mockResolvedValueOnce({ rows: [{ id: 2, title: 'Teoria Musical', teacher_name: 'Beethoven' }] });

        const response = await request(app)
          .get('/api/courses/student')
          .set('Authorization', `Bearer ${studentToken}`);

        expect(response.status).toBe(200);
        expect(response.body[0].title).toBe('Teoria Musical');
      });

    describe('GET /api/courses/enrolled', () => {
      it('deve retornar lista vazia se aluno não tiver matrículas', async () => {
        db.query.mockResolvedValueOnce({ rows: [] });

        const response = await request(app)
          .get('/api/courses/enrolled')
          .set('Authorization', `Bearer ${studentToken}`);

        expect(response.status).toBe(200);
        expect(response.body).toEqual([]);
      });

      it('deve retornar 500 se o banco falhar', async () => {
        db.query.mockRejectedValueOnce(new Error('DB Error'));
        const response = await request(app)
          .get('/api/courses/enrolled')
          .set('Authorization', `Bearer ${studentToken}`);
        expect(response.status).toBe(500);
      });
    });
    it('deve retornar os cursos nos quais o aluno já está matriculado', async () => {
        db.query.mockResolvedValueOnce({ rows: [{ id: 1, course_id: 2, title: 'Teoria Musical' }] });

        const response = await request(app)
          .get('/api/courses/enrolled')
          .set('Authorization', `Bearer ${studentToken}`);

        expect(response.status).toBe(200);
        expect(response.body).toHaveLength(1);
      });

    describe('POST /api/courses/student/enroll', () => {
      it('deve retornar 400 se course_id não for fornecido', async () => {
        const response = await request(app)
          .post('/api/courses/student/enroll')
          .set('Authorization', `Bearer ${studentToken}`)
          .send({});
        expect(response.status).toBe(400);
        expect(response.body.message).toBe('O ID do curso é obrigatório.');
      });

      it('deve retornar 403 se o aluno não estiver vinculado a uma instituição', async () => {
        db.query.mockResolvedValueOnce({ rows: [] }); // userCheck sem instituicao

        const response = await request(app)
          .post('/api/courses/student/enroll')
          .set('Authorization', `Bearer ${studentToken}`)
          .send({ course_id: 1 });

        expect(response.status).toBe(403);
      });

      it('deve retornar 400 se já estiver matriculado', async () => {
        db.query.mockResolvedValueOnce({ rows: [{ instituicao_id: 1 }] }); // userCheck
        db.query.mockResolvedValueOnce({ rows: [{ course_id: 1 }] }); // enrollment check (já matriculado)

        const response = await request(app)
          .post('/api/courses/student/enroll')
          .set('Authorization', `Bearer ${studentToken}`)
          .send({ course_id: 1 });

        expect(response.status).toBe(400);
        expect(response.body.message).toBe('Você já está matriculado neste curso.');
      });

      it('deve matricular o aluno com sucesso', async () => {
        db.query.mockResolvedValueOnce({ rows: [{ instituicao_id: 1 }] }); // userCheck
        db.query.mockResolvedValueOnce({ rows: [] }); // enrollment check
        db.query.mockResolvedValueOnce({ rowCount: 1 }); // insert

        const response = await request(app)
          .post('/api/courses/student/enroll')
          .set('Authorization', `Bearer ${studentToken}`)
          .send({ course_id: 1 });

        expect(response.status).toBe(201);
        expect(response.body.message).toBe('Matrícula realizada com sucesso!');
      });
    });

    describe('POST /api/courses/unenroll', () => {
      it('deve retornar 400 se course_id não for fornecido', async () => {
        const response = await request(app)
          .post('/api/courses/unenroll')
          .set('Authorization', `Bearer ${studentToken}`)
          .send({});
        expect(response.status).toBe(400);
        expect(response.body.message).toBe('O ID do curso é obrigatório.');
      });

      it('deve retornar 404 se tentar desmatricular de um curso que não está matriculado', async () => {
        db.query.mockResolvedValueOnce({ rowCount: 0 }); // nenhum deletado

        const response = await request(app)
          .post('/api/courses/unenroll')
          .set('Authorization', `Bearer ${studentToken}`)
          .send({ course_id: 99 });

        expect(response.status).toBe(404);
        expect(response.body.message).toBe('Matrícula não encontrada.');
      });

      it('deve desmatricular com sucesso', async () => {
        db.query.mockResolvedValueOnce({ rowCount: 1 }); 

        const response = await request(app)
          .post('/api/courses/unenroll')
          .set('Authorization', `Bearer ${studentToken}`)
          .send({ course_id: 1 });

        expect(response.status).toBe(200);
      });
    });
  });
});
