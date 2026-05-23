const express = require("express");
const router = express.Router();
const {
  login, // Adicionado aqui
  sendVerificationEmail,
  verifyEmailCode,
} = require("../controllers/authController");

router.post("/login", login); // Adicionado aqui
router.post("/send-code", sendVerificationEmail);
router.post("/verify-code", verifyEmailCode);

module.exports = router;