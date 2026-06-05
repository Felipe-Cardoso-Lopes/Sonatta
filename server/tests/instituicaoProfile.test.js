const request = require('supertest');
const express = require('express');

// 1. Mock do middleware de autenticação (DEVE VIR ANTES DA IMPORTAÇÃO DAS ROTAS)
// Isso impede que o JWT verdadeiro tente validar as strings falsas dos testes.
jest.mock('../middlewares/authMiddleware', () => ({
  verifyToken: (req, res, next) => {
    req.user = req.headers['authorization'] === 'Bearer token-instituicao' 
      ? { id: 1, role: 'instituicao' } 
      : { id: 2, role: 'aluno' };
    next();
  }
}));

// 2. Importações regulares
const instituicaoRoutes = require('../routes/instituicaoRoutes');
const db = require('../config/db'); 

// 3. Mock do banco de dados
jest.mock('../config/db', () => ({
  query: jest.fn(),
}));

// 4. Setup do App Express isolado
const app = express();
app.use(express.json());
// Não precisamos mais do app.use com middleware solto aqui, pois o mock acima já faz o trabalho
app.use('/api/instituicoes', instituicaoRoutes);

// 5. Bloco de Testes
describe('PUT /api/instituicoes/profile', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('Deve retornar 403 se o usuário não for uma instituição', async () => {
    const res = await request(app)
      .put('/api/instituicoes/profile')
      .set('Authorization', 'Bearer token-aluno')
      .send({ descricao_longa: 'Teste' });

    expect(res.statusCode).toBe(403);
    expect(res.body.message).toMatch(/Acesso negado/);
  });

  it('Deve retornar 400 se enviar uma URL inválida', async () => {
    const res = await request(app)
      .put('/api/instituicoes/profile')
      .set('Authorization', 'Bearer token-instituicao')
      .send({ website_url: 'site-invalido' });

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toMatch(/URL válida/);
  });

  it('Deve atualizar o perfil com sucesso e retornar 200', async () => {
    db.query.mockResolvedValueOnce({ rows: [{ id: 1, descricao_longa: 'Nova descrição' }] });

    const res = await request(app)
      .put('/api/instituicoes/profile')
      .set('Authorization', 'Bearer token-instituicao')
      .send({ descricao_longa: 'Nova descrição', website_url: 'https://escola.com' });

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('Perfil público atualizado com sucesso!');
    expect(db.query).toHaveBeenCalledTimes(1);
  });
});