const express = require('express');
const router = express.Router();
const uploadController = require('../controllers/uploadController');
const upload = require('../middlewares/uploadMiddleware'); // O Multer da Task 8.1
const { verifyToken } = require('../middlewares/authMiddleware');

// O fluxo: Verifica Autenticação -> Lê o Ficheiro para a RAM -> Envia para a Nuvem
router.post('/', verifyToken, upload.single('file'), uploadController.uploadFile);

module.exports = router;