const express = require('express');
const router = express.Router();

// Importação única e exclusiva do controller
const { registerUser, loginUser, updateUserProfile, completeRegistration, saveMusicalPreferences, getUserProfile, getPublicProfile } = require('../controllers/userController');
const { verifyToken } = require('../middlewares/authMiddleware');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.put('/profile', verifyToken, updateUserProfile);
// verifyToken + ownership guard: apenas o próprio utilizador pode completar o seu registo
router.put('/complete/:id', verifyToken, completeRegistration);
router.get('/profile', verifyToken, getUserProfile);
// verifyToken: userId é ignorado do body — utiliza req.user.id no controller
router.post('/preferences', verifyToken, saveMusicalPreferences);
router.get('/public/:id', getPublicProfile);

module.exports = router;