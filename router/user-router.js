const Router = require('express').Router;
const userController = require('../controllers/user-controller');
const roleController = require('../controllers/role-controller');
const router = new Router();
const {body, param} = require('express-validator');
const authMiddleware = require('../middlewares/auth-middleware');
const roleMiddleware = require('../middlewares/role-middleware');


router.get('/admin', authMiddleware, userController.getUsers);
router.get('/users', authMiddleware, roleMiddleware(['ADMIN']), userController.getUsers);
router.post('/users', authMiddleware, roleMiddleware(['ADMIN']),
    body('username').isString().isLength({min: 6, max: 12}).notEmpty(),
    body('password').isLength({min: 4, max: 18}).notEmpty(),
    body('role').notEmpty(),
    userController.createUsers);
router.put('/users', authMiddleware, roleMiddleware(['ADMIN']),
    body('_id').notEmpty(),
    body('username').isString().isLength({min: 6, max: 12}).notEmpty(),
    body('role').isString().notEmpty(),
    userController.updateUsers);
router.delete('/users/:id', authMiddleware, roleMiddleware(['ADMIN']),
    param('id').notEmpty(),
    userController.deleteUsers);
router.get('/roles', authMiddleware, roleMiddleware(['ADMIN']), roleController.getRoles);


module.exports = router
