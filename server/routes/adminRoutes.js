const express = require("express");
const router = express.Router();
const {
  login,
  sendVerificationEmail,
  verifyEmailCode,
  registerInstituicao, // ✅ Import direto, sem spread
} = require("../controllers/authController");
const express = require('express');
const router = express.Router();
const { getDashboardStats } = require('../controllers/adminController');

router.post("/login", login);
router.post("/send-code", sendVerificationEmail);
router.post("/verify-code", verifyEmailCode);
router.post('/register-instituicao', registerInstituicao);
router.get('/stats', getDashboardStats);

module.exports = router;