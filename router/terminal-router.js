const Router = require('express').Router;
const terminalController = require('../controllers/terminal-controller');
const router = new Router();
const {body, param} = require('express-validator');
const authMiddleware = require('../middlewares/auth-middleware');
const roleMiddleware = require('../middlewares/role-middleware');


router.get('/terminals', authMiddleware, roleMiddleware(['ADMIN']), terminalController.getTerminals);
router.post('/terminals', authMiddleware, roleMiddleware(['ADMIN']),
    body('address').isString().notEmpty(),
    body('number').isString().notEmpty(),
    body('location').isArray().isFloat().custom((value) => {
        if (value.length !== 2) throw new Error('Длина массива не соответстует');
        if (value[0] > 180 || value[0] < -180) throw new Error('не верное значение [0]');
        if (value[1] > 180 || value[1] < -180) throw new Error('не верное значение [1]');
        return true;
    }),
    terminalController.createTerminal);
router.put('/terminals', authMiddleware, roleMiddleware(['ADMIN']),
    body('address').isString().notEmpty(),
    body('number').isString().notEmpty(),
    body('location').isArray().isFloat().custom((value) => {
        if (value.length !== 2) throw new Error('Длина массива не соответстует');
        if (value[0] > 180 || value[0] < -180) throw new Error('не верное значение [0]');
        if (value[1] > 180 || value[1] < -180) throw new Error('не верное значение [1]');
        return true;
    }),
    terminalController.updateTerminal);
router.delete('/terminals/:id', authMiddleware, roleMiddleware(['ADMIN']),
    param('id').notEmpty(),
    terminalController.deleteTerminal);


module.exports = router