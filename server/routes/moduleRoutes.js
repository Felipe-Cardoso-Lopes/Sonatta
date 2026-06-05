const express = require('express');
const router = express.Router({ mergeParams: true });
const { verifyToken } = require('../middlewares/authMiddleware');

// AQUI ESTAVA O ERRO: Faltava importar updateModule, updateClass, deleteClass e deleteDocument
const { 
  getModules, 
  createModule, 
  updateModule, 
  deleteModule, 
  createClass, 
  updateClass, 
  deleteClass, 
  addDocument, 
  deleteDocument 
} = require('../controllers/moduleController');

router.get('/', verifyToken, getModules);
router.post('/', verifyToken, createModule);
router.put('/:moduleId', verifyToken, updateModule);
router.delete('/:moduleId', verifyToken, deleteModule);

router.post('/:moduleId/classes', verifyToken, createClass);
router.put('/classes/:classId', verifyToken, updateClass);
router.delete('/classes/:classId', verifyToken, deleteClass);

router.post('/classes/:classId/documents', verifyToken, addDocument);
router.delete('/documents/:documentId', verifyToken, deleteDocument);

module.exports = router;