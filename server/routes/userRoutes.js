const express = require('express');
const router = express.Router();

const { registerUser, loginUser, updateUserProfile, completeRegistration, saveMusicalPreferences, getUserProfile } = require('../controllers/userController');
const { protect } = require('../middlewares/authMiddleware');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.put('/profile', protect, updateUserProfile); 
router.put('/complete/:id', completeRegistration);
router.get('/profile', protect, getUserProfile);

// Nova rota para salvar as preferências musicais (Tags)
router.post('/preferences', saveMusicalPreferences);

module.exports = router;