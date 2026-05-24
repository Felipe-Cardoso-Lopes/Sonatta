const db = require('../config/db');

// ==========================================
// CRUD DE ASSINATURAS (SUPER ADMIN)
// ==========================================

// 1. READ: Listar todas as assinaturas ativas
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

// 2. CREATE: Criar uma nova assinatura
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

// 3. UPDATE: Atualizar uma assinatura existente
const updateSubscription = async (req, res) => {
  const { id } = req.params;
  const { plan_name, status, end_date } = req.body;

  try {
    const result = await db.query(
      `UPDATE subscriptions 
       SET plan_name = COALESCE($1, plan_name), 
           status = COALESCE($2, status), 
           end_date = COALESCE($3, end_date),
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $4 RETURNING *`,
      [
        // BLINDAGEM: Se o campo não vier na requisição, passamos null para o PG não quebrar.
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

// 4. DELETE: Deletar assinatura
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

// 5. READ: Listar instituições (Para o painel do Super Admin)
const getAllInstitutions = async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM instituicoes ORDER BY nome ASC');
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Erro ao buscar instituições:', error);
    res.status(500).json({ message: 'Erro interno no servidor' });
  }
};

// Listar todos os tipos de planos SaaS
const getSaaSPlans = async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM saas_plans ORDER BY price ASC');
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Erro ao buscar planos SaaS:', error);
    res.status(500).json({ message: 'Erro interno no servidor' });
  }
};

// Atualizar valores ou limites de um plano
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

const getGlobalStats = async (req, res) => {
  try {
    const [schoolsResult, usersResult] = await Promise.all([
      db.query(`SELECT COUNT(*) FROM instituicoes`),
      db.query(`SELECT COUNT(*) FROM users`)
    ]);

    res.status(200).json({
      totalSchools: parseInt(schoolsResult.rows[0].count),
      totalUsers: parseInt(usersResult.rows[0].count),
    });
  } catch (error) {
    console.error('Erro ao buscar estatísticas globais:', error);
    res.status(500).json({ message: 'Erro interno no servidor' });
  }
};

const createInstitution = async (req, res) => {
  const { nome, email, telefone, cidade, codigo_aluno, codigo_professor } = req.body;

  if (!nome || !email) {
    return res.status(400).json({ message: 'Nome e e-mail são obrigatórios.' });
  }

  try {
    // Verifica se já existe instituição com o mesmo e-mail
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

module.exports = {
  getGlobalStats,
  getAllSubscriptions,
  createSubscription,
  updateSubscription,
  deleteSubscription,
  getAllInstitutions,
  createInstitution,
  getSaaSPlans,
  updateSaaSPlan,
};