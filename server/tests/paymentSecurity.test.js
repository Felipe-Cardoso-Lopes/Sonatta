/**
 * Security Sprint — Payment Domain
 *
 * Arquivo: tests/paymentSecurity.test.js
 *
 * Escopo:
 * - Autenticação e RBAC nas rotas financeiras
 * - IDOR e proteção Multi-Tenant
 * - Checkout
 * - Webhook
 */

process.env.SUPABASE_URL = 'http://dummy.supabase.co';
process.env.SUPABASE_SERVICE_ROLE_KEY = 'dummy_key';
process.env.JWT_SECRET = 'test_secret';
process.env.FRONTEND_URL = 'http://localhost:3000';
process.env.API_URL = 'http://localhost:5000';
process.env.MP_ACCESS_TOKEN = 'dummy_mp_token';

// ── Mock do banco de dados ─────────────────────────────────────────────────
jest.mock('../config/db', () => ({ query: jest.fn() }));

// ── Mock do MercadoPago ────────────────────────────────────────────────────
const mockPreferenceCreate = jest.fn();
const mockPaymentGet = jest.fn();

jest.mock('mercadopago', () => {
  return {
    MercadoPagoConfig: jest.fn().mockImplementation(() => ({})),
    Preference: jest.fn().mockImplementation(() => ({
      create: mockPreferenceCreate
    })),
    Payment: jest.fn().mockImplementation(() => ({
      get: mockPaymentGet
    }))
  };
});

// ── Dependências ───────────────────────────────────────────────────────────
const request = require('supertest');
const jwt = require('jsonwebtoken');
const { app } = require('../server');
const db = require('../config/db');
const { suppressExpectedConsoleError } = require('./helpers/console');

// ── Token factory ──────────────────────────────────────────────────────────
const sign = (payload) => jwt.sign(payload, process.env.JWT_SECRET);

const tokens = {
  student:     sign({ id: 10, role: 'aluno' }),
  teacher:     sign({ id: 20, role: 'professor' }),
  institution: sign({ id: 5, role: 'instituicao' }),
  superAdmin:  sign({ id: 1, role: 'super_admin' }),
};

beforeEach(() => {
  jest.clearAllMocks();
});

describe('Payment Security Tests', () => {
  suppressExpectedConsoleError();

  // ==========================================
  // BLOCO 1: Autenticação e RBAC
  // ==========================================
  describe('Autenticação e RBAC', () => {
    
    it('institution summary sem token deve retornar 401', async () => {
      const res = await request(app).get('/api/payments/institution/summary');
      expect(res.status).toBe(401);
    });

    it('institution transactions sem token deve retornar 401', async () => {
      const res = await request(app).get('/api/payments/institution/transactions');
      expect(res.status).toBe(401);
    });

    it('token inválido deve retornar 401', async () => {
      const res = await request(app)
        .get('/api/payments/institution/summary')
        .set('Authorization', 'Bearer invalid_token');
      expect(res.status).toBe(401);
    });

    it('estudante NÃO deve acessar institution financial summary (403)', async () => {
      const res = await request(app)
        .get('/api/payments/institution/summary')
        .set('Authorization', `Bearer ${tokens.student}`);
      expect(res.status).toBe(403);
    });

    it('professor NÃO deve acessar institution financial summary (403)', async () => {
      const res = await request(app)
        .get('/api/payments/institution/summary')
        .set('Authorization', `Bearer ${tokens.teacher}`);
      expect(res.status).toBe(403);
    });

    it('instituição PODE acessar institution financial summary (200)', async () => {
      db.query.mockResolvedValueOnce({ rows: [{ instituicao_id: '5' }] }); // user check
      db.query.mockResolvedValueOnce({ rows: [{ total: '500.00' }] }); // month
      db.query.mockResolvedValueOnce({ rows: [{ total: '150.00' }] }); // pending

      const res = await request(app)
        .get('/api/payments/institution/summary')
        .set('Authorization', `Bearer ${tokens.institution}`);
      expect(res.status).toBe(200);
    });

    it('super_admin PODE acessar institution financial summary (200)', async () => {
      db.query.mockResolvedValueOnce({ rows: [{ instituicao_id: '1' }] }); // user check
      db.query.mockResolvedValueOnce({ rows: [{ total: '100.00' }] }); // month
      db.query.mockResolvedValueOnce({ rows: [{ total: '0.00' }] }); // pending

      const res = await request(app)
        .get('/api/payments/institution/summary')
        .set('Authorization', `Bearer ${tokens.superAdmin}`);
      expect(res.status).toBe(200);
    });

  });

  // ==========================================
  // BLOCO 2: Multi-Tenant / IDOR
  // ==========================================
  describe('Multi-Tenant e Boundaries', () => {

    it('instituição deve ver apenas seu próprio resumo (IDOR prevention)', async () => {
      db.query.mockResolvedValueOnce({ rows: [{ instituicao_id: '5' }] }); // user check
      db.query.mockResolvedValueOnce({ rows: [{ total: '500.00' }] }); // month
      db.query.mockResolvedValueOnce({ rows: [{ total: '150.00' }] }); // pending

      const res = await request(app)
        .get('/api/payments/institution/summary?instituicao_id=999') // Tentativa de injeção
        .set('Authorization', `Bearer ${tokens.institution}`)
        .send({ instituicao_id: 999 }); // Tentativa de injeção

      expect(res.status).toBe(200);
      
      // O backend deve usar o instituicao_id "5" obtido pelo banco/token, ignorando req.query e req.body
      expect(db.query.mock.calls[1][1]).toEqual(['5']); 
      expect(db.query.mock.calls[2][1]).toEqual(['5']); 
    });

    it('instituição deve ver apenas suas próprias transações (IDOR prevention)', async () => {
      db.query.mockResolvedValueOnce({ rows: [{ instituicao_id: '5' }] }); // user check
      db.query.mockResolvedValueOnce({ rows: [] }); // transactions

      const res = await request(app)
        .get('/api/payments/institution/transactions?instituicao_id=999')
        .set('Authorization', `Bearer ${tokens.institution}`)
        .send({ instituicao_id: 999 });

      expect(res.status).toBe(200);
      expect(db.query.mock.calls[1][1][0]).toEqual('5'); // O primeiro param deve ser '5'
    });

  });

  // ==========================================
  // BLOCO 3: Checkout
  // ==========================================
  describe('Checkout Sessões', () => {

    it('checkout deve exigir contexto autenticado e de instituição', async () => {
      const res = await request(app)
        .post('/api/payments/checkout')
        .set('Authorization', `Bearer ${tokens.student}`)
        .send({ plan_id: 1 });
      
      // RBAC falha e retorna 403
      expect(res.status).toBe(403);
    });

    it('checkout não deve permitir criar pagamentos para outra instituição', async () => {
      // O controller força o instId baseado no banco de dados para o token logado.
      db.query.mockResolvedValueOnce({ rows: [{ email: 'inst@test.com', instituicao_id: '5' }] });
      db.query.mockResolvedValueOnce({ rows: [{ id: 1, name: 'Premium', price: 99.90 }] });
      mockPreferenceCreate.mockResolvedValueOnce({
        init_point: 'url',
        sandbox_init_point: 'url',
        id: 'pref_123'
      });

      const res = await request(app)
        .post('/api/payments/checkout')
        .set('Authorization', `Bearer ${tokens.institution}`)
        .send({ plan_id: 1, instituicao_id: 999 }); // Tentativa de forçar checkout de outra inst

      expect(res.status).toBe(201);
      const callArgs = mockPreferenceCreate.mock.calls[0][0];
      
      // A external_reference gerada deve ser da instituição logada (5) e não a do body (999)
      expect(callArgs.body.external_reference).toBe('inst_5_plan_Premium');
    });

    it('falta de campos obrigatórios deve retornar 400', async () => {
      const res = await request(app)
        .post('/api/payments/checkout')
        .set('Authorization', `Bearer ${tokens.institution}`)
        .send({}); // Faltando plan_id
      
      expect(res.status).toBe(400);
      expect(res.body.message).toBe('O plan_id é obrigatório.');
    });

    it('falha de banco de dados deve retornar 500 limpo (JSON)', async () => {
      db.query.mockRejectedValueOnce(new Error('DB Failed'));

      const res = await request(app)
        .post('/api/payments/checkout')
        .set('Authorization', `Bearer ${tokens.institution}`)
        .send({ plan_id: 1 });

      expect(res.status).toBe(500);
      expect(res.body.message).toBe('Erro interno ao criar sessão de pagamento.');
      expect(res.body).not.toHaveProperty('stack');
      expect(res.body).not.toHaveProperty('error');
    });

  });

  // ==========================================
  // BLOCO 4: Webhook
  // ==========================================
  describe('Webhook (MercadoPago)', () => {

    it('deve validar external_reference e ignorar formato malformado (retornando 200 para o MP)', async () => {
      mockPaymentGet.mockResolvedValueOnce({
        status: 'approved',
        external_reference: 'hack_plan_malicioso' // Formato inválido
      });

      const res = await request(app)
        .post('/api/payments/webhook')
        .send({ type: 'payment', data: { id: 'pay_123' } });

      expect(res.status).toBe(200);
      expect(db.query).not.toHaveBeenCalled(); // Não atualiza BD
    });

    it('não deve expor stack trace em caso de erro interno', async () => {
      mockPaymentGet.mockRejectedValueOnce(new Error('MP API down'));

      const res = await request(app)
        .post('/api/payments/webhook')
        .send({ type: 'payment', data: { id: 'pay_123' } });

      // Deve retornar 200 para o MP (MP reenvia se for falha de rede deles, mas nossa API responde 200 pra evitar retrys inúteis se falhamos)
      expect(res.status).toBe(200); 
      expect(res.body).not.toHaveProperty('stack');
    });

    it('mapeamento de status (approved -> ativo)', async () => {
      mockPaymentGet.mockResolvedValueOnce({
        status: 'approved',
        external_reference: 'inst_5_plan_Premium'
      });
      db.query.mockResolvedValueOnce({});

      await request(app)
        .post('/api/payments/webhook')
        .send({ type: 'payment', data: { id: 'pay_123' } });

      expect(db.query.mock.calls[0][1]).toEqual(['5', 'Premium', 'ativo']);
    });

    it('eventos duplicados devem ser seguros e tolerados pelo ON CONFLICT do BD', async () => {
      mockPaymentGet.mockResolvedValue({
        status: 'pending',
        external_reference: 'inst_5_plan_Premium'
      });
      db.query.mockResolvedValue({});

      // Simula 2 webhooks iguais (MP às vezes envia duplicado)
      await request(app).post('/api/payments/webhook').send({ type: 'payment', data: { id: 'pay_123' } });
      await request(app).post('/api/payments/webhook').send({ type: 'payment', data: { id: 'pay_123' } });

      expect(db.query).toHaveBeenCalledTimes(2);
      expect(db.query.mock.calls[0][0]).toContain('ON CONFLICT');
      expect(db.query.mock.calls[1][0]).toContain('ON CONFLICT');
    });

  });

});
