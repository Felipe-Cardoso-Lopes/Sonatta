const express = require('express');
const router = express.Router();

// Importação única e exclusiva do controller
const { registerUser, loginUser, updateUserProfile, completeRegistration, saveMusicalPreferences, getUserProfile } = require('../controllers/userController');
const { verifyToken } = require('../middlewares/authMiddleware');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.put('/profile', verifyToken, updateUserProfile); 
router.put('/complete/:id', completeRegistration);
router.get('/profile', verifyToken, getUserProfile);
router.post('/preferences', saveMusicalPreferences);

module.exports = router;