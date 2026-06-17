/**
 * Security Sprint Cycle 3B — Testes de Segurança: Rotas Públicas
 *
 * Cobre:
 *   - PUT  /api/users/complete/:id   (IDOR + ausência de autenticação)
 *   - POST /api/users/preferences    (IDOR + ausência de autenticação)
 *   - GET  /api/admin/stats          (exposição pública de métricas administrativas)
 */

// ── Mock do nodemailer (antes de qualquer require) ─────────────────────────
jest.mock('nodemailer', () => ({
  createTransport: jest.fn().mockReturnValue({
    sendMail: jest.fn().mockResolvedValue({ messageId: 'mock-id' }),
  }),
}));

// ── Mock do banco de dados ─────────────────────────────────────────────────
jest.mock('../config/db', () => ({ query: jest.fn() }));

// ── Dependências ───────────────────────────────────────────────────────────
const request = require('supertest');
const jwt     = require('jsonwebtoken');
const { app } = require('../server');
const db      = require('../config/db');
const { suppressExpectedConsoleError } = require('./helpers/console');

// ── Token factory ──────────────────────────────────────────────────────────
const sign = (payload) => jwt.sign(payload, process.env.JWT_SECRET);

const tokens = {
  user1:      sign({ id: 10, role: 'aluno' }),
  user2:      sign({ id: 20, role: 'aluno' }),
  instituicao: sign({ id: 5, role: 'instituicao' }),
  superAdmin:  sign({ id: 1, role: 'super_admin' }),
};

// ── Setup ──────────────────────────────────────────────────────────────────
beforeEach(() => jest.clearAllMocks());

// ══════════════════════════════════════════════════════════════════════════
// BLOCO 1 — PUT /api/users/complete/:id
// Risco: IDOR — qualquer utilizador (ou anônimo) pode alterar dados de
//        qualquer perfil simplesmente passando um :id diferente na URL.
// ══════════════════════════════════════════════════════════════════════════
describe('Segurança — PUT /api/users/complete/:id', () => {
  suppressExpectedConsoleError();

  it('sem token deve retornar 401', async () => {
    const res = await request(app)
      .put('/api/users/complete/10')
      .send({ nickname: 'hacker', birth_date: '2000-01-01' });

    expect(res.status).toBe(401);
    expect(res.body.message).toBe('Não autorizado, nenhum token fornecido.');
  });

  it('com token inválido deve retornar 401', async () => {
    const res = await request(app)
      .put('/api/users/complete/10')
      .set('Authorization', 'Bearer token.invalido.assinado')
      .send({ nickname: 'hacker', birth_date: '2000-01-01' });

    expect(res.status).toBe(401);
    expect(res.body.message).toBe('Não autorizado, token inválido ou expirado.');
  });

  it('utilizador autenticado NÃO deve atualizar dados de OUTRO utilizador → 403', async () => {
    // user2 (id=20) tenta alterar o perfil do user1 (id=10)
    const res = await request(app)
      .put('/api/users/complete/10')
      .set('Authorization', `Bearer ${tokens.user2}`)
      .send({ nickname: 'intruso', birth_date: '1990-05-05' });

    expect(res.status).toBe(403);
  });

  it('utilizador autenticado pode atualizar APENAS o seu próprio perfil → 200', async () => {
    db.query.mockResolvedValueOnce({
      rows: [{ id: 10, nickname: 'meu_nick', birth_date: '2000-01-01' }],
    });

    const res = await request(app)
      .put('/api/users/complete/10')
      .set('Authorization', `Bearer ${tokens.user1}`)
      .send({ nickname: 'meu_nick', birth_date: '2000-01-01' });

    expect(res.status).toBe(200);
    expect(res.body.message).toBe('Cadastro finalizado com sucesso!');
  });
});

// ══════════════════════════════════════════════════════════════════════════
// BLOCO 2 — POST /api/users/preferences
// Risco: IDOR — qualquer utilizador envia userId no body e grava
//        preferências de outra conta.
// ══════════════════════════════════════════════════════════════════════════
describe('Segurança — POST /api/users/preferences', () => {
  suppressExpectedConsoleError();

  it('sem token deve retornar 401', async () => {
    const res = await request(app)
      .post('/api/users/preferences')
      .send({ userId: 10, nivel: 'intermediário', instrumentos: ['Piano'], generos: ['MPB'] });

    expect(res.status).toBe(401);
    expect(res.body.message).toBe('Não autorizado, nenhum token fornecido.');
  });

  it('com token inválido deve retornar 401', async () => {
    const res = await request(app)
      .post('/api/users/preferences')
      .set('Authorization', 'Bearer token.invalido.assinado')
      .send({ userId: 10, nivel: 'iniciante', instrumentos: ['Violão'], generos: ['Rock'] });

    expect(res.status).toBe(401);
    expect(res.body.message).toBe('Não autorizado, token inválido ou expirado.');
  });

  it('utilizador NÃO deve gravar preferências de OUTRO utilizador (IDOR) → 403', async () => {
    // user2 (id=20) tenta escrever preferências para user1 (id=10)
    const res = await request(app)
      .post('/api/users/preferences')
      .set('Authorization', `Bearer ${tokens.user2}`)
      .send({ userId: 10, nivel: 'avançado', instrumentos: ['Bateria'], generos: ['Jazz'] });

    expect(res.status).toBe(403);
  });

  it('utilizador autenticado salva APENAS as suas próprias preferências → 200', async () => {
    db.query.mockResolvedValueOnce({
      rows: [{ user_id: 10, nivel_musical: 'iniciante', instrumentos: ['Violão'], generos: ['MPB'] }],
    });

    const res = await request(app)
      .post('/api/users/preferences')
      .set('Authorization', `Bearer ${tokens.user1}`)
      .send({ nivel: 'iniciante', instrumentos: ['Violão'], generos: ['MPB'] });

    expect(res.status).toBe(200);
    expect(res.body.message).toBe('Preferências salvas com sucesso!');
    // Confirma que o ID usado na query é do token (req.user.id), não do body
    expect(db.query).toHaveBeenCalledWith(
      expect.any(String),
      expect.arrayContaining([10]) // req.user.id = 10, não userId do body
    );
  });
});

// ══════════════════════════════════════════════════════════════════════════
// BLOCO 3 — GET /api/admin/stats
// Risco: rota completamente pública sem qualquer controle de acesso.
// ══════════════════════════════════════════════════════════════════════════
describe('Segurança — GET /api/admin/stats', () => {
  suppressExpectedConsoleError();

  it('sem token deve retornar 401', async () => {
    const res = await request(app).get('/api/admin/stats');

    expect(res.status).toBe(401);
    expect(res.body.message).toBe('Não autorizado, nenhum token fornecido.');
  });

  it('com token inválido deve retornar 401', async () => {
    const res = await request(app)
      .get('/api/admin/stats')
      .set('Authorization', 'Bearer token.invalido.assinado');

    expect(res.status).toBe(401);
    expect(res.body.message).toBe('Não autorizado, token inválido ou expirado.');
  });

  it('aluno com token válido deve receber 403', async () => {
    const res = await request(app)
      .get('/api/admin/stats')
      .set('Authorization', `Bearer ${tokens.user1}`);

    expect(res.status).toBe(403);
  });

  it('instituicao com token válido deve receber 403', async () => {
    const res = await request(app)
      .get('/api/admin/stats')
      .set('Authorization', `Bearer ${tokens.instituicao}`);

    expect(res.status).toBe(403);
  });

  it('super_admin deve receber estatísticas com sucesso → 200', async () => {
    db.query
      .mockResolvedValueOnce({ rows: [{ count: '120' }] }) // students
      .mockResolvedValueOnce({ rows: [{ count: '30' }] })  // teachers
      .mockResolvedValueOnce({ rows: [{ count: '200' }] }); // lessons

    const res = await request(app)
      .get('/api/admin/stats')
      .set('Authorization', `Bearer ${tokens.superAdmin}`);

    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      totalStudents: 120,
      totalTeachers: 30,
      totalLessons:  200,
    });
  });
});
