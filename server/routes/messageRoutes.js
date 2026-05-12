const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middlewares/authMiddleware');
const { sendMessage, getChatHistory } = require('../controllers/messageController');

router.post('/', protect, sendMessage);
router.get('/:otherUserId', protect, getChatHistory);

module.exports = router;