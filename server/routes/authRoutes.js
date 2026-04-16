const express = require('express');
const router = express.Router();
const { sendVerificationEmail, verifyEmailCode } = require('../controllers/authController');

router.post('/send-code', sendVerificationEmail);
router.post('/verify-code', verifyEmailCode);

module.exports = router;