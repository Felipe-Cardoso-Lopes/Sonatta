/**
 * Security Sprint Cycle 3A — Testes de Segurança: authController.login
 *
 * Arquivo: tests/authController.test.js
 *
 * Estratégia:
 * - nodemailer é mockado via jest.mock() (hoistado pelo Jest) antes de qualquer
 *   require, pois o transporter é instanciado no nível do módulo em authController.js.
 * - O banco de dados (pg) é completamente mockado.
 * - bcryptjs é mockado para eliminar custo de CPU e tornar os testes determinísticos.
 * - JWT_SECRET é definido antes de qualquer require para garantir assinatura consistente.
 */

// ── Env Dummies (DEVE VIR ANTES DE QUALQUER require) ──────────────────────────
process.env.SUPABASE_URL        = 'http://dummy.supabase.co';
process.env.SUPABASE_SERVICE_ROLE_KEY = 'dummy_key';
process.env.JWT_SECRET          = 'segredo-de-teste-auth-controller';
process.env.FRONTEND_URL        = 'http://localhost:3000';
process.env.API_URL             = 'http://localhost:5000';
process.env.MP_ACCESS_TOKEN     = 'dummy_mp_token';
process.env.EMAIL_USER          = 'dummy@email.com';
process.env.EMAIL_PASS          = 'dummy_pass';

// ── Mock do nodemailer (ANTES de qualquer require — instanciado no nível do módulo) ──
jest.mock('nodemailer', () => ({
  createTransport: jest.fn().mockReturnValue({
    sendMail: jest.fn().mockResolvedValue({ messageId: 'mock-id' }),
  }),
}));

// ── Mock do banco de dados ─────────────────────────────────────────────────────
jest.mock('../config/db', () => ({ query: jest.fn() }));

// ── Mock do bcryptjs ───────────────────────────────────────────────────────────
jest.mock('bcryptjs', () => ({
  genSalt:  jest.fn().mockResolvedValue('salt'),
  hash:     jest.fn().mockResolvedValue('hashed_password_mock'),
  compare:  jest.fn(),
}));

// ── Dependências ───────────────────────────────────────────────────────────────
const request = require('supertest');
const jwt     = require('jsonwebtoken');
const bcrypt  = require('bcryptjs');
const { app } = require('../server');
const db      = require('../config/db');

// ── Helpers ────────────────────────────────────────────────────────────────────
const JWT_SECRET = process.env.JWT_SECRET;

/** Usuário mockado completo retornado pelo banco em casos de sucesso */
const mockVerifiedUser = {
  id:           42,
  name:         'Maria Professora',
  nickname:     'mari',
  email:        'maria@teste.com',
  password_hash:'hashed_stored_password',
  role:         'professor',
  is_verified:  true,
  teacher_type: 'solo',
};

// ── Setup ──────────────────────────────────────────────────────────────────────
beforeEach(() => jest.clearAllMocks());

beforeAll(() => jest.spyOn(console, 'error').mockImplementation(() => {}));
afterAll(()  => console.error.mockRestore());

// ==============================================================================
// BLOCO 1 — VALIDAÇÃO DE CAMPOS OBRIGATÓRIOS (400)
// ==============================================================================
describe('Auth — Login: Campos Obrigatórios (400)', () => {
  it('deve retornar 400 quando "email" está ausente', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ password: 'senha123' });

    expect(res.status).toBe(400);
    expect(res.body.message).toBe('E-mail e senha são obrigatórios.');
    // Garante que o banco NÃO foi consultado
    expect(db.query).not.toHaveBeenCalled();
  });

  it('deve retornar 400 quando "password" está ausente', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'maria@teste.com' });

    expect(res.status).toBe(400);
    expect(res.body.message).toBe('E-mail e senha são obrigatórios.');
    expect(db.query).not.toHaveBeenCalled();
  });

  it('deve retornar 400 quando o body está completamente vazio', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({});

    expect(res.status).toBe(400);
    expect(res.body.message).toBe('E-mail e senha são obrigatórios.');
    expect(db.query).not.toHaveBeenCalled();
  });
});

// ==============================================================================
// BLOCO 2 — CREDENCIAIS INVÁLIDAS (401)
// Garante mensagem genérica: NÃO revela se o e-mail existe no sistema.
// ==============================================================================
describe('Auth — Login: Credenciais Inválidas (401)', () => {
  it('deve retornar 401 quando o e-mail não existe no banco', async () => {
    db.query.mockResolvedValueOnce({ rows: [] }); // Usuário não encontrado

    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'fantasma@teste.com', password: 'qualquer' });

    expect(res.status).toBe(401);
    expect(res.body.message).toBe('E-mail ou senha inválidos');
  });

  it('deve retornar 401 quando a senha está incorreta', async () => {
    db.query.mockResolvedValueOnce({ rows: [mockVerifiedUser] });
    bcrypt.compare.mockResolvedValueOnce(false); // Senha não bate

    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'maria@teste.com', password: 'senha-errada' });

    expect(res.status).toBe(401);
    expect(res.body.message).toBe('E-mail ou senha inválidos');
  });

  it('SEGURANÇA — e-mail inexistente e senha errada retornam a MESMA mensagem (sem enumeração)', async () => {
    // Caso 1: e-mail não existe
    db.query.mockResolvedValueOnce({ rows: [] });
    const resEmailInexistente = await request(app)
      .post('/api/auth/login')
      .send({ email: 'naoexiste@teste.com', password: 'qualquer' });

    // Caso 2: senha errada
    db.query.mockResolvedValueOnce({ rows: [mockVerifiedUser] });
    bcrypt.compare.mockResolvedValueOnce(false);
    const resSenhaErrada = await request(app)
      .post('/api/auth/login')
      .send({ email: 'maria@teste.com', password: 'senha-errada' });

    // Ambos devem ter status 401 e a MESMA mensagem — um atacante não consegue distinguir
    expect(resEmailInexistente.status).toBe(401);
    expect(resSenhaErrada.status).toBe(401);
    expect(resEmailInexistente.body.message).toBe(resSenhaErrada.body.message);
  });
});

// ==============================================================================
// BLOCO 3 — USUÁRIO NÃO VERIFICADO (403)
// ==============================================================================
describe('Auth — Login: E-mail Não Verificado (403)', () => {
  it('deve retornar 403 quando is_verified = false', async () => {
    const unverifiedUser = { ...mockVerifiedUser, is_verified: false };
    db.query.mockResolvedValueOnce({ rows: [unverifiedUser] });
    bcrypt.compare.mockResolvedValueOnce(true); // Senha correta

    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'maria@teste.com', password: 'senha123' });

    expect(res.status).toBe(403);
    expect(res.body.message).toBe('Por favor, confirme seu e-mail antes de acessar.');
  });
});

// ==============================================================================
// BLOCO 4 — LOGIN BEM-SUCEDIDO (200)
// Valida payload da resposta, payload do JWT e ausência de dados sensíveis.
// ==============================================================================
describe('Auth — Login: Sucesso (200)', () => {
  it('deve retornar 200 com token e dados do usuário', async () => {
    db.query.mockResolvedValueOnce({ rows: [mockVerifiedUser] });
    bcrypt.compare.mockResolvedValueOnce(true);

    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'maria@teste.com', password: 'senha123' });

    expect(res.status).toBe(200);
    // Valida todos os campos da resposta
    expect(res.body).toHaveProperty('token');
    expect(res.body).toHaveProperty('id',          mockVerifiedUser.id);
    expect(res.body).toHaveProperty('role',         mockVerifiedUser.role);
    expect(res.body).toHaveProperty('name',         mockVerifiedUser.name);
    expect(res.body).toHaveProperty('nickname',     mockVerifiedUser.nickname);
    expect(res.body).toHaveProperty('teacherType',  mockVerifiedUser.teacher_type);
  });

  it('JWT payload deve conter apenas {id, role} — sem password_hash', async () => {
    db.query.mockResolvedValueOnce({ rows: [mockVerifiedUser] });
    bcrypt.compare.mockResolvedValueOnce(true);

    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'maria@teste.com', password: 'senha123' });

    expect(res.status).toBe(200);
    const decoded = jwt.verify(res.body.token, JWT_SECRET);

    // Payload deve ter id e role
    expect(decoded).toHaveProperty('id',   mockVerifiedUser.id);
    expect(decoded).toHaveProperty('role', mockVerifiedUser.role);

    // Payload NÃO deve conter dados sensíveis
    expect(decoded).not.toHaveProperty('password_hash');
    expect(decoded).not.toHaveProperty('email');
    expect(decoded).not.toHaveProperty('password');
  });

  it('resposta NÃO deve expor password_hash no body', async () => {
    db.query.mockResolvedValueOnce({ rows: [mockVerifiedUser] });
    bcrypt.compare.mockResolvedValueOnce(true);

    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'maria@teste.com', password: 'senha123' });

    expect(res.body).not.toHaveProperty('password_hash');
    expect(res.body).not.toHaveProperty('password');
  });

  it('teacher_type nulo deve retornar teacherType como "institucional"', async () => {
    const userSemTeacherType = { ...mockVerifiedUser, teacher_type: null };
    db.query.mockResolvedValueOnce({ rows: [userSemTeacherType] });
    bcrypt.compare.mockResolvedValueOnce(true);

    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'maria@teste.com', password: 'senha123' });

    expect(res.status).toBe(200);
    expect(res.body.teacherType).toBe('institucional');
  });
});

// ==============================================================================
// BLOCO 5 — FALHA DE BANCO DE DADOS (500)
// Garante que exceções do pg retornam JSON limpo sem vazar stack traces.
// ==============================================================================
describe('Auth — Login: Falha de Banco (500)', () => {
  it('deve retornar 500 JSON limpo quando o banco falha', async () => {
    db.query.mockRejectedValueOnce(new Error('connection timeout'));

    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'maria@teste.com', password: 'senha123' });

    expect(res.status).toBe(500);
    expect(res.body).toHaveProperty('message');
    expect(res.body.message).toBe('Erro no servidor');
    // Garante que a stack trace NÃO está exposta
    expect(res.body).not.toHaveProperty('stack');
    expect(res.body).not.toHaveProperty('error');
  });
});
