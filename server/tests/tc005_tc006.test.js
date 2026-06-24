process.env.JWT_SECRET = 'segredo-de-teste';

const request = require('supertest');
const { app } = require('../server');
const db = require('../config/db');

jest.mock('../config/db', () => ({
  query: jest.fn(),
}));

// ==========================================
// TC-005 — Cadastro / Aprovação de Usuários
// ==========================================
describe('TC-005: Controle de Acesso no Cadastro de Instituições', () => {
  beforeEach(() => jest.resetAllMocks());

  it('deve retornar 403 se um aluno tentar aprovar um usuário', async () => {
    const jwt = require('jsonwebtoken');
    const token = jwt.sign({ id: 99, role: 'aluno' }, process.env.JWT_SECRET);

    const response = await request(app)
      .put('/api/instituicao/approve-user')
      .set('Authorization', `Bearer ${token}`)
      .send({ email: 'aluno@teste.com', newRole: 'professor' });

    expect(response.status).toBe(403);
    expect(response.body.message).toBe('Acesso negado. Apenas instituições podem aprovar usuários.');
  });

  it('deve retornar 400 se campos obrigatórios estiverem vazios', async () => {
    const jwt = require('jsonwebtoken');
    const token = jwt.sign({ id: 1, role: 'instituicao' }, process.env.JWT_SECRET);

    const response = await request(app)
      .put('/api/instituicao/approve-user')
      .set('Authorization', `Bearer ${token}`)
      .send({ email: '', newRole: '' });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('E-mail e novo cargo são obrigatórios.');
  });

  it('deve retornar 200 se a instituição aprovar um usuário válido', async () => {
    const jwt = require('jsonwebtoken');
    const token = jwt.sign({ id: 1, role: 'instituicao' }, process.env.JWT_SECRET);

    // Mock: usuário encontrado no banco
    db.query.mockResolvedValueOnce({ rows: [{ id: 10, role: 'aluno' }] });
    // Mock: update bem sucedido
    db.query.mockResolvedValueOnce({
      rows: [{ id: 10, name: 'Lucas', email: 'lucas@teste.com', role: 'professor' }]
    });

    const response = await request(app)
      .put('/api/instituicao/approve-user')
      .set('Authorization', `Bearer ${token}`)
      .send({ email: 'lucas@teste.com', newRole: 'professor' });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Usuário aprovado e vinculado com sucesso!');
  });
});

// ==========================================
// TC-006 — Matrícula de Aluno
// ==========================================
describe('TC-006: Matrícula de Aluno em Curso', () => {
  beforeEach(() => jest.resetAllMocks());

  it('deve retornar 403 se o aluno tentar matricular em curso de outra instituição', async () => {
    const jwt = require('jsonwebtoken');
    const token = jwt.sign({ id: 50, role: 'aluno' }, process.env.JWT_SECRET);

    // Mock 1: courseCheck diz que o curso é da Instituição 1
    db.query.mockResolvedValueOnce({ rows: [{ id: 4, teacher_inst_id: 1 }] });
    // Mock 2: userCheck diz que o aluno NÃO TEM instituição (ou é diferente)
    db.query.mockResolvedValueOnce({ rows: [{ instituicao_id: null }] });

    const response = await request(app)
      .post('/api/courses/student/enroll')
      .set('Authorization', `Bearer ${token}`)
      .send({ course_id: 4 });

    expect(response.status).toBe(403);
    expect(response.body.message).toBe('Apenas alunos da mesma instituição podem acessar este curso.');
  });

  it('deve retornar 400 se o aluno já estiver matriculado', async () => {
    const jwt = require('jsonwebtoken');
    const token = jwt.sign({ id: 50, role: 'aluno' }, process.env.JWT_SECRET);

    // Mock 1: courseCheck
    db.query.mockResolvedValueOnce({ rows: [{ id: 4, teacher_inst_id: 'a1b2' }] });
    // Mock 2: userCheck 
    db.query.mockResolvedValueOnce({ rows: [{ instituicao_id: 'a1b2' }] });
    // Mock 3: enrollment check - matrícula já existe
    db.query.mockResolvedValueOnce({ rows: [{ user_id: 50, course_id: 4 }] });

    const response = await request(app)
      .post('/api/courses/student/enroll')
      .set('Authorization', `Bearer ${token}`)
      .send({ course_id: 4 });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Você já está matriculado neste curso.');
  });

  it('deve retornar 201 se a matrícula for realizada com sucesso', async () => {
    const jwt = require('jsonwebtoken');
    const token = jwt.sign({ id: 50, role: 'aluno' }, process.env.JWT_SECRET);

    // Mock 1: courseCheck
    db.query.mockResolvedValueOnce({ rows: [{ id: 4, teacher_inst_id: 'a1b2' }] });
    // Mock 2: userCheck 
    db.query.mockResolvedValueOnce({ rows: [{ instituicao_id: 'a1b2' }] });
    // Mock 3: enrollment check - matrícula não existe ainda
    db.query.mockResolvedValueOnce({ rows: [] });
    // Mock 4: insert
    db.query.mockResolvedValueOnce({});

    const response = await request(app)
      .post('/api/courses/student/enroll')
      .set('Authorization', `Bearer ${token}`)
      .send({ course_id: 4 });

    expect(response.status).toBe(201);
    expect(response.body.message).toBe('Matrícula realizada com sucesso!');
  });
});