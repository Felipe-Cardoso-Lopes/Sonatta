const db = require('../config/db');
const nodemailer = require('nodemailer');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// --- Configuração do serviço de e-mail (Nodemailer) ---
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// ==========================================
// 1. LOGIN DE USUÁRIOS
// ==========================================
const login = async (req, res) => {
  const { email, password } = req.body;

  // Validação antecipada de campos obrigatórios
  if (!email || !password) {
    return res.status(400).json({ message: 'E-mail e senha são obrigatórios.' });
  }

  // Guarda de segurança: JWT_SECRET deve estar configurado no ambiente
  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret) {
    console.error('[login] JWT_SECRET não configurado no ambiente.');
    return res.status(500).json({ message: 'Erro de configuração do servidor.' });
  }

  try {
    // Busca dados essenciais do usuário no banco, incluindo nickname e tipo de professor
    const query = 'SELECT id, name, nickname, email, password_hash, role, is_verified, teacher_type FROM users WHERE email = $1';
    const result = await db.query(query, [email]);

    // Retorna erro 401 genérico por segurança (não revela se o e-mail existe)
    if (result.rows.length === 0) {
      return res.status(401).json({ message: 'E-mail ou senha inválidos' });
    }

    const user = result.rows[0];

    // Validação criptográfica da senha usando bcrypt
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ message: 'E-mail ou senha inválidos' });
    }

    // Bloqueia o login se o e-mail não tiver sido verificado via código
    if (!user.is_verified) {
      return res.status(403).json({ message: 'Por favor, confirme seu e-mail antes de acessar.' });
    }

    // Geração do token de sessão JWT (válido por 1 dia)
    const token = jwt.sign(
      { id: user.id, role: user.role },
      jwtSecret,
      { expiresIn: '1d' }
    );

    // Payload retornado para o front-end armazenar no localStorage
    res.status(200).json({
      token,
      id: user.id,
      role: user.role,
      name: user.name,
      nickname: user.nickname,
      teacherType: user.teacher_type || 'institucional'
    });

  } catch (error) {
    console.error('Erro no login:', error);
    res.status(500).json({ message: 'Erro no servidor' });
  }
};

// ==========================================
// 2. VERIFICAÇÃO DE E-MAIL (ENVIO DE CÓDIGO)
// ==========================================
const sendVerificationEmail = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: 'E-mail é obrigatório.' });
  }

  // Gera um código numérico aleatório de 6 dígitos
  const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
  // Define a expiração do código para 15 minutos a partir de agora
  const expirationTime = new Date(Date.now() + 15 * 60000);

  try {
    const userExists = await db.query('SELECT id, is_verified FROM users WHERE email = $1', [email]);

    if (userExists.rows.length === 0) {
      return res.status(404).json({ message: 'Usuário não encontrado.' });
    }

    if (userExists.rows[0].is_verified) {
      return res.status(400).json({ message: 'Este e-mail já está verificado.' });
    }

    // Atualiza o banco com o novo código e a data de expiração
    await db.query(
      'UPDATE users SET verification_code = $1, verification_expires = $2 WHERE email = $3',
      [verificationCode, expirationTime, email]
    );

    // Template HTML do e-mail de verificação
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Sonatta - Seu código de verificação',
      html: `
        <div style="font-family: sans-serif; text-align: center; padding: 20px; background-color: #121212; color: #ffffff;">
          <h2>Bem-vindo à Sonatta!</h2>
          <p style="color: #a3a3a3;">Aqui está o seu código de verificação. Ele expira em 15 minutos.</p>
          <h1 style="background: #1a1a1a; border: 1px solid #333; padding: 15px; letter-spacing: 8px; color: #a855f7; border-radius: 8px;">
            ${verificationCode}
          </h1>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Código enviado com sucesso.' });

  } catch (error) {
    console.error('Erro ao enviar e-mail:', error);
    res.status(500).json({ message: 'Erro no servidor ao enviar o e-mail.' });
  }
};

// ==========================================
// 3. VALIDAÇÃO DO CÓDIGO DE E-MAIL
// ==========================================
const verifyEmailCode = async (req, res) => {
  const { email, code } = req.body;

  if (!email || !code) {
    return res.status(400).json({ message: 'E-mail e código são obrigatórios.' });
  }

  try {
    const result = await db.query(
      'SELECT id, verification_code, verification_expires FROM users WHERE email = $1',
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Usuário não encontrado.' });
    }

    const user = result.rows[0];

    // Valida se o código está correto e se não está expirado
    if (user.verification_code !== code) {
      return res.status(400).json({ message: 'Código inválido.' });
    }

    if (new Date() > new Date(user.verification_expires)) {
      return res.status(400).json({ message: 'Código expirado. Solicite um novo.' });
    }

    // Código válido: marca o usuário como verificado e limpa os campos de código
    await db.query(
      'UPDATE users SET is_verified = true, verification_code = NULL, verification_expires = NULL WHERE email = $1',
      [email]
    );

    res.status(200).json({ message: 'E-mail verificado com sucesso!' });
  } catch (error) {
    console.error('Erro ao verificar código:', error);
    res.status(500).json({ message: 'Erro interno no servidor.' });
  }
};

// ==========================================
// 4. CADASTRO PÚBLICO DE INSTITUIÇÃO
// ==========================================
// Recebe os dados da Landing Page Pública e cria a escola em estado de quarentena ('pendente')
const registerInstitution = async (req, res) => {
  const { nome, email, telefone, cidade } = req.body;

  // 1. Validação de segurança básica no back-end
  if (!nome || !email) {
    return res.status(400).json({ message: 'Nome e e-mail são obrigatórios.' });
  }

  try {
    // 2. Verifica se já existe uma instituição utilizando o mesmo e-mail para evitar duplicidade
    const instExists = await db.query('SELECT id FROM instituicoes WHERE email = $1', [email]);
    if (instExists.rows.length > 0) {
      return res.status(400).json({ message: 'Este e-mail já está em uso por outra instituição.' });
    }

    // 3. Inserção segura no banco de dados
    // CRÍTICO: O status é fixado diretamente no código como 'pendente'. 
    // Assim, nenhum payload malicioso do front-end conseguirá forçar a escola a nascer como 'ativa'.
    const result = await db.query(
      `INSERT INTO instituicoes (nome, email, telefone, cidade, status) 
       VALUES ($1, $2, $3, $4, 'pendente') 
       RETURNING id, nome, email, status`,
      [nome, email, telefone || null, cidade || null]
    );

    // 4. Retorno de sucesso para renderizar a mensagem verde no front-end
    res.status(201).json({
      message: 'Cadastro recebido com sucesso! Aguarde aprovação.',
      institution: result.rows[0]
    });
  } catch (error) {
    console.error('Erro ao registrar instituição:', error);
    res.status(500).json({ message: 'Erro interno no servidor ao processar o cadastro.' });
  }
};

// --- Exportação padronizada dos métodos ---
module.exports = {
  login,
  sendVerificationEmail,
  verifyEmailCode,
  registerInstitution // Exportação corrigida para o novo fluxo
};