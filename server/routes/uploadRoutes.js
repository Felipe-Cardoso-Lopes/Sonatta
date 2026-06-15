const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middlewares/authMiddleware');
const uploadMiddleware = require('../middlewares/uploadMiddleware');
const { uploadFile } = require('../controllers/uploadController');

// Como o uploadMiddleware já faz o .single('file') e trata os erros internamente,
// passamos apenas a referência dele aqui!
router.post('/', verifyToken, uploadMiddleware, uploadFile);

module.exports = router;