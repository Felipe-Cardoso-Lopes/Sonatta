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
      [plan_name, status, end_date, id]
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

module.exports = {
  getAllSubscriptions,
  createSubscription,
  updateSubscription,
  deleteSubscription
};