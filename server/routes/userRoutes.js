// server/routes/userRoutes.js

const express = require('express');
const router = express.Router();

// Importa as funções do controller (após renomear o arquivo para userController.js)
const { registerUser, loginUser } = require('../controllers/userController');

// Define a rota para registrar um usuário
// Quando uma requisição POST chegar em /register, a função registerUser será chamada
router.post('/register', registerUser);

// Define a rota para fazer login
// Quando uma requisição POST chegar em /login, a função loginUser será chamada
router.post('/login', loginUser);

module.exports = router;