// 1. Injeta o segredo para o JWT
process.env.JWT_SECRET = 'segredo-de-teste';

const request = require('supertest');
const app = require('../server');
const db = require('../config/db');
const bcrypt = require('bcryptjs');

// Mock do banco de dados
jest.mock('../config/db', () => ({
  query: jest.fn(),
}));

describe('Testes da Rota de Login (/api/users/login)', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('deve autenticar um utilizador com credenciais válidas', async () => {
    // Simulamos uma senha encriptada para o mock (corresponde a 'senha123')
    const hashedPassword = await bcrypt.hash('senha123', 10);
    
    // Simula o banco encontrando o utilizador
    db.query.mockResolvedValueOnce({
      rows: [{ 
        id: 1, 
        name: 'João Silva', 
        email: 'joao@teste.com', 
        password_hash: hashedPassword, 
        role: 'aluno' 
      }]
    });

    const response = await request(app)
      .post('/api/users/login')
      .send({
        email: 'joao@teste.com',
        password: 'senha123'
      });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('token');
    expect(response.body.email).toBe('joao@teste.com');
    expect(db.query).toHaveBeenCalledTimes(1);
  });

  it('deve rejeitar o login com uma senha incorreta', async () => {
    const hashedPassword = await bcrypt.hash('senha-correta', 10);
    
    db.query.mockResolvedValueOnce({
      rows: [{ 
        id: 1, 
        email: 'joao@teste.com', 
        password_hash: hashedPassword 
      }]
    });

    const response = await request(app)
      .post('/api/users/login')
      .send({
        email: 'joao@teste.com',
        password: 'senha-errada'
      });

    // O status deve ser 401 (Não autorizado) conforme o seu controller
    expect(response.status).toBe(401);
    expect(response.body.message).toBe('Credenciais inválidas');
  });

  it('deve retornar erro 401 se o utilizador não existir', async () => {
    // Simula o banco retornando vazio
    db.query.mockResolvedValueOnce({ rows: [] });

    const response = await request(app)
      .post('/api/users/login')
      .send({
        email: 'fantasma@teste.com',
        password: 'qualquer-senha'
      });

    expect(response.status).toBe(401);
    expect(response.body.message).toBe('Credenciais inválidas');
  });
});