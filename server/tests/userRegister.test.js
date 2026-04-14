// 1. Injeta o segredo para o JWT (deve ser a primeira coisa)
process.env.JWT_SECRET = 'segredo-de-teste';

// 2. Importações (apenas uma vez cada)
const request = require('supertest');
const app = require('../server');
const db = require('../config/db');

// 3. Mock do banco de dados
jest.mock('../config/db', () => ({
  query: jest.fn(),
}));

describe('Testes da Rota de Cadastro (/api/users/register)', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('deve cadastrar um novo aluno com sucesso e retornar o status 201', async () => {
    db.query.mockResolvedValueOnce({ rows: [] }); // Email livre
    db.query.mockResolvedValueOnce({
      rows: [{ id: 1, name: 'Novo Aluno', email: 'aluno@teste.com', role: 'aluno' }]
    });

    const response = await request(app)
      .post('/api/users/register')
      .send({
        name: 'Novo Aluno',
        email: 'aluno@teste.com',
        password: 'senha-segura'
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('token');
    expect(response.body.name).toBe('Novo Aluno');
    expect(db.query).toHaveBeenCalledTimes(2);
  });

  it('deve retornar erro 400 se faltarem campos obrigatórios', async () => {
    const response = await request(app)
      .post('/api/users/register')
      .send({ email: 'aluno@teste.com' });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Por favor, preencha todos os campos obrigatórios.');
  });

  it('deve retornar erro 400 se o e-mail já estiver cadastrado', async () => {
    db.query.mockResolvedValueOnce({ rows: [{ id: 1, email: 'aluno@teste.com' }] });

    const response = await request(app)
      .post('/api/users/register')
      .send({
        name: 'Aluno Duplicado',
        email: 'aluno@teste.com',
        password: 'senha-segura'
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Usuário já cadastrado com este e-mail.');
  });
});