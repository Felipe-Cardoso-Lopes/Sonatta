const express = require('express');
const router = express.Router();
const scheduleController = require('../controllers/scheduleController');

// 1. Tenta importar o middleware da forma direta
let authMiddleware = require('../middlewares/authMiddleware');

// 2. Auto-correção caso o middleware tenha sido exportado como objeto
if (typeof authMiddleware !== 'function') {
    if (typeof authMiddleware.authMiddleware === 'function') {
        authMiddleware = authMiddleware.authMiddleware;
    } else if (typeof authMiddleware.verifyToken === 'function') {
        authMiddleware = authMiddleware.verifyToken;
    } else if (typeof authMiddleware.protect === 'function') {
        authMiddleware = authMiddleware.protect;
    }
}

// 3. Validação de Sanidade (Descobre o culpado exato)
if (typeof authMiddleware !== 'function') {
    throw new Error("🚨 ERRO NO ROUTER: O 'authMiddleware' está undefined. Verifique o arquivo middlewares/authMiddleware.js.");
}
if (!scheduleController || typeof scheduleController.addAvailability !== 'function') {
    throw new Error("🚨 ERRO NO ROUTER: O 'scheduleController.addAvailability' está undefined. Verifique se você salvou o arquivo controllers/scheduleController.js.");
}

// 4. Mapeamento das Rotas
router.post('/availability', authMiddleware, scheduleController.addAvailability);
router.delete('/availability/:id', authMiddleware, scheduleController.deleteAvailability);
router.get('/availability/:teacherId', authMiddleware, scheduleController.getTeacherAvailability);

module.exports = router;