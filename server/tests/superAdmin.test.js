const request = require('supertest');
const { app } = require('../server');
const db = require('../config/db');
const jwt = require('jsonwebtoken');
const { suppressExpectedConsoleError } = require('./helpers/console');

jest.mock('../config/db', () => ({
  query: jest.fn(),
}));

// ─── Token Factory ────────────────────────────────────────────────────────────
const sign = (payload) => jwt.sign(payload, process.env.JWT_SECRET);

const tokens = {
  superAdmin:  sign({ id: 1,  role: 'super_admin' }),
  instituicao: sign({ id: 2,  role: 'instituicao' }),
  professor:   sign({ id: 3,  role: 'professor' }),
  aluno:       sign({ id: 4,  role: 'aluno' }),
  invalid:     'Bearer token.totalmente.invalido',
};

// ─── Test Suite ───────────────────────────────────────────────────────────────
describe('Super Admin Controller — Security & Integration Tests', () => {
  beforeEach(() => jest.clearAllMocks());

  // ══════════════════════════════════════════════════════════════════════════
  // BLOCO 1: RBAC & Autenticação
  // ══════════════════════════════════════════════════════════════════════════
  describe('RBAC & Auth Verification', () => {
    suppressExpectedConsoleError();

    it('deve retornar 401 se nenhum token for fornecido', async () => {
      const res = await request(app).get('/api/super-admin/stats');
      expect(res.status).toBe(401);
      expect(res.body.message).toBe('Não autorizado, nenhum token fornecido.');
    });

    it('deve retornar 401 se o token for inválido', async () => {
      const res = await request(app)
        .get('/api/super-admin/stats')
        .set('Authorization', tokens.invalid);
      expect(res.status).toBe(401);
      expect(res.body.message).toBe('Não autorizado, token inválido ou expirado.');
    });

    it('aluno não deve acessar GET /api/super-admin/stats → 403', async () => {
      const res = await request(app)
        .get('/api/super-admin/stats')
        .set('Authorization', `Bearer ${tokens.aluno}`);
      expect(res.status).toBe(403);
      expect(res.body.message).toBeDefined();
    });

    it('professor não deve acessar GET /api/super-admin/institutions → 403', async () => {
      const res = await request(app)
        .get('/api/super-admin/institutions')
        .set('Authorization', `Bearer ${tokens.professor}`);
      expect(res.status).toBe(403);
      expect(res.body.message).toBeDefined();
    });

    it('professor não deve acessar POST /api/super-admin/solo-teachers → 403', async () => {
      const res = await request(app)
        .post('/api/super-admin/solo-teachers')
        .set('Authorization', `Bearer ${tokens.professor}`)
        .send({ name: 'Hack', email: 'h@h.com', password: '123' });
      expect(res.status).toBe(403);
      expect(res.body.message).toBeDefined();
    });

    it('aluno não deve criar instituição via POST /api/super-admin/institutions → 403', async () => {
      const res = await request(app)
        .post('/api/super-admin/institutions')
        .set('Authorization', `Bearer ${tokens.aluno}`)
        .send({ nome: 'Escola Hack', email: 'hack@escola.com' });
      expect(res.status).toBe(403);
      expect(res.body.message).toBeDefined();
    });

    it('instituicao não deve aprovar outra instituição → 403', async () => {
      const res = await request(app)
        .put('/api/super-admin/institutions/99/approve')
        .set('Authorization', `Bearer ${tokens.instituicao}`);
      expect(res.status).toBe(403);
      expect(res.body.message).toBeDefined();
    });
  });

  // ══════════════════════════════════════════════════════════════════════════
  // BLOCO 2: Estatísticas (Happy Path do Super Admin)
  // ══════════════════════════════════════════════════════════════════════════
  describe('GET /api/super-admin/stats', () => {
    suppressExpectedConsoleError();

    it('super_admin deve receber estatísticas globais com sucesso', async () => {
      db.query
        .mockResolvedValueOnce({ rows: [{ count: '12' }] }) // schools
        .mockResolvedValueOnce({ rows: [{ count: '340' }] }); // users

      const res = await request(app)
        .get('/api/super-admin/stats')
        .set('Authorization', `Bearer ${tokens.superAdmin}`);

      expect(res.status).toBe(200);
      expect(res.body).toEqual({ totalSchools: 12, totalUsers: 340 });
    });

    it('deve retornar 500 em falha de banco', async () => {
      db.query.mockRejectedValueOnce(new Error('DB Error'));

      const res = await request(app)
        .get('/api/super-admin/stats')
        .set('Authorization', `Bearer ${tokens.superAdmin}`);

      expect(res.status).toBe(500);
      expect(res.body.message).toBe('Erro interno no servidor');
    });
  });

  // ══════════════════════════════════════════════════════════════════════════
  // BLOCO 3: Gestão de Instituições
  // ══════════════════════════════════════════════════════════════════════════
  describe('Institution Management', () => {
    suppressExpectedConsoleError();

    describe('GET /api/super-admin/institutions', () => {
      it('super_admin deve listar todas as instituições', async () => {
        db.query.mockResolvedValueOnce({ rows: [{ id: 1, nome: 'Escola A', status: 'ativo' }] });

        const res = await request(app)
          .get('/api/super-admin/institutions')
          .set('Authorization', `Bearer ${tokens.superAdmin}`);

        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body[0].nome).toBe('Escola A');
      });

      it('deve retornar 500 em falha de banco', async () => {
        db.query.mockRejectedValueOnce(new Error('DB Error'));

        const res = await request(app)
          .get('/api/super-admin/institutions')
          .set('Authorization', `Bearer ${tokens.superAdmin}`);

        expect(res.status).toBe(500);
      });
    });

    describe('POST /api/super-admin/institutions', () => {
      it('deve criar instituição com sucesso → 201', async () => {
        db.query
          .mockResolvedValueOnce({ rows: [] }) // duplicate check
          .mockResolvedValueOnce({ rows: [{ id: 10, nome: 'Nova Escola', email: 'nova@escola.com', status: 'ativo' }] });

        const res = await request(app)
          .post('/api/super-admin/institutions')
          .set('Authorization', `Bearer ${tokens.superAdmin}`)
          .send({ nome: 'Nova Escola', email: 'nova@escola.com' });

        expect(res.status).toBe(201);
        expect(res.body.message).toBe('Instituição cadastrada com sucesso!');
        expect(res.body.institution.nome).toBe('Nova Escola');
      });

      it('deve retornar 400 se nome ou email faltarem', async () => {
        const res = await request(app)
          .post('/api/super-admin/institutions')
          .set('Authorization', `Bearer ${tokens.superAdmin}`)
          .send({ nome: 'Escola Sem Email' });

        expect(res.status).toBe(400);
        expect(res.body.message).toBe('Nome e e-mail são obrigatórios.');
      });

      it('deve retornar 400 se e-mail já estiver em uso', async () => {
        db.query.mockResolvedValueOnce({ rows: [{ id: 5 }] }); // already exists

        const res = await request(app)
          .post('/api/super-admin/institutions')
          .set('Authorization', `Bearer ${tokens.superAdmin}`)
          .send({ nome: 'Escola Duplicada', email: 'existe@escola.com' });

        expect(res.status).toBe(400);
        expect(res.body.message).toBe('Já existe uma instituição cadastrada com este e-mail.');
      });

      it('deve retornar 500 em falha de banco', async () => {
        db.query.mockRejectedValueOnce(new Error('DB Error'));

        const res = await request(app)
          .post('/api/super-admin/institutions')
          .set('Authorization', `Bearer ${tokens.superAdmin}`)
          .send({ nome: 'Escola DB Fail', email: 'fail@escola.com' });

        expect(res.status).toBe(500);
      });
    });

    describe('PUT /api/super-admin/institutions/:id/approve', () => {
      it('deve retornar 404 se a instituição não existir', async () => {
        db.query.mockResolvedValueOnce({ rows: [] }); // not found

        const res = await request(app)
          .put('/api/super-admin/institutions/999/approve')
          .set('Authorization', `Bearer ${tokens.superAdmin}`);

        expect(res.status).toBe(404);
        expect(res.body.message).toBe('Instituição não encontrada.');
      });

      it('deve retornar 400 se a instituição já estiver ativa', async () => {
        db.query.mockResolvedValueOnce({ rows: [{ id: 1, status: 'ativo', email: 'escola@a.com', nome: 'Escola A' }] });

        const res = await request(app)
          .put('/api/super-admin/institutions/1/approve')
          .set('Authorization', `Bearer ${tokens.superAdmin}`);

        expect(res.status).toBe(400);
        expect(res.body.message).toBe('Esta instituição já está ativa.');
      });

      it('deve aprovar instituição pendente com sucesso → 200', async () => {
        db.query
          .mockResolvedValueOnce({ rows: [{ id: 2, status: 'pendente', email: 'nova@escola.com', nome: 'Nova Escola' }] }) // fetch
          .mockResolvedValueOnce({}) // status update
          .mockResolvedValueOnce({ rows: [] }) // check existing user
          .mockResolvedValueOnce({}); // insert user

        const res = await request(app)
          .put('/api/super-admin/institutions/2/approve')
          .set('Authorization', `Bearer ${tokens.superAdmin}`);

        expect(res.status).toBe(200);
        expect(res.body.message).toBe('Instituição aprovada e acesso gerado com sucesso.');
      });

      it('deve retornar 500 em falha de banco', async () => {
        db.query.mockRejectedValueOnce(new Error('DB Error'));

        const res = await request(app)
          .put('/api/super-admin/institutions/1/approve')
          .set('Authorization', `Bearer ${tokens.superAdmin}`);

        expect(res.status).toBe(500);
      });
    });

    describe('DELETE /api/super-admin/institutions/:id/reject', () => {
      it('deve rejeitar e remover solicitação com sucesso → 200', async () => {
        db.query.mockResolvedValueOnce({ rows: [{ id: 3 }] }); // deleted row

        const res = await request(app)
          .delete('/api/super-admin/institutions/3/reject')
          .set('Authorization', `Bearer ${tokens.superAdmin}`);

        expect(res.status).toBe(200);
        expect(res.body.message).toBe('Solicitação recusada e removida permanentemente.');
      });

      it('deve retornar 404 se a solicitação não existir', async () => {
        db.query.mockResolvedValueOnce({ rows: [] }); // nothing deleted

        const res = await request(app)
          .delete('/api/super-admin/institutions/999/reject')
          .set('Authorization', `Bearer ${tokens.superAdmin}`);

        expect(res.status).toBe(404);
        expect(res.body.message).toBe('Solicitação não encontrada ou já excluída.');
      });
    });
  });

  // ══════════════════════════════════════════════════════════════════════════
  // BLOCO 4: Gestão de Assinaturas
  // ══════════════════════════════════════════════════════════════════════════
  describe('Subscription Management', () => {
    suppressExpectedConsoleError();

    it('POST /api/super-admin/subscriptions — deve retornar 400 se campos faltarem', async () => {
      const res = await request(app)
        .post('/api/super-admin/subscriptions')
        .set('Authorization', `Bearer ${tokens.superAdmin}`)
        .send({ plan_name: 'Premium' }); // missing instituicao_id and end_date

      expect(res.status).toBe(400);
      expect(res.body.message).toBe('Preencha os campos obrigatórios (instituição, plano e data de término).');
    });

    it('PUT /api/super-admin/subscriptions/:id — deve retornar 404 se não encontrar', async () => {
      db.query.mockResolvedValueOnce({ rows: [] }); // not found

      const res = await request(app)
        .put('/api/super-admin/subscriptions/999')
        .set('Authorization', `Bearer ${tokens.superAdmin}`)
        .send({ status: 'active' });

      expect(res.status).toBe(404);
      expect(res.body.message).toBe('Assinatura não encontrada.');
    });

    it('DELETE /api/super-admin/subscriptions/:id — deve retornar 404 se não encontrar', async () => {
      db.query.mockResolvedValueOnce({ rows: [] });

      const res = await request(app)
        .delete('/api/super-admin/subscriptions/999')
        .set('Authorization', `Bearer ${tokens.superAdmin}`);

      expect(res.status).toBe(404);
      expect(res.body.message).toBe('Assinatura não encontrada.');
    });
  });

  // ══════════════════════════════════════════════════════════════════════════
  // BLOCO 5: Professores Solo
  // ══════════════════════════════════════════════════════════════════════════
  describe('Solo Teacher Management', () => {
    suppressExpectedConsoleError();

    it('POST /api/super-admin/solo-teachers — deve retornar 400 se campos faltarem', async () => {
      const res = await request(app)
        .post('/api/super-admin/solo-teachers')
        .set('Authorization', `Bearer ${tokens.superAdmin}`)
        .send({ name: 'Professor Sem Email' });

      expect(res.status).toBe(400);
      expect(res.body.message).toBe('Nome, e-mail e senha são obrigatórios.');
    });

   it('POST /api/super-admin/solo-teachers — deve retornar 400 em e-mail duplicado', async () => {
      db.query.mockResolvedValueOnce({}); // 1. BEGIN
      db.query.mockResolvedValueOnce({ rows: [{ id: 10 }] }); // 2. SELECT email existente
      db.query.mockResolvedValueOnce({}); // 3. ROLLBACK

      const res = await request(app)
        .post('/api/super-admin/solo-teachers')
        .set('Authorization', `Bearer ${tokens.superAdmin}`) // <-- AQUI ERA O ERRO
        .send({ name: 'Dup Prof', email: 'dup@prof.com', password: 'senha123' });

      expect(res.status).toBe(400);
      expect(res.body.message).toBe('Já existe uma conta com este e-mail.');
    });

    it('POST /api/super-admin/solo-teachers — deve criar professor solo com sucesso → 201', async () => {
      db.query.mockResolvedValueOnce({}); // 1. BEGIN
      db.query.mockResolvedValueOnce({ rows: [] }); // 2. SELECT email livre
      db.query.mockResolvedValueOnce({
        rows: [{
          id: 5,
          name: 'Prof Solo',
          email: 'solo@prof.com',
          role: 'solo_teacher',
          teacher_type: 'solo'
        }]
      }); // 3. INSERT
      db.query.mockResolvedValueOnce({}); // 4. COMMIT

      const res = await request(app)
        .post('/api/super-admin/solo-teachers')
        .set('Authorization', `Bearer ${tokens.superAdmin}`) // <-- AQUI ERA O ERRO
        .send({ name: 'Prof Solo', email: 'solo@prof.com', password: 'senha123' });

      expect(res.status).toBe(201);
      expect(res.body.message).toBe('Professor Solo cadastrado com sucesso!');
      expect(res.body.teacher.role).toBe('solo_teacher');
    });
  });
});
