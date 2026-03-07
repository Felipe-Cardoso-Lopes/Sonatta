// server/routes/userRoutes.js

const express = require('express');
const router = express.Router();

const { registerUser, loginUser, updateUserProfile } = require('../controllers/userController'); 
const { protect } = require('../middlewares/authMiddleware'); // Importação do middleware

router.post('/register', registerUser);
router.post('/login', loginUser);

// Rota protegida: o parâmetro /:id foi removido e o middleware 'protect' foi inserido
router.put('/profile', protect, updateUserProfile); 

module.exports = router;