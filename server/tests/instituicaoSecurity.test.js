/**
 * Security Sprint Cycle 2 — Testes de Segurança Institucional
 */
process.env.SUPABASE_URL = 'http://dummy.supabase.co';
process.env.SUPABASE_SERVICE_ROLE_KEY = 'dummy_key';
process.env.JWT_SECRET = 'segredo-de-teste-seguranca';
process.env.FRONTEND_URL = 'http://localhost:3000';
process.env.API_URL = 'http://localhost:5000';
process.env.MP_ACCESS_TOKEN = 'dummy_mp_token';

const request = require('supertest');
const jwt = require('jsonwebtoken');
const { app } = require('../server');
const db = require('../config/db');

jest.mock('../config/db', () => ({ query: jest.fn() }));

jest.mock('bcryptjs', () => ({
  genSalt: jest.fn().mockResolvedValue('salt'),
  hash: jest.fn().mockResolvedValue('hashed_password_mock'),
  compare: jest.fn().mockResolvedValue(true),
}));

const JWT_SECRET = process.env.JWT_SECRET;
const makeToken = (payload) => jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });

const tokens = {
  instituicao: makeToken({ id: 10, role: 'instituicao' }),
  outraInstituicao: makeToken({ id: 20, role: 'instituicao' }),
  professor: makeToken({ id: 30, role: 'professor' }),
  aluno: makeToken({ id: 40, role: 'aluno' }),
};

beforeEach(() => jest.clearAllMocks());
beforeAll(() => jest.spyOn(console, 'error').mockImplementation(() => {}));
afterAll(() => console.error.mockRestore());

describe('Segurança Institucional — Autenticação (401)', () => {
  it('GET /api/instituicao/teachers — deve retornar 401 sem token', async () => {
    const res = await request(app).get('/api/instituicao/teachers');
    expect(res.status).toBe(401);
  });
  it('POST /api/instituicao/teachers — deve retornar 401 com token forjado', async () => {
    const res = await request(app).post('/api/instituicao/teachers').set('Authorization', 'Bearer payload.invalido.xxx').send({ name: 'Test' });
    expect(res.status).toBe(401);
  });
});

describe('Segurança Institucional — RBAC (403)', () => {
  it('GET /api/instituicao/teachers — professor deve receber 403', async () => {
    const res = await request(app).get('/api/instituicao/teachers').set('Authorization', `Bearer ${tokens.professor}`);
    expect(res.status).toBe(403);
  });
  it('POST /api/instituicao/teachers — aluno deve receber 403', async () => {
    const res = await request(app).post('/api/instituicao/teachers').set('Authorization', `Bearer ${tokens.aluno}`).send({ name: 'Hacker' });
    expect(res.status).toBe(403);
  });
});

describe('Segurança Institucional — Fronteiras Multi-Tenant', () => {
  it('GET /api/instituicao/teachers — deve retornar apenas professores da instituição autenticada', async () => {
    db.query.mockResolvedValueOnce({ rows: [{ id: 1 }, { id: 2 }] });
    const res = await request(app).get('/api/instituicao/teachers').set('Authorization', `Bearer ${tokens.instituicao}`);
    expect(res.status).toBe(200);
    expect(db.query.mock.calls[0][1][0]).toBe(10); 
  });
});

describe('Segurança Institucional — Criação de Professor', () => {
  it('deve criar professor com sucesso e vinculá-lo à instituição autenticada (ID=10)', async () => {
    db.query.mockResolvedValueOnce({}); // BEGIN
    db.query.mockResolvedValueOnce({ rows: [] }); // SELECT
    db.query.mockResolvedValueOnce({ rows: [{ id: 2, name: 'Nova Prof', role: 'professor' }] }); // INSERT
    db.query.mockResolvedValueOnce({}); // COMMIT

    const res = await request(app)
      .post('/api/instituicao/teachers')
      .set('Authorization', `Bearer ${tokens.instituicao}`) // <-- AQUI ERA O ERRO
      .send({ name: 'Nova Prof', email: 'nova@inst.com', password: 'senha123' });

    expect(res.status).toBe(201);
  });

  it('deve retornar 400 se o e-mail do professor já existir no sistema', async () => {
    db.query.mockResolvedValueOnce({}); // BEGIN
    db.query.mockResolvedValueOnce({ rows: [{ id: 99 }] }); // SELECT com dados
    db.query.mockResolvedValueOnce({}); // ROLLBACK

    const res = await request(app)
      .post('/api/instituicao/teachers')
      .set('Authorization', `Bearer ${tokens.instituicao}`) // <-- AQUI ERA O ERRO
      .send({ name: 'Prof Duplicado', email: 'existente@inst.com', password: 'senha123' });

    expect(res.status).toBe(400);
  });
});

describe('Segurança Institucional — Prevenção de Escalada de Privilégio', () => {
  it('payload com "role: super_admin" deve ser ignorado', async () => {
    db.query.mockResolvedValueOnce({}); 
    db.query.mockResolvedValueOnce({ rows: [] }); 
    db.query.mockResolvedValueOnce({ rows: [{ id: 100, role: 'professor' }] });
    db.query.mockResolvedValueOnce({});

    const res = await request(app)
      .post('/api/instituicao/teachers')
      .set('Authorization', `Bearer ${tokens.instituicao}`) // <-- AQUI ERA O ERRO
      .send({ name: 'Hacker', email: 'hacker@inst.com', password: 'senha123', role: 'super_admin' });

    expect(res.status).toBe(201);
    const insertSql = db.query.mock.calls[2][0];
    expect(insertSql).toContain("'professor'");
    expect(insertSql).not.toContain('super_admin');
  });

  it('payload com "instituicao_id" diferente deve ser ignorado', async () => {
    db.query.mockResolvedValueOnce({});
    db.query.mockResolvedValueOnce({ rows: [] });
    db.query.mockResolvedValueOnce({ rows: [{ id: 101, role: 'professor' }] });
    db.query.mockResolvedValueOnce({});

    const res = await request(app)
      .post('/api/instituicao/teachers')
      .set('Authorization', `Bearer ${tokens.instituicao}`) // <-- AQUI ERA O ERRO
      .send({ name: 'Prof Legit', email: 'legit@inst.com', password: 'senha123', instituicao_id: 999 });

    expect(res.status).toBe(201);
    const insertParams = db.query.mock.calls[2][1];
    expect(insertParams[3]).toBe(10);
  });
});

describe('Segurança Institucional — Falhas de Banco (500)', () => {
  it('GET /api/instituicao/teachers — deve retornar 500 JSON limpo', async () => {
    db.query.mockRejectedValueOnce(new Error('connection timeout'));
    const res = await request(app).get('/api/instituicao/teachers').set('Authorization', `Bearer ${tokens.instituicao}`);
    expect(res.status).toBe(500);
  });

  it('POST /api/instituicao/teachers — deve retornar 500 JSON limpo quando INSERT falha', async () => {
    db.query.mockResolvedValueOnce({});
    db.query.mockResolvedValueOnce({ rows: [] });
    db.query.mockRejectedValueOnce(new Error('deadlock detected')); // INSERT falha

    const res = await request(app)
      .post('/api/instituicao/teachers')
      .set('Authorization', `Bearer ${tokens.instituicao}`) // <-- AQUI ERA O ERRO
      .send({ name: 'Prof DB Fail', email: 'dbfail@inst.com', password: 'senha123' });

    expect(res.status).toBe(500);
  });
});

describe('Segurança Institucional — Aprovação de Usuários (approveUser)', () => {
  it('instituicao deve aprovar um usuário válido e retornar 200', async () => {
    db.query.mockResolvedValueOnce({ rows: [{ id: 77, role: 'aluno' }] });
    db.query.mockResolvedValueOnce({ rows: [{ id: 77, role: 'professor' }] });

    const res = await request(app)
      .put('/api/instituicao/approve-user')
      .set('Authorization', `Bearer ${tokens.instituicao}`)
      .send({ email: 'joao@test.com', newRole: 'professor' });

    expect(res.status).toBe(200);
  });

  it('deve retornar 403 ao tentar modificar um super_admin', async () => {
    db.query.mockResolvedValueOnce({ rows: [{ id: 1, role: 'super_admin' }] });

    const res = await request(app)
      .put('/api/instituicao/approve-user')
      .set('Authorization', `Bearer ${tokens.instituicao}`)
      .send({ email: 'superadmin@sonatta.com', newRole: 'aluno' });

    expect(res.status).toBe(403);
  });

  it('deve retornar 500 JSON limpo em caso de falha de banco', async () => {
    db.query.mockRejectedValueOnce(new Error('connection refused'));

    const res = await request(app)
      .put('/api/instituicao/approve-user')
      .set('Authorization', `Bearer ${tokens.instituicao}`)
      .send({ email: 'alvo@test.com', newRole: 'aluno' });

    expect(res.status).toBe(500);
  });
});