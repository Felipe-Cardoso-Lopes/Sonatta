// 1. O segredo DEVE ser definido antes de qualquer require
process.env.JWT_SECRET = 'segredo-de-teste';

const request = require('supertest');
const jwt = require('jsonwebtoken');
const app = require('../server');
const db = require('../config/db');

// Mock do banco de dados
jest.mock('../config/db', () => ({
  query: jest.fn(),
}));

describe('Middleware de Autenticação (protect)', () => {
  // Silencia os console.error do seu código apenas durante os testes 
  // para o terminal não ficar poluído com o log de token inválido esperado.
  beforeAll(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterAll(() => {
    console.error.mockRestore();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deve retornar 401 se nenhum token for fornecido', async () => {
    const response = await request(app)
      .put('/api/users/profile')
      .send({ name: 'Novo Nome' });

    expect(response.status).toBe(401);
    expect(response.body.message).toBe('Não autorizado, nenhum token fornecido.');
  });

  it('deve retornar 401 se o token for inválido', async () => {
    const response = await request(app)
      .put('/api/users/profile')
      .set('Authorization', 'Bearer token.totalmente.invalido')
      .send({ name: 'Novo Nome' });

    expect(response.status).toBe(401);
    expect(response.body.message).toBe('Não autorizado, token inválido ou expirado.');
  });

  it('deve permitir o acesso e atualizar o perfil se o token for válido', async () => {
    const token = jwt.sign({ id: 1, role: 'aluno' }, process.env.JWT_SECRET);

    // Como o seu middleware não vai ao banco, precisamos de APENAS UM mock: 
    // O mock do UPDATE executado pelo userController.js
    db.query.mockResolvedValueOnce({
      rows: [{ id: 1, name: 'João Atualizado', email: 'joao@teste.com', role: 'aluno' }]
    });

    const response = await request(app)
      .put('/api/users/profile')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'João Atualizado' });

    expect(response.status).toBe(200);
    expect(response.body.name).toBe('João Atualizado');
    expect(db.query).toHaveBeenCalledTimes(1);
  });

  it('deve retornar 404 se o token for válido mas o usuário não existir no banco', async () => {
    const token = jwt.sign({ id: 99, role: 'aluno' }, process.env.JWT_SECRET);

    // O controller tenta dar o UPDATE e o banco não retorna nada
    db.query.mockResolvedValueOnce({ rows: [] });

    const response = await request(app)
      .put('/api/users/profile')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Novo Nome' });

    // O seu userController.js retorna 404 nesta situação
    expect(response.status).toBe(404);
    expect(response.body.message).toBe('Usuário não encontrado.');
  });
});