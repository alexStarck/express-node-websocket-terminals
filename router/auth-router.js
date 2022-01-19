const Router = require('express').Router;
const userController = require('../controllers/user-controller');
const router = new Router();
const {body,param} = require('express-validator');



router.post('/registration',
    // body('email').isEmail(),
    // body('password').isLength({min: 3, max: 32}),
    userController.registration
);
router.post('/login', userController.login);
router.post('/logout', userController.logout);
// router.get('/activate/:link', userController.activate);
router.post('/refresh', userController.refresh);

module.exports = router