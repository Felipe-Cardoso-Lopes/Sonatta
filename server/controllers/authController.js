const db = require('../config/db');
const nodemailer = require('nodemailer');

// Configuração do serviço de e-mail (Usando variáveis de ambiente)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER, 
    pass: process.env.EMAIL_PASS, 
  },
});

const sendVerificationEmail = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: 'E-mail é obrigatório.' });
  }

  // Gera um código numérico de 6 dígitos
  const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
  // Define a expiração para 15 minutos a partir de agora
  const expirationTime = new Date(Date.now() + 15 * 60000);

  try {
    const userExists = await db.query('SELECT id, is_verified FROM users WHERE email = $1', [email]);
    
    if (userExists.rows.length === 0) {
      return res.status(404).json({ message: 'Usuário não encontrado.' });
    }

    if (userExists.rows[0].is_verified) {
      return res.status(400).json({ message: 'Este e-mail já está verificado.' });
    }

    // Salva o código e a validade no banco
    await db.query(
      'UPDATE users SET verification_code = $1, verification_expires = $2 WHERE email = $3',
      [verificationCode, expirationTime, email]
    );

    // Corpo do e-mail
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
          <p style="color: #737373; font-size: 12px; margin-top: 20px;">Se você não solicitou este código, ignore este e-mail.</p>
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

    // Validação de correspondência e expiração
    if (user.verification_code !== code) {
      return res.status(400).json({ message: 'Código inválido.' });
    }

    if (new Date() > new Date(user.verification_expires)) {
      return res.status(400).json({ message: 'Código expirado. Solicite um novo.' });
    }

    // Sucesso: Valida o usuário e limpa o código do banco
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

module.exports = { sendVerificationEmail, verifyEmailCode };