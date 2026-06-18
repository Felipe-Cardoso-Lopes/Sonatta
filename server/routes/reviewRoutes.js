const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middlewares/authMiddleware');
const { createReview, getTargetReviews } = require('../controllers/reviewController');

router.post('/', verifyToken, createReview);
router.get('/:target_type/:target_id', getTargetReviews); // Rota pública (vitrine)

module.exports = router;