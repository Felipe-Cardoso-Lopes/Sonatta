/**
 * Security Sprint Cycle 2 — Testes de Segurança Institucional
 *
 * Arquivo: tests/instituicaoSecurity.test.js
 *
 * Estratégia:
 * - Utilizamos o app Express real (server.js) com JWT verdadeiro,
 *   igual ao padrão aprovado no tc005_tc006.test.js e authMiddleware.test.js.
 * - O banco de dados (pg) é completamente mockado via jest.mock('../config/db').
 * - bcryptjs é mockado para eliminar custo de CPU nos testes de criação de professor.
 * - As variáveis de ambiente do Supabase são definidas com valores dummy no topo
 *   para evitar o crash conhecido na inicialização do uploadController.
 */

// ── Env Dummies (DEVE VIR ANTES DE QUALQUER require) ──────────────────────────
process.env.SUPABASE_URL = 'http://dummy.supabase.co';
process.env.SUPABASE_SERVICE_ROLE_KEY = 'dummy_key';
process.env.JWT_SECRET = 'segredo-de-teste-seguranca';
process.env.FRONTEND_URL = 'http://localhost:3000';
process.env.API_URL = 'http://localhost:5000';
process.env.MP_ACCESS_TOKEN = 'dummy_mp_token';

// ── Dependências ───────────────────────────────────────────────────────────────
const request = require('supertest');
const jwt = require('jsonwebtoken');
const { app } = require('../server');
const db = require('../config/db');

// ── Mocks ──────────────────────────────────────────────────────────────────────
jest.mock('../config/db', () => ({ query: jest.fn() }));

// Mock do bcryptjs para acelerar os testes de criação de professor
jest.mock('bcryptjs', () => ({
  genSalt: jest.fn().mockResolvedValue('salt'),
  hash: jest.fn().mockResolvedValue('hashed_password_mock'),
  compare: jest.fn().mockResolvedValue(true),
}));

// ── Helpers ────────────────────────────────────────────────────────────────────
const JWT_SECRET = process.env.JWT_SECRET;

/** Gera um token JWT válido com os dados de usuário fornecidos */
const makeToken = (payload) => jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });

/** Tokens pré-gerados para uso nos testes */
const tokens = {
  instituicao: makeToken({ id: 10, role: 'instituicao' }),
  outraInstituicao: makeToken({ id: 20, role: 'instituicao' }),
  professor: makeToken({ id: 30, role: 'professor' }),
  aluno: makeToken({ id: 40, role: 'aluno' }),
};

// ── Setup ──────────────────────────────────────────────────────────────────────
beforeEach(() => jest.clearAllMocks());

// Suprime console.error durante os testes para evitar poluição do terminal
beforeAll(() => jest.spyOn(console, 'error').mockImplementation(() => {}));
afterAll(() => console.error.mockRestore());

// ==============================================================================
// BLOCO 1 — AUTENTICAÇÃO (401)
// Garante que o middleware verifyToken bloqueia acessos sem token ou com token inválido.
// ==============================================================================
describe('Segurança Institucional — Autenticação (401)', () => {
  it('GET /api/instituicao/teachers — deve retornar 401 sem token', async () => {
    const res = await request(app).get('/api/instituicao/teachers');
    expect(res.status).toBe(401);
    expect(res.body.message).toBe('Não autorizado, nenhum token fornecido.');
  });

  it('POST /api/instituicao/teachers — deve retornar 401 sem token', async () => {
    const res = await request(app)
      .post('/api/instituicao/teachers')
      .send({ name: 'Test', email: 'test@test.com', password: '123456' });
    expect(res.status).toBe(401);
    expect(res.body.message).toBe('Não autorizado, nenhum token fornecido.');
  });

  it('GET /api/instituicao/teachers — deve retornar 401 com token forjado/inválido', async () => {
    const res = await request(app)
      .get('/api/instituicao/teachers')
      .set('Authorization', 'Bearer token.invalido.assinado_errado');
    expect(res.status).toBe(401);
    expect(res.body.message).toBe('Não autorizado, token inválido ou expirado.');
  });

  it('POST /api/instituicao/teachers — deve retornar 401 com token inválido', async () => {
    const res = await request(app)
      .post('/api/instituicao/teachers')
      .set('Authorization', 'Bearer payload.invalido.xxx')
      .send({ name: 'Test', email: 'test@test.com', password: '123456' });
    expect(res.status).toBe(401);
    expect(res.body.message).toBe('Não autorizado, token inválido ou expirado.');
  });
});

// ==============================================================================
// BLOCO 2 — CONTROLE DE ACESSO / RBAC (403)
// Garante que roles incorretos são bloqueados antes de qualquer lógica de negócio.
// ==============================================================================
describe('Segurança Institucional — RBAC (403)', () => {
  it('GET /api/instituicao/teachers — professor deve receber 403', async () => {
    const res = await request(app)
      .get('/api/instituicao/teachers')
      .set('Authorization', `Bearer ${tokens.professor}`);
    expect(res.status).toBe(403);
    expect(res.body.message).toMatch(/Acesso negado/);
    // Garante que o banco NÃO foi acessado — a guarda de role deve ser a primeira instrução
    expect(db.query).not.toHaveBeenCalled();
  });

  it('GET /api/instituicao/teachers — aluno deve receber 403', async () => {
    const res = await request(app)
      .get('/api/instituicao/teachers')
      .set('Authorization', `Bearer ${tokens.aluno}`);
    expect(res.status).toBe(403);
    expect(res.body.message).toMatch(/Acesso negado/);
    expect(db.query).not.toHaveBeenCalled();
  });

  it('POST /api/instituicao/teachers — professor deve receber 403', async () => {
    const res = await request(app)
      .post('/api/instituicao/teachers')
      .set('Authorization', `Bearer ${tokens.professor}`)
      .send({ name: 'Hacker', email: 'hacker@test.com', password: '123456' });
    expect(res.status).toBe(403);
    expect(res.body.message).toMatch(/Acesso negado/);
    expect(db.query).not.toHaveBeenCalled();
  });

  it('POST /api/instituicao/teachers — aluno deve receber 403', async () => {
    const res = await request(app)
      .post('/api/instituicao/teachers')
      .set('Authorization', `Bearer ${tokens.aluno}`)
      .send({ name: 'Hacker', email: 'hacker@test.com', password: '123456' });
    expect(res.status).toBe(403);
    expect(res.body.message).toMatch(/Acesso negado/);
    expect(db.query).not.toHaveBeenCalled();
  });
});

// ==============================================================================
// BLOCO 3 — ISOLAMENTO MULTI-TENANT (Fronteiras Institucionais)
// Garante que uma instituição só pode acessar os seus próprios dados.
// ==============================================================================
describe('Segurança Institucional — Fronteiras Multi-Tenant', () => {
  it('GET /api/instituicao/teachers — deve retornar apenas professores da instituição autenticada', async () => {
    // Institução ID=10 tem 2 professores
    const mockTeachers = [
      { id: 1, name: 'Prof Ana', email: 'ana@inst10.com', teacher_type: 'institucional' },
      { id: 2, name: 'Prof Bruno', email: 'bruno@inst10.com', teacher_type: 'institucional' },
    ];
    db.query.mockResolvedValueOnce({ rows: mockTeachers });

    const res = await request(app)
      .get('/api/instituicao/teachers')
      .set('Authorization', `Bearer ${tokens.instituicao}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(2);

    // Verifica se a query usou o ID correto da instituição autenticada (ID=10)
    const [sql, params] = db.query.mock.calls[0];
    expect(sql).toContain('instituicao_id = $1');
    expect(params[0]).toBe(10); // ID do token de 'instituicao' (id: 10)
  });

  it('GET /api/instituicao/teachers — outra instituição só vê os seus próprios professores (ID=20)', async () => {
    db.query.mockResolvedValueOnce({ rows: [] }); // Instituição 20 não tem professores

    const res = await request(app)
      .get('/api/instituicao/teachers')
      .set('Authorization', `Bearer ${tokens.outraInstituicao}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(0);

    const [, params] = db.query.mock.calls[0];
    expect(params[0]).toBe(20); // ID do token de 'outraInstituicao' (id: 20)
  });
});

// ==============================================================================
// BLOCO 4 — CRIAÇÃO DE PROFESSOR (Segurança e Validações)
// ==============================================================================
describe('Segurança Institucional — Criação de Professor', () => {
  it('deve criar professor com sucesso e vinculá-lo à instituição autenticada (ID=10)', async () => {
    db.query.mockResolvedValueOnce({ rows: [] }); // E-mail não existe
    db.query.mockResolvedValueOnce({
      rows: [{ id: 99, name: 'Nova Prof', email: 'nova@inst.com', role: 'teacher', teacher_type: 'institucional' }],
    });

    const res = await request(app)
      .post('/api/instituicao/teachers')
      .set('Authorization', `Bearer ${tokens.instituicao}`)
      .send({ name: 'Nova Prof', email: 'nova@inst.com', password: 'senha123' });

    expect(res.status).toBe(201);
    expect(res.body.message).toBe('Professor cadastrado com sucesso!');

    // Verifica que o INSERT usou o instituicao_id do token (10), não do payload
    const insertCall = db.query.mock.calls[1];
    const insertParams = insertCall[1];
    // params: [name, email, passwordHash, instituicao_id]
    expect(insertParams[3]).toBe(10);
  });

  it('deve retornar 400 se o campo "name" estiver ausente', async () => {
    const res = await request(app)
      .post('/api/instituicao/teachers')
      .set('Authorization', `Bearer ${tokens.instituicao}`)
      .send({ email: 'sem-nome@inst.com', password: 'senha123' });

    expect(res.status).toBe(400);
    expect(res.body.message).toBe('Nome, e-mail e senha são obrigatórios.');
    expect(db.query).not.toHaveBeenCalled();
  });

  it('deve retornar 400 se o campo "email" estiver ausente', async () => {
    const res = await request(app)
      .post('/api/instituicao/teachers')
      .set('Authorization', `Bearer ${tokens.instituicao}`)
      .send({ name: 'Prof Sem Email', password: 'senha123' });

    expect(res.status).toBe(400);
    expect(res.body.message).toBe('Nome, e-mail e senha são obrigatórios.');
    expect(db.query).not.toHaveBeenCalled();
  });

  it('deve retornar 400 se o campo "password" estiver ausente', async () => {
    const res = await request(app)
      .post('/api/instituicao/teachers')
      .set('Authorization', `Bearer ${tokens.instituicao}`)
      .send({ name: 'Prof Sem Senha', email: 'semsinha@inst.com' });

    expect(res.status).toBe(400);
    expect(res.body.message).toBe('Nome, e-mail e senha são obrigatórios.');
    expect(db.query).not.toHaveBeenCalled();
  });

  it('deve retornar 400 se o e-mail do professor já existir no sistema (duplicata)', async () => {
    db.query.mockResolvedValueOnce({ rows: [{ id: 55 }] }); // E-mail já existe

    const res = await request(app)
      .post('/api/instituicao/teachers')
      .set('Authorization', `Bearer ${tokens.instituicao}`)
      .send({ name: 'Prof Duplicado', email: 'existente@inst.com', password: 'senha123' });

    expect(res.status).toBe(400);
    expect(res.body.message).toBe('Este e-mail já está em uso por outro usuário.');
  });
});

// ==============================================================================
// BLOCO 5 — PREVENÇÃO DE ESCALADA DE PRIVILÉGIO (Role Escalation)
// Garante que o payload do cliente NÃO pode sobrescrever role ou instituicao_id.
// ==============================================================================
describe('Segurança Institucional — Prevenção de Escalada de Privilégio', () => {
  it('payload com "role: super_admin" deve ser ignorado — professor deve nascer como "teacher"', async () => {
    db.query.mockResolvedValueOnce({ rows: [] }); // E-mail não existe
    db.query.mockResolvedValueOnce({
      rows: [{ id: 100, name: 'Hacker', email: 'hacker@inst.com', role: 'teacher', teacher_type: 'institucional' }],
    });

    const res = await request(app)
      .post('/api/instituicao/teachers')
      .set('Authorization', `Bearer ${tokens.instituicao}`)
      .send({ name: 'Hacker', email: 'hacker@inst.com', password: 'senha123', role: 'super_admin' });

    expect(res.status).toBe(201);

    // O role no SQL INSERT é hardcoded como 'teacher' — verifica o SQL gerado
    const insertSql = db.query.mock.calls[1][0];
    expect(insertSql).toContain("'teacher'");
    // E NÃO deve conter super_admin
    expect(insertSql).not.toContain('super_admin');
  });

  it('payload com "instituicao_id" diferente deve ser ignorado — deve usar o do token', async () => {
    db.query.mockResolvedValueOnce({ rows: [] }); // E-mail não existe
    db.query.mockResolvedValueOnce({
      rows: [{ id: 101, name: 'Prof Legit', email: 'legit@inst.com', role: 'teacher', teacher_type: 'institucional' }],
    });

    const res = await request(app)
      .post('/api/instituicao/teachers')
      .set('Authorization', `Bearer ${tokens.instituicao}`) // ID=10
      .send({
        name: 'Prof Legit',
        email: 'legit@inst.com',
        password: 'senha123',
        instituicao_id: 999, // Tenta injetar um ID de outra instituição
      });

    expect(res.status).toBe(201);

    // O INSERT deve ter usado ID=10 (do token), não 999 (do payload)
    const insertParams = db.query.mock.calls[1][1];
    expect(insertParams[3]).toBe(10);
    expect(insertParams[3]).not.toBe(999);
  });
});

// ==============================================================================
// BLOCO 6 — RESILIÊNCIA DO BANCO DE DADOS (500)
// Garante que falhas de banco retornam JSON limpo sem vazar stack traces.
// ==============================================================================
describe('Segurança Institucional — Falhas de Banco (500)', () => {
  it('GET /api/instituicao/teachers — deve retornar 500 JSON limpo em erro de banco', async () => {
    db.query.mockRejectedValueOnce(new Error('connection timeout'));

    const res = await request(app)
      .get('/api/instituicao/teachers')
      .set('Authorization', `Bearer ${tokens.instituicao}`);

    expect(res.status).toBe(500);
    expect(res.body).toHaveProperty('message');
    expect(res.body.message).toBe('Erro interno ao buscar professores.');
    // Garante que a stack trace NÃO está exposta no body
    expect(res.body).not.toHaveProperty('stack');
    expect(res.body).not.toHaveProperty('error');
  });

  it('POST /api/instituicao/teachers — deve retornar 500 JSON limpo quando o INSERT falha', async () => {
    db.query.mockResolvedValueOnce({ rows: [] }); // E-mail não existe
    db.query.mockRejectedValueOnce(new Error('deadlock detected')); // INSERT falha

    const res = await request(app)
      .post('/api/instituicao/teachers')
      .set('Authorization', `Bearer ${tokens.instituicao}`)
      .send({ name: 'Prof DB Fail', email: 'dbfail@inst.com', password: 'senha123' });

    expect(res.status).toBe(500);
    expect(res.body).toHaveProperty('message');
    expect(res.body.message).toBe('Erro interno ao processar o cadastro.');
    expect(res.body).not.toHaveProperty('stack');
    expect(res.body).not.toHaveProperty('error');
  });
});

// ==============================================================================
// BLOCO 7 — APROVAÇÃO DE USUÁRIOS (approveUser — PUT /api/instituicao/approve-user)
// Cobre: autenticação, RBAC whitelist estrita, validações de payload e falhas de banco.
// ==============================================================================
describe('Segurança Institucional — Aprovação de Usuários (approveUser)', () => {
  // ── 7A: Autenticação (401) ────────────────────────────────────────────────
  it('deve retornar 401 sem token', async () => {
    const res = await request(app)
      .put('/api/instituicao/approve-user')
      .send({ email: 'aluno@test.com', newRole: 'aluno' });

    expect(res.status).toBe(401);
    expect(res.body.message).toBe('Não autorizado, nenhum token fornecido.');
  });

  it('deve retornar 401 com token inválido', async () => {
    const res = await request(app)
      .put('/api/instituicao/approve-user')
      .set('Authorization', 'Bearer token.totalmente.invalido')
      .send({ email: 'aluno@test.com', newRole: 'aluno' });

    expect(res.status).toBe(401);
    expect(res.body.message).toBe('Não autorizado, token inválido ou expirado.');
  });

  // ── 7B: RBAC — Whitelist estrita (403) ───────────────────────────────────
  it('role "aluno" deve receber 403 — banco NÃO consultado', async () => {
    const res = await request(app)
      .put('/api/instituicao/approve-user')
      .set('Authorization', `Bearer ${tokens.aluno}`)
      .send({ email: 'alvo@test.com', newRole: 'aluno' });

    expect(res.status).toBe(403);
    expect(res.body.message).toBe('Acesso negado. Apenas instituições podem aprovar usuários.');
    expect(db.query).not.toHaveBeenCalled();
  });

  it('role "professor" deve receber 403 — banco NÃO consultado', async () => {
    const res = await request(app)
      .put('/api/instituicao/approve-user')
      .set('Authorization', `Bearer ${tokens.professor}`)
      .send({ email: 'alvo@test.com', newRole: 'aluno' });

    expect(res.status).toBe(403);
    expect(res.body.message).toBe('Acesso negado. Apenas instituições podem aprovar usuários.');
    expect(db.query).not.toHaveBeenCalled();
  });

  it('role "solo_teacher" deve receber 403 — banco NÃO consultado', async () => {
    const soloTeacherToken = makeToken({ id: 50, role: 'solo_teacher' });

    const res = await request(app)
      .put('/api/instituicao/approve-user')
      .set('Authorization', `Bearer ${soloTeacherToken}`)
      .send({ email: 'alvo@test.com', newRole: 'aluno' });

    expect(res.status).toBe(403);
    expect(res.body.message).toBe('Acesso negado. Apenas instituições podem aprovar usuários.');
    expect(db.query).not.toHaveBeenCalled();
  });

  // ── 7C: Aprovação bem-sucedida por Instituição ────────────────────────────
  it('instituicao deve aprovar um usuário válido e retornar 200', async () => {
    db.query.mockResolvedValueOnce({ rows: [{ id: 77, role: 'aluno' }] }); // SELECT
    db.query.mockResolvedValueOnce({                                        // UPDATE
      rows: [{ id: 77, name: 'João Aluno', email: 'joao@test.com', role: 'professor' }],
    });

    const res = await request(app)
      .put('/api/instituicao/approve-user')
      .set('Authorization', `Bearer ${tokens.instituicao}`)
      .send({ email: 'joao@test.com', newRole: 'professor' });

    expect(res.status).toBe(200);
    expect(res.body.message).toBe('Usuário aprovado e vinculado com sucesso!');
    expect(res.body.user).toMatchObject({ email: 'joao@test.com', role: 'professor' });
    expect(db.query).toHaveBeenCalledTimes(2);
  });

  // ── 7D: Validações de Payload (400) ──────────────────────────────────────
  it('deve retornar 400 se "email" estiver ausente', async () => {
    const res = await request(app)
      .put('/api/instituicao/approve-user')
      .set('Authorization', `Bearer ${tokens.instituicao}`)
      .send({ newRole: 'aluno' });

    expect(res.status).toBe(400);
    expect(res.body.message).toBe('E-mail e novo cargo são obrigatórios.');
    expect(db.query).not.toHaveBeenCalled();
  });

  it('deve retornar 400 se "newRole" estiver ausente', async () => {
    const res = await request(app)
      .put('/api/instituicao/approve-user')
      .set('Authorization', `Bearer ${tokens.instituicao}`)
      .send({ email: 'alvo@test.com' });

    expect(res.status).toBe(400);
    expect(res.body.message).toBe('E-mail e novo cargo são obrigatórios.');
    expect(db.query).not.toHaveBeenCalled();
  });

  it('deve retornar 400 se "newRole" for um valor inválido (ex: "super_admin")', async () => {
    const res = await request(app)
      .put('/api/instituicao/approve-user')
      .set('Authorization', `Bearer ${tokens.instituicao}`)
      .send({ email: 'alvo@test.com', newRole: 'super_admin' });

    expect(res.status).toBe(400);
    expect(res.body.message).toBe('Cargo inválido. O usuário deve ser aluno ou professor.');
    expect(db.query).not.toHaveBeenCalled();
  });

  // ── 7E: Usuário não encontrado (404) ──────────────────────────────────────
  it('deve retornar 404 se o e-mail do usuário alvo não existir', async () => {
    db.query.mockResolvedValueOnce({ rows: [] });

    const res = await request(app)
      .put('/api/instituicao/approve-user')
      .set('Authorization', `Bearer ${tokens.instituicao}`)
      .send({ email: 'naoexiste@test.com', newRole: 'aluno' });

    expect(res.status).toBe(404);
    expect(res.body.message).toBe('Nenhum usuário encontrado com este e-mail.');
  });

  // ── 7F: Proteção contra alteração de super_admin (403) ───────────────────
  it('deve retornar 403 ao tentar modificar um super_admin', async () => {
    db.query.mockResolvedValueOnce({ rows: [{ id: 1, role: 'super_admin' }] });

    const res = await request(app)
      .put('/api/instituicao/approve-user')
      .set('Authorization', `Bearer ${tokens.instituicao}`)
      .send({ email: 'superadmin@sonatta.com', newRole: 'aluno' });

    expect(res.status).toBe(403);
    expect(res.body.message).toBe('Acesso negado para alterar este perfil.');
    // Apenas 1 query (SELECT), sem UPDATE
    expect(db.query).toHaveBeenCalledTimes(1);
  });

  // ── 7G: Falha de Banco (500) ──────────────────────────────────────────────
  it('deve retornar 500 JSON limpo em caso de falha de banco', async () => {
    db.query.mockRejectedValueOnce(new Error('connection refused'));

    const res = await request(app)
      .put('/api/instituicao/approve-user')
      .set('Authorization', `Bearer ${tokens.instituicao}`)
      .send({ email: 'alvo@test.com', newRole: 'aluno' });

    expect(res.status).toBe(500);
    expect(res.body).toHaveProperty('message');
    expect(res.body.message).toBe('Erro no servidor ao tentar atualizar o status do usuário.');
    expect(res.body).not.toHaveProperty('stack');
    expect(res.body).not.toHaveProperty('error');
  });
});
