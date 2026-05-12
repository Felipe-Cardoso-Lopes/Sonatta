const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middlewares/authMiddleware');
const { sendMessage, getChatHistory } = require('../controllers/messageController');

router.post('/', verifyToken, sendMessage);
router.get('/:otherUserId', verifyToken, getChatHistory);

module.exports = router;