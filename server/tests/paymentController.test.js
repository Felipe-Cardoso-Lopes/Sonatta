// Mock das variáveis de ambiente necessárias para evitar crash do Supabase e do MercadoPago
process.env.SUPABASE_URL = 'http://dummy.supabase.co';
process.env.SUPABASE_SERVICE_ROLE_KEY = 'dummy_key';
process.env.JWT_SECRET = 'test_secret';
process.env.FRONTEND_URL = 'http://localhost:3000';
process.env.API_URL = 'http://localhost:5000';
process.env.MP_ACCESS_TOKEN = 'dummy_mp_token';

const request = require('supertest');
const { app } = require('../server');
const db = require('../config/db');
const jwt = require('jsonwebtoken');
const { suppressExpectedConsoleError } = require('./helpers/console');

// Mock do banco de dados
jest.mock('../config/db', () => ({
  query: jest.fn()
}));

// Mock do MercadoPago
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

describe('Payment Controller Integration Tests', () => {
  let token;
  const mockUser = { id: 1, role: 'instituicao' };

  // DB failure tests acionam console.error nos controllers (comportamento esperado de produção).
  suppressExpectedConsoleError();

  beforeAll(() => {
    token = jwt.sign(mockUser, process.env.JWT_SECRET, { expiresIn: '1h' });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/payments/checkout', () => {
    it('deve criar uma sessão de checkout com sucesso', async () => {
      // Mock db.query for user fetch
      db.query.mockResolvedValueOnce({
        rows: [{ email: 'inst@test.com', instituicao_id: '1' }]
      });
      // Mock db.query for plan
      db.query.mockResolvedValueOnce({
        rows: [{ id: 1, name: 'Premium', price: 99.90 }]
      });

      mockPreferenceCreate.mockResolvedValueOnce({
        init_point: 'https://checkout.url',
        sandbox_init_point: 'https://sandbox.checkout.url',
        id: 'pref_123'
      });

      const response = await request(app)
        .post('/api/payments/checkout')
        .set('Authorization', `Bearer ${token}`)
        .send({ plan_id: 1 });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('checkout_url', 'https://checkout.url');
      expect(response.body).toHaveProperty('sandbox_url', 'https://sandbox.checkout.url');
      expect(response.body).toHaveProperty('preference_id', 'pref_123');
      expect(db.query).toHaveBeenCalledTimes(2);
      expect(mockPreferenceCreate).toHaveBeenCalledTimes(1);
    });

    it('deve retornar 400 se plan_id não for fornecido', async () => {
      const response = await request(app)
        .post('/api/payments/checkout')
        .set('Authorization', `Bearer ${token}`)
        .send({});

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('O plan_id é obrigatório.');
      expect(db.query).not.toHaveBeenCalled();
    });

    it('deve retornar 404 se o usuário não for encontrado', async () => {
      db.query.mockResolvedValueOnce({ rows: [] }); // User not found

      const response = await request(app)
        .post('/api/payments/checkout')
        .set('Authorization', `Bearer ${token}`)
        .send({ plan_id: 1 });

      expect(response.status).toBe(404);
      expect(response.body.message).toBe('Usuário não encontrado.');
    });

    it('deve retornar 404 se o plano não for encontrado no banco', async () => {
      db.query.mockResolvedValueOnce({
        rows: [{ email: 'inst@test.com', instituicao_id: '1' }]
      });
      db.query.mockResolvedValueOnce({ rows: [] }); // Plan not found

      const response = await request(app)
        .post('/api/payments/checkout')
        .set('Authorization', `Bearer ${token}`)
        .send({ plan_id: 999 });

      expect(response.status).toBe(404);
      expect(response.body.message).toBe('Plano não encontrado.');
    });

    it('deve retornar 500 em caso de erro no banco de dados', async () => {
      db.query.mockRejectedValueOnce(new Error('DB Error'));

      const response = await request(app)
        .post('/api/payments/checkout')
        .set('Authorization', `Bearer ${token}`)
        .send({ plan_id: 1 });

      expect(response.status).toBe(500);
      expect(response.body.message).toBe('Erro interno ao criar sessão de pagamento.');
    });
  });

  describe('POST /api/payments/webhook', () => {
    it('deve ignorar eventos que não sejam do tipo "payment" (retornar 200)', async () => {
      const response = await request(app)
        .post('/api/payments/webhook')
        .send({ type: 'plan', data: { id: '123' } });

      expect(response.status).toBe(200);
      expect(mockPaymentGet).not.toHaveBeenCalled();
      expect(db.query).not.toHaveBeenCalled();
    });

    it('deve processar pagamento "approved" e atualizar a assinatura como "ativo"', async () => {
      mockPaymentGet.mockResolvedValueOnce({
        status: 'approved',
        external_reference: 'inst_1_plan_Premium'
      });
      db.query.mockResolvedValueOnce({});

      const response = await request(app)
        .post('/api/payments/webhook')
        .send({ type: 'payment', data: { id: 'pay_123' } });

      expect(response.status).toBe(200);
      expect(mockPaymentGet).toHaveBeenCalledWith({ id: 'pay_123' });
      expect(db.query).toHaveBeenCalledTimes(1);
      // Verifica se chamou a query com os parametros corretos: [instituicaoId, planName, novoStatus]
      expect(db.query.mock.calls[0][1]).toEqual(['1', 'Premium', 'ativo']);
    });

    it('deve processar pagamento "pending" e atualizar a assinatura como "pendente"', async () => {
      mockPaymentGet.mockResolvedValueOnce({
        status: 'pending',
        external_reference: 'inst_1_plan_Premium'
      });
      db.query.mockResolvedValueOnce({});

      const response = await request(app)
        .post('/api/payments/webhook')
        .send({ type: 'payment', data: { id: 'pay_124' } });

      expect(response.status).toBe(200);
      expect(db.query.mock.calls[0][1]).toEqual(['1', 'Premium', 'pendente']);
    });

    it('deve ignorar external_reference com formato inválido (retornar 200)', async () => {
      mockPaymentGet.mockResolvedValueOnce({
        status: 'approved',
        external_reference: 'invalid_format'
      });

      const response = await request(app)
        .post('/api/payments/webhook')
        .send({ type: 'payment', data: { id: 'pay_125' } });

      expect(response.status).toBe(200);
      expect(db.query).not.toHaveBeenCalled();
    });
  });

  describe('GET /api/payments/institution/summary', () => {
    it('deve retornar o resumo financeiro com sucesso', async () => {
      db.query.mockResolvedValueOnce({ rows: [{ instituicao_id: '1' }] }); // user fetch
      db.query.mockResolvedValueOnce({ rows: [{ total: '500.00' }] }); // currentMonth
      db.query.mockResolvedValueOnce({ rows: [{ total: '150.00' }] }); // pendingTransfers

      const response = await request(app)
        .get('/api/payments/institution/summary')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        currentMonthRevenue: 500,
        pendingTransfers: 150
      });
      expect(db.query).toHaveBeenCalledTimes(3);
    });

    it('deve retornar 500 em caso de erro no banco de dados', async () => {
      db.query.mockRejectedValueOnce(new Error('DB Error'));

      const response = await request(app)
        .get('/api/payments/institution/summary')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(500);
      expect(response.body.message).toBe('Erro ao buscar resumo financeiro.');
    });
  });

  describe('GET /api/payments/institution/transactions', () => {
    it('deve buscar as transações com sucesso', async () => {
      db.query.mockResolvedValueOnce({ rows: [{ instituicao_id: '1' }] }); // user fetch
      const mockTransactions = [{ id: 1, net_value: 100, status: 'paid' }];
      db.query.mockResolvedValueOnce({ rows: mockTransactions });

      const response = await request(app)
        .get('/api/payments/institution/transactions')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockTransactions);
      expect(db.query).toHaveBeenCalledTimes(2);
    });

    it('deve aplicar filtros de startDate, endDate e status corretamente', async () => {
      db.query.mockResolvedValueOnce({ rows: [{ instituicao_id: '1' }] }); // user fetch
      db.query.mockResolvedValueOnce({ rows: [] });

      const response = await request(app)
        .get('/api/payments/institution/transactions?startDate=2023-01-01&endDate=2023-12-31&status=paid')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(db.query).toHaveBeenCalledTimes(2);
      
      const sqlQuery = db.query.mock.calls[1][0];
      const params = db.query.mock.calls[1][1];
      
      expect(sqlQuery).toContain('payment_date >= $2');
      expect(sqlQuery).toContain('payment_date <= $3');
      expect(sqlQuery).toContain('status = $4');
      // instId, startDate, endDate, status => params[0], params[1], params[2], params[3]
      expect(params[1]).toBe('2023-01-01');
      expect(params[2]).toBe('2023-12-31 23:59:59');
      expect(params[3]).toBe('paid');
    });

    it('deve retornar 500 em caso de erro no banco de dados', async () => {
      db.query.mockRejectedValueOnce(new Error('DB Error'));

      const response = await request(app)
        .get('/api/payments/institution/transactions')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(500);
      expect(response.body.message).toBe('Erro ao buscar transações.');
    });
  });
});
