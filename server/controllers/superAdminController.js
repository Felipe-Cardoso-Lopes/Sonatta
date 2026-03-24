const db = require('../config/db');

const getGlobalStats = async (req, res) => {
  try {
    // Conta quantas escolas parceiras (instituições) existem
    const schoolsResult = await db.query("SELECT COUNT(*) FROM users WHERE role = 'instituicao'");
    
    // Conta o total absoluto de usuários (alunos, professores, instituições e você)
    const totalUsersResult = await db.query("SELECT COUNT(*) FROM users");

    res.status(200).json({
      totalSchools: parseInt(schoolsResult.rows[0].count, 10),
      totalUsers: parseInt(totalUsersResult.rows[0].count, 10),
      serverStatus: 'Online' // Dado estático representativo por enquanto
    });
  } catch (error) {
    console.error('Erro ao buscar estatísticas globais:', error);
    res.status(500).json({ message: 'Erro interno ao carregar métricas.' });
  }
};

module.exports = { getGlobalStats };