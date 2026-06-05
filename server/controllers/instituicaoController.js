const approveUser = async (req, res) => {
  const { email, newRole } = req.body;
  const db = require('../config/db');

  // 1. Validação de campos obrigatórios
  if (!email || !newRole) {
    return res.status(400).json({ message: 'E-mail e novo cargo são obrigatórios.' });
  }

  // 2. Trava de segurança para impedir cargos inválidos
  if (newRole !== 'aluno' && newRole !== 'professor') {
    return res.status(400).json({ message: 'Cargo inválido. O usuário deve ser aluno ou professor.' });
  }

  // 3. ✅ Bloqueia perfil 'aluno' de executar esta ação
  if (req.user.role === 'aluno') {
    return res.status(403).json({ message: 'Acesso negado. Apenas instituições podem aprovar usuários.' });
  }

  try {
    const userCheck = await db.query('SELECT id, role FROM users WHERE email = $1', [email]);

    if (userCheck.rows.length === 0) {
      return res.status(404).json({ message: 'Nenhum usuário encontrado com este e-mail.' });
    }

    if (userCheck.rows[0].role === 'super_admin') {
      return res.status(403).json({ message: 'Acesso negado para alterar este perfil.' });
    }

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

// ==========================================
// GESTÃO DE PROFESSORES DA INSTITUIÇÃO
// ==========================================

// READ: Listar apenas os professores vinculados à instituição logada
const getTeachers = async (req, res) => {
  // O authMiddleware injeta os dados do token em req.user
  const instituicao_id = req.user.id;

  try {
    const result = await db.query(
      `SELECT id, name, email, teacher_type, is_verified, created_at 
       FROM users 
       WHERE role = 'teacher' AND instituicao_id = $1
       ORDER BY created_at DESC`,
      [instituicao_id]
    );
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Erro ao listar professores:', error);
    res.status(500).json({ message: 'Erro interno ao buscar professores.' });
  }
};

// CREATE: Cadastrar um novo professor forçando o vínculo à instituição
const createTeacher = async (req, res) => {
  const { name, email, password } = req.body;

  // Segurança: Extrai o ID da instituição do Token JWT (inviolável)
  const instituicao_id = req.user.id;

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Nome, e-mail e senha são obrigatórios.' });
  }

  try {
    // 1. Evita duplicidade de e-mail no sistema
    const userExists = await db.query('SELECT id FROM users WHERE email = $1', [email]);
    if (userExists.rows.length > 0) {
      return res.status(400).json({ message: 'Este e-mail já está em uso por outro usuário.' });
    }

    // 2. Criptografa a senha antes de salvar
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // 3. Insere no banco cravando a role 'teacher' e o instituicao_id
    // O professor já nasce como is_verified = true (pois foi criado pela própria escola)
    const result = await db.query(
      `INSERT INTO users (name, email, password_hash, role, teacher_type, instituicao_id, is_verified) 
       VALUES ($1, $2, $3, 'teacher', 'institucional', $4, true) 
       RETURNING id, name, email, role, teacher_type`,
      [name, email, passwordHash, instituicao_id]
    );

    res.status(201).json({
      message: 'Professor cadastrado com sucesso!',
      teacher: result.rows[0]
    });
  } catch (error) {
    console.error('Erro ao cadastrar professor:', error);
    res.status(500).json({ message: 'Erro interno ao processar o cadastro.' });
  }
};

module.exports = {
  approveUser,
  getTeachers,
  createTeacher
};