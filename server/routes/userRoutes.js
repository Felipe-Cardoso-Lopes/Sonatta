// server/routes/userRoutes.js

const express = require('express');
const router = express.Router();

// Importa as funções do controller (após renomear o arquivo para userController.js)
const { registerUser, loginUser, updateUserProfile } = require('../controllers/userController'); // Importe updateUserProfile

// Define a rota para registrar um usuário
// Quando uma requisição POST chegar em /register, a função registerUser será chamada
router.post('/register', registerUser);

// Define a rota para fazer login
// Quando uma requisição POST chegar em /login, a função loginUser será chamada
router.post('/login', loginUser);

// Nova rota para atualizar o perfil do usuário (incluindo a role)
// O :id é um parâmetro de URL que representa o ID do usuário
router.put('/:id/profile', updateUserProfile); // Adicione esta linha

module.exports = router;