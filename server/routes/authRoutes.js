const express = require("express");
const router = express.Router();
const {
  login,
  sendVerificationEmail,
  verifyEmailCode,
  registerInstituicao, // ✅ Import direto, sem spread
} = require("../controllers/authController");

router.post("/login", login);
router.post("/send-code", sendVerificationEmail);
router.post("/verify-code", verifyEmailCode);
router.post('/register-instituicao', registerInstituicao);

module.exports = router;