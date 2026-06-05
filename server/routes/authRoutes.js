const express = require("express");
const router = express.Router();

// Importação dos controllers atualizados e corretos
const {
  login,
  sendVerificationEmail,
  verifyEmailCode,
  registerInstitution, // Nome correto importado
} = require("../controllers/authController");

// --- Rotas de Autenticação e Verificação ---
router.post("/login", login);
router.post("/send-code", sendVerificationEmail);
router.post("/verify-code", verifyEmailCode);

// --- Rota de Cadastro Público de Instituição ---
// Rota pública acionada pela página /cadastro-instituicao
router.post('/register-institution', registerInstitution);

module.exports = router;