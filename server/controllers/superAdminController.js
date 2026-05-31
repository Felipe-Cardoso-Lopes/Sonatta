const bcrypt = require('bcryptjs');
const db = require('../config/db');

// ==========================================
// 1. ESTATÍSTICAS E VISÃO GERAL
// ==========================================

// Retorna contagens globais para o Dashboard do Super Admin
const getGlobalStats = async (req, res) => {
  try {
    const [schoolsResult, usersResult] = await Promise.all([
      db.query(`SELECT COUNT(*) FROM instituicoes`),
      db.query(`SELECT COUNT(*) FROM users`)
    ]);

    res.status(200).json({
      totalSchools: parseInt(schoolsResult.rows[0].count, 10),
      totalUsers: parseInt(usersResult.rows[0].count, 10),
    });
  } catch (error) {
    console.error('Erro ao buscar estatísticas globais:', error);
    res.status(500).json({ message: 'Erro interno no servidor' });
  }
};

// ==========================================
// 2. GESTÃO DE INSTITUIÇÕES (Feature 13)
// ==========================================

// READ: Listar todas as instituições (Ativas e Pendentes)
const getAllInstitutions = async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM instituicoes ORDER BY nome ASC');
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Erro ao buscar instituições:', error);
    res.status(500).json({ message: 'Erro interno no servidor' });
  }
};

// CREATE (Manual): Cadastro direto pelo Super Admin
const createInstitution = async (req, res) => {
  const { nome, email, telefone, cidade, codigo_aluno, codigo_professor } = req.body;

  if (!nome || !email) {
    return res.status(400).json({ message: 'Nome e e-mail são obrigatórios.' });
  }

  try {
    const exists = await db.query('SELECT id FROM instituicoes WHERE email = $1', [email]);
    if (exists.rows.length > 0) {
      return res.status(400).json({ message: 'Já existe uma instituição cadastrada com este e-mail.' });
    }

    const result = await db.query(
      `INSERT INTO instituicoes (nome, email, telefone, cidade, codigo_aluno, codigo_professor, status)
       VALUES ($1, $2, $3, $4, $5, $6, 'ativo')
       RETURNING *`,
      [nome, email, telefone || null, cidade || null, codigo_aluno || null, codigo_professor || null]
    );

    res.status(201).json({
      message: 'Instituição cadastrada com sucesso!',
      institution: result.rows[0]
    });
  } catch (error) {
    console.error('Erro ao criar instituição:', error);
    res.status(500).json({ message: 'Erro interno no servidor.' });
  }
};

// UPDATE: Aprovar instituição pendente e gerar acesso
const approveInstitution = async (req, res) => {
  const { id } = req.params;

  try {
    // Busca dados da escola em quarentena
    const instRes = await db.query('SELECT * FROM instituicoes WHERE id = $1', [id]);
    
    if (instRes.rows.length === 0) {
      return res.status(404).json({ message: 'Instituição não encontrada.' });
    }

    const escola = instRes.rows[0];

    if (escola.status === 'ativo') {
      return res.status(400).json({ message: 'Esta instituição já está ativa.' });
    }

    // Altera status para ativo
    await db.query('UPDATE instituicoes SET status = $1 WHERE id = $2', ['ativo', id]);

    // Verifica se conta de usuário já existe para o e-mail
    const userRes = await db.query('SELECT id FROM users WHERE email = $1', [escola.email]);
    
    // Cria credenciais de primeiro acesso para a instituição recém-aprovada
    if (userRes.rows.length === 0) {
      const senhaTemporaria = 'Sonatta@2026'; 
      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(senhaTemporaria, salt);

      await db.query(
        `INSERT INTO users (name, email, password_hash, role, instituicao_id, is_verified) 
         VALUES ($1, $2, $3, 'instituicao', $4, true)`,
        [escola.nome, escola.email, passwordHash, id]
      );
    }

    res.status(200).json({ message: 'Instituição aprovada e acesso gerado com sucesso.' });
  } catch (error) {
    console.error('Erro ao aprovar instituição:', error);
    res.status(500).json({ message: 'Erro interno ao processar a aprovação.' });
  }
};

// DELETE: Recusar e excluir solicitação de instituição
const rejectInstitution = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await db.query('DELETE FROM instituicoes WHERE id = $1 RETURNING id', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Solicitação não encontrada ou já excluída.' });
    }

    res.status(200).json({ message: 'Solicitação recusada e removida permanentemente.' });
  } catch (error) {
    console.error('Erro ao recusar instituição:', error);
    res.status(500).json({ message: 'Erro interno ao excluir a solicitação.' });
  }
};

// ==========================================
// 3. GESTÃO DE ASSINATURAS E SAAS
// ==========================================

// READ: Listar assinaturas vinculadas a instituições
const getAllSubscriptions = async (req, res) => {
  try {
    const result = await db.query(`
      SELECT s.*, i.nome as instituicao_nome 
      FROM subscriptions s
      JOIN instituicoes i ON s.instituicao_id = i.id
      ORDER BY s.created_at DESC
    `);
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Erro ao buscar assinaturas:', error);
    res.status(500).json({ message: 'Erro interno no servidor' });
  }
};

// CREATE: Cadastrar nova assinatura
const createSubscription = async (req, res) => {
  const { instituicao_id, plan_name, status, end_date } = req.body;

  if (!instituicao_id || !plan_name || !end_date) {
    return res.status(400).json({ message: 'Preencha os campos obrigatórios (instituição, plano e data de término).' });
  }

  try {
    const result = await db.query(
      `INSERT INTO subscriptions (instituicao_id, plan_name, status, end_date) 
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [instituicao_id, plan_name, status || 'active', end_date]
    );
    res.status(201).json({ message: 'Assinatura criada com sucesso!', subscription: result.rows[0] });
  } catch (error) {
    console.error('Erro ao criar assinatura:', error);
    res.status(500).json({ message: 'Erro interno no servidor' });
  }
};

// UPDATE: Alterar dados de assinatura
const updateSubscription = async (req, res) => {
  const { id } = req.params;
  const { plan_name, status, end_date } = req.body;

  try {
    // Uso de COALESCE para evitar sobrescrita com null caso campo falte no req.body
    const result = await db.query(
      `UPDATE subscriptions 
       SET plan_name = COALESCE($1, plan_name), 
           status = COALESCE($2, status), 
           end_date = COALESCE($3, end_date),
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $4 RETURNING *`,
      [
        plan_name !== undefined ? plan_name : null, 
        status !== undefined ? status : null, 
        end_date !== undefined ? end_date : null, 
        id
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Assinatura não encontrada.' });
    }

    res.status(200).json({ message: 'Assinatura atualizada!', subscription: result.rows[0] });
  } catch (error) {
    console.error('Erro ao atualizar assinatura:', error);
    res.status(500).json({ message: 'Erro interno no servidor' });
  }
};

// DELETE: Remover assinatura
const deleteSubscription = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await db.query('DELETE FROM subscriptions WHERE id = $1 RETURNING id', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Assinatura não encontrada.' });
    }

    res.status(200).json({ message: 'Assinatura removida com sucesso.' });
  } catch (error) {
    console.error('Erro ao deletar assinatura:', error);
    res.status(500).json({ message: 'Erro interno no servidor' });
  }
};

// READ: Listar configurações dos planos SaaS
const getSaaSPlans = async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM saas_plans ORDER BY price ASC');
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Erro ao buscar planos SaaS:', error);
    res.status(500).json({ message: 'Erro interno no servidor' });
  }
};

// UPDATE: Modificar configurações dos planos SaaS
const updateSaaSPlan = async (req, res) => {
  const { id } = req.params;
  const { price, max_students, max_teachers } = req.body;
  try {
    const result = await db.query(
      `UPDATE saas_plans 
       SET price = COALESCE($1, price), 
           max_students = $2, 
           max_teachers = $3, 
           updated_at = CURRENT_TIMESTAMP 
       WHERE id = $4 RETURNING *`,
      [price, max_students, max_teachers, id]
    );
    res.status(200).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao atualizar plano' });
  }
};

module.exports = {
  getGlobalStats,
  getAllInstitutions,
  createInstitution,
  approveInstitution,
  rejectInstitution,
  getAllSubscriptions,
  createSubscription,
  updateSubscription,
  deleteSubscription,
  getSaaSPlans,
  updateSaaSPlan
};