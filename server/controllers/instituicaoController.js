// ==========================================
// IMPORTAÇÕES GLOBAIS
// ==========================================
const db = require('../config/db');
const bcrypt = require('bcryptjs'); // ou 'bcrypt'

// ==========================================
// APROVAÇÃO DE USUÁRIOS
// ==========================================
const approveUser = async (req, res) => {
  // RBAC — whitelist estrita: apenas 'instituicao' pode executar esta ação
  if (req.user.role !== 'instituicao') {
    return res.status(403).json({ message: 'Acesso negado. Apenas instituições podem aprovar usuários.' });
  }

  const { email, newRole } = req.body;

  if (!email || !newRole) {
    return res.status(400).json({ message: 'E-mail e novo cargo são obrigatórios.' });
  }

  if (newRole !== 'aluno' && newRole !== 'professor') {
    return res.status(400).json({ message: 'Cargo inválido. O usuário deve ser aluno ou professor.' });
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

const getTeachers = async (req, res) => {
  if (req.user.role !== 'instituicao') {
    return res.status(403).json({ message: 'Acesso negado: apenas instituições podem listar professores.' });
  }

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

const createTeacher = async (req, res) => {
  if (req.user.role !== 'instituicao') {
    return res.status(403).json({ message: 'Acesso negado: apenas instituições podem cadastrar professores.' });
  }

  const { name, email, password } = req.body;
  const instituicao_id = req.user.id;

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Nome, e-mail e senha são obrigatórios.' });
  }

  try {
    // 1. Inicia a transação atômica
    await db.query('BEGIN');

    const userExists = await db.query('SELECT id FROM users WHERE email = $1', [email]);
    if (userExists.rows.length > 0) {
      await db.query('ROLLBACK');
      return res.status(400).json({ message: 'Este e-mail já está em uso por outro usuário.' });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // 2. Insere na tabela de autenticação base
    const result = await db.query(
      `INSERT INTO users (name, email, password_hash, role, teacher_type, instituicao_id, is_verified) 
       VALUES ($1, $2, $3, 'teacher', 'institucional', $4, true) 
       RETURNING id, name, email, role, teacher_type`,
      [name, email, passwordHash, instituicao_id]
    );

    // 3. Confirma a transação no banco
    await db.query('COMMIT');

    res.status(201).json({
      message: 'Professor cadastrado com sucesso!',
      teacher: result.rows[0]
    });
  } catch (error) {
    // Falhou? Desfaz tudo que foi tentado neste bloco!
    await db.query('ROLLBACK');
    console.error('Erro de transação ao cadastrar professor:', error);
    
    if (error.code === '23505') {
      return res.status(400).json({ message: 'Este e-mail já está em uso.' });
    }
    res.status(500).json({ message: 'Erro interno ao processar o cadastro.' });
  }
};

// ==========================================
// GESTÃO DO PERFIL PÚBLICO
// ==========================================

const updateProfile = async (req, res) => {
  if (req.user.role !== 'instituicao') {
    return res.status(403).json({ message: 'Acesso negado. Apenas instituições podem alterar este perfil.' });
  }

  const instituicao_id = req.user.id; 
  
  const {
    descricao_longa,
    logo_url,
    banner_url,
    website_url,
    instagram_url,
    linkedin_url,
    facebook_url
  } = req.body;

  const urlRegex = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([\/\w .-]*)*\/?$/;
  const urlsParaValidar = { logo_url, banner_url, website_url, instagram_url, linkedin_url, facebook_url };

  for (const [campo, valor] of Object.entries(urlsParaValidar)) {
    if (valor && valor.trim() !== '' && !urlRegex.test(valor)) {
      return res.status(400).json({ message: `O campo ${campo} deve conter uma URL válida.` });
    }
  }

  try {
    const result = await db.query(
      `UPDATE instituicoes 
       SET descricao_longa = COALESCE($1, descricao_longa),
           logo_url = COALESCE($2, logo_url),
           banner_url = COALESCE($3, banner_url),
           website_url = COALESCE($4, website_url),
           instagram_url = COALESCE($5, instagram_url),
           linkedin_url = COALESCE($6, linkedin_url),
           facebook_url = COALESCE($7, facebook_url)
       WHERE id = $8
       RETURNING *`,
      [
        descricao_longa || null,
        logo_url || null,
        banner_url || null,
        website_url || null,
        instagram_url || null,
        linkedin_url || null,
        facebook_url || null,
        instituicao_id
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Dados cadastrais da instituição não encontrados.' });
    }

    res.status(200).json({
      message: 'Perfil público atualizado com sucesso!',
      instituicao: result.rows[0]
    });

  } catch (error) {
    console.error('Erro ao atualizar perfil público da instituição:', error);
    res.status(500).json({ message: 'Erro interno no servidor ao tentar atualizar o perfil.' });
  }
};

// --- F21: CONFIGURAÇÕES DE SEGURANÇA E PREFERÊNCIAS ---

const updateSecurity = async (req, res) => {
  const userId = req.user.id;
  const { currentPassword, newPassword } = req.body;

  try {
    const userQuery = await db.query('SELECT password_hash FROM users WHERE id = $1', [userId]);
    if (userQuery.rows.length === 0) return res.status(404).json({ message: 'Usuário não encontrado.' });

    const validPassword = await bcrypt.compare(currentPassword, userQuery.rows[0].password_hash);
    if (!validPassword) return res.status(401).json({ message: 'Senha atual incorreta.' });

    const salt = await bcrypt.genSalt(10);
    const newHash = await bcrypt.hash(newPassword, salt);

    await db.query('UPDATE users SET password_hash = $1 WHERE id = $2', [newHash, userId]);
    res.json({ message: 'Senha atualizada com sucesso!' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erro ao atualizar segurança.' });
  }
};

const updatePreferences = async (req, res) => {
  const instId = req.user.instituicao_id;
  const { notif_email, notif_sms, notif_marketing } = req.body;

  try {
    const result = await db.query(
      `UPDATE instituicoes 
       SET notif_email = $1, notif_sms = $2, notif_marketing = $3 
       WHERE id = $4 RETURNING notif_email, notif_sms, notif_marketing`,
      [notif_email, notif_sms, notif_marketing, instId]
    );
    res.json({ message: 'Preferências salvas!', preferences: result.rows[0] });
  } catch (err) {
    res.status(500).json({ message: 'Erro ao atualizar preferências.' });
  }
};

module.exports = {
  approveUser,
  getTeachers,
  createTeacher,
  updateProfile,
  updateSecurity,
  updatePreferences
};