const express = require('express');
const router = express.Router({ mergeParams: true });
const { verifyToken } = require('../middlewares/authMiddleware');
const { getModules, createModule, deleteModule, createClass, addDocument } = require('../controllers/moduleController');

router.get('/', verifyToken, getModules);
router.post('/', verifyToken, createModule);
router.delete('/:moduleId', verifyToken, deleteModule);

router.post('/:moduleId/classes', verifyToken, createClass);
router.post('/classes/:classId/documents', verifyToken, addDocument);

module.exports = router;