/**
 * Security Sprint Cycle 3C — Testes de Autenticação e Onboarding
 *
 * Arquivo: tests/authVerification.test.js
 *
 * Escopo:
 * - POST /api/auth/send-code
 * - POST /api/auth/verify-code
 * - POST /api/auth/register-institution
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
const { app } = require('../server');
const db      = require('../config/db');
const { suppressExpectedConsoleError } = require('./helpers/console');

// ── Setup ──────────────────────────────────────────────────────────────────
beforeEach(() => {
  jest.clearAllMocks();
});

// Mock transporter para forçar falha no nodemailer
const nodemailer = require('nodemailer');
const mockTransporter = nodemailer.createTransport();

describe('Auth Verification Controller', () => {

  // ==========================================
  // BLOCO 1: POST /api/auth/send-code
  // ==========================================
  describe('POST /api/auth/send-code', () => {
    suppressExpectedConsoleError();

    it('deve retornar 400 se o email estiver ausente', async () => {
      const res = await request(app).post('/api/auth/send-code').send({});
      expect(res.status).toBe(400);
      expect(res.body.message).toBe('E-mail é obrigatório.');
    });

    it('deve retornar 404 se o e-mail não for encontrado', async () => {
      db.query.mockResolvedValueOnce({ rows: [] }); // User não encontrado

      const res = await request(app).post('/api/auth/send-code').send({ email: 'inexistente@teste.com' });
      expect(res.status).toBe(404);
      expect(res.body.message).toBe('Usuário não encontrado.');
    });

    it('deve retornar 400 se o usuário já estiver verificado', async () => {
      db.query.mockResolvedValueOnce({ rows: [{ id: 1, is_verified: true }] });

      const res = await request(app).post('/api/auth/send-code').send({ email: 'verificado@teste.com' });
      expect(res.status).toBe(400);
      expect(res.body.message).toBe('Este e-mail já está verificado.');
    });

    it('deve retornar 200 com geração de código bem sucedida', async () => {
      db.query.mockResolvedValueOnce({ rows: [{ id: 1, is_verified: false }] }); // Verifica usuário
      db.query.mockResolvedValueOnce({}); // Atualiza código

      const res = await request(app).post('/api/auth/send-code').send({ email: 'valido@teste.com' });
      expect(res.status).toBe(200);
      expect(res.body.message).toBe('Código enviado com sucesso.');
      expect(mockTransporter.sendMail).toHaveBeenCalled();
    });

    it('deve retornar 500 em falha de envio de e-mail (mail transport failure)', async () => {
      db.query.mockResolvedValueOnce({ rows: [{ id: 1, is_verified: false }] }); // Verifica usuário
      db.query.mockResolvedValueOnce({}); // Atualiza código
      mockTransporter.sendMail.mockRejectedValueOnce(new Error('SMTP falhou'));

      const res = await request(app).post('/api/auth/send-code').send({ email: 'valido@teste.com' });
      expect(res.status).toBe(500);
      expect(res.body.message).toBe('Erro no servidor ao enviar o e-mail.');
    });

    it('deve retornar 500 JSON limpo sem stack em caso de falha de BD', async () => {
      db.query.mockRejectedValueOnce(new Error('Erro DB'));

      const res = await request(app).post('/api/auth/send-code').send({ email: 'valido@teste.com' });
      expect(res.status).toBe(500);
      expect(res.body.message).toBe('Erro no servidor ao enviar o e-mail.');
      expect(res.body).not.toHaveProperty('stack');
      expect(res.body).not.toHaveProperty('error');
    });
  });

  // ==========================================
  // BLOCO 2: POST /api/auth/verify-code
  // ==========================================
  describe('POST /api/auth/verify-code', () => {
    suppressExpectedConsoleError();

    it('deve retornar 400 se o email estiver ausente', async () => {
      const res = await request(app).post('/api/auth/verify-code').send({ code: '123456' });
      expect(res.status).toBe(400);
      expect(res.body.message).toBe('E-mail e código são obrigatórios.');
    });

    it('deve retornar 400 se o código estiver ausente', async () => {
      const res = await request(app).post('/api/auth/verify-code').send({ email: 'valido@teste.com' });
      expect(res.status).toBe(400);
      expect(res.body.message).toBe('E-mail e código são obrigatórios.');
    });

    it('deve retornar 400 se email e código estiverem ausentes', async () => {
      const res = await request(app).post('/api/auth/verify-code').send({});
      expect(res.status).toBe(400);
      expect(res.body.message).toBe('E-mail e código são obrigatórios.');
    });

    it('deve retornar 404 se o e-mail não for encontrado', async () => {
      db.query.mockResolvedValueOnce({ rows: [] });

      const res = await request(app).post('/api/auth/verify-code').send({ email: 'inexistente@teste.com', code: '123456' });
      expect(res.status).toBe(404);
      expect(res.body.message).toBe('Usuário não encontrado.');
    });

    it('deve retornar 400 se o código for inválido', async () => {
      db.query.mockResolvedValueOnce({ 
        rows: [{ id: 1, verification_code: '654321', verification_expires: new Date(Date.now() + 10000) }] 
      });

      const res = await request(app).post('/api/auth/verify-code').send({ email: 'valido@teste.com', code: '111111' });
      expect(res.status).toBe(400);
      expect(res.body.message).toBe('Código inválido.');
    });

    it('deve retornar 400 se o código estiver expirado', async () => {
      db.query.mockResolvedValueOnce({ 
        rows: [{ id: 1, verification_code: '123456', verification_expires: new Date(Date.now() - 10000) }] 
      });

      const res = await request(app).post('/api/auth/verify-code').send({ email: 'valido@teste.com', code: '123456' });
      expect(res.status).toBe(400);
      expect(res.body.message).toBe('Código expirado. Solicite um novo.');
    });

    it('deve retornar 200 para verificação bem sucedida e limpar os campos de código', async () => {
      db.query.mockResolvedValueOnce({ 
        rows: [{ id: 1, verification_code: '123456', verification_expires: new Date(Date.now() + 100000) }] 
      });
      db.query.mockResolvedValueOnce({}); // Update successful

      const res = await request(app).post('/api/auth/verify-code').send({ email: 'valido@teste.com', code: '123456' });
      expect(res.status).toBe(200);
      expect(res.body.message).toBe('E-mail verificado com sucesso!');
      
      // Verifica se a query de update limpou os campos corretos
      expect(db.query).toHaveBeenCalledWith(
        'UPDATE users SET is_verified = true, verification_code = NULL, verification_expires = NULL WHERE email = $1',
        ['valido@teste.com']
      );
    });

    it('deve retornar 500 JSON limpo sem stack em caso de falha de BD', async () => {
      db.query.mockRejectedValueOnce(new Error('Erro DB'));

      const res = await request(app).post('/api/auth/verify-code').send({ email: 'valido@teste.com', code: '123456' });
      expect(res.status).toBe(500);
      expect(res.body.message).toBe('Erro interno no servidor.');
      expect(res.body).not.toHaveProperty('stack');
      expect(res.body).not.toHaveProperty('error');
    });
  });

  // ==========================================
  // BLOCO 3: POST /api/auth/register-institution
  // ==========================================
  describe('POST /api/auth/register-institution', () => {
    suppressExpectedConsoleError();

    it('deve retornar 400 se campos obrigatórios (nome, email) estiverem ausentes', async () => {
      const res = await request(app).post('/api/auth/register-institution').send({ nome: 'Escola XYZ' });
      expect(res.status).toBe(400);
      expect(res.body.message).toBe('Nome e e-mail são obrigatórios.');

      const res2 = await request(app).post('/api/auth/register-institution').send({ email: 'escola@xyz.com' });
      expect(res2.status).toBe(400);
      expect(res2.body.message).toBe('Nome e e-mail são obrigatórios.');
    });

    it('deve retornar 400 em caso de e-mail duplicado', async () => {
      db.query.mockResolvedValueOnce({ rows: [{ id: 1 }] }); // Escola já existe

      const res = await request(app).post('/api/auth/register-institution')
        .send({ nome: 'Escola XYZ', email: 'duplicado@xyz.com' });
      expect(res.status).toBe(400);
      expect(res.body.message).toBe('Este e-mail já está em uso por outra instituição.');
    });

    it('deve retornar 201 com registro bem sucedido, ignorando escalada de status', async () => {
      db.query.mockResolvedValueOnce({ rows: [] }); // Email livre
      db.query.mockResolvedValueOnce({ 
        rows: [{ id: 1, nome: 'Escola Nova', email: 'nova@escola.com', status: 'pendente' }] 
      });

      const res = await request(app).post('/api/auth/register-institution')
        .send({ nome: 'Escola Nova', email: 'nova@escola.com', status: 'ativo' }); // Payload tenta forçar status 'ativo'
      
      expect(res.status).toBe(201);
      expect(res.body.message).toBe('Cadastro recebido com sucesso! Aguarde aprovação.');
      
      // O status recebido deve ser "pendente" independente do payload enviado
      expect(res.body.institution.status).toBe('pendente');
      
      // Verifica se o insert usou hardcoded 'pendente'
      expect(db.query.mock.calls[1][0]).toContain("'pendente'");
    });

    it('deve retornar 500 JSON limpo sem stack em caso de falha de BD', async () => {
      db.query.mockRejectedValueOnce(new Error('Erro DB'));

      const res = await request(app).post('/api/auth/register-institution')
        .send({ nome: 'Escola XYZ', email: 'escola@xyz.com' });
      
      expect(res.status).toBe(500);
      expect(res.body.message).toBe('Erro interno no servidor ao processar o cadastro.');
      expect(res.body).not.toHaveProperty('stack');
      expect(res.body).not.toHaveProperty('error');
    });
  });

});
