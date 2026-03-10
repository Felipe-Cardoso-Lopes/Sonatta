const express = require('express');
const router = express.Router();

const { registerUser, loginUser, updateUserProfile, completeRegistration} = require('../controllers/userController'); 
const { protect } = require('../middlewares/authMiddleware'); // Certifique-se de que o middleware está importado

router.post('/register', registerUser);
router.post('/login', loginUser);

// Rota atualizada: o '/:id' foi removido.
// A rota agora é apenas PUT /profile e exige o token (protect)
router.put('/profile', protect, updateUserProfile); 
router.put('/complete/:id', completeRegistration);

module.exports = router;