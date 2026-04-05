const db = require('../config/db');

const approveUser = async (req, res) => {
  const { email, newRole } = req.body;

  // 1. Validação de dados recebidos
  if (!email || !newRole) {
    return res.status(400).json({ message: 'E-mail e novo cargo são obrigatórios.' });
  }

  // 2. Trava de segurança para impedir cargos inválidos
  if (newRole !== 'aluno' && newRole !== 'professor') {
    return res.status(400).json({ message: 'Cargo inválido. O usuário deve ser aluno ou professor.' });
  }

  try {
    // 3. Verifica se o usuário realmente existe no banco
    const userCheck = await db.query('SELECT id, role FROM users WHERE email = $1', [email]);
    
    if (userCheck.rows.length === 0) {
      return res.status(404).json({ message: 'Nenhum usuário encontrado com este e-mail.' });
    }

    // Opcional: Impedir que a instituição altere um 'super_admin' ou outro cargo restrito
    if (userCheck.rows[0].role === 'super_admin') {
      return res.status(403).json({ message: 'Acesso negado para alterar este perfil.' });
    }

    // 4. Executa a atualização do cargo
    const result = await db.query(
      'UPDATE users SET role = $1 WHERE email = $2 RETURNING id, name, email, role',
      [newRole, email]
    );

    res.status(200).json({ 
      message: 'Usuário aprovado e vinculado com sucesso!', 
      user: result.rows[0] 
    });

  } catch (error) {
    console.error('Erro ao aprovar usuário:', error);
    res.status(500).json({ message: 'Erro no servidor ao tentar atualizar o status do usuário.' });
  }
};

module.exports = { approveUser };