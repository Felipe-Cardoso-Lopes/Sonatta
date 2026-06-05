const express = require('express');
const router = express.Router();

// Importação do middleware de segurança (JWT)
const { verifyToken } = require('../middlewares/authMiddleware');

// Importação centralizada de todas as funções do controller da instituição
const { 
  approveUser,
  getTeachers, 
  createTeacher 
} = require('../controllers/instituicaoController');

// Aplica o middleware globalmente para TODAS as rotas abaixo desta linha.
// Isso garante que apenas usuários logados acessem as funcionalidades.
router.use(verifyToken);

// --- Rotas de Gestão de Alunos/Usuários ---
router.put('/approve-user', approveUser);

// --- Rotas de Gestão de Professores (Task 14.1) ---
router.get('/teachers', getTeachers);
router.post('/teachers', createTeacher);

module.exports = router;