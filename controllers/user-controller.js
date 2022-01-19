const userService = require('../service/user-service');
const {validationResult} = require('express-validator');
const ApiError = require('../exceptions/api-error');

class UserController {
    async registration(req, res, next) {
        try {

            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return next(ApiError.BadRequest('Ошибка при валидации', errors.array()))
            }
            // const {username, password,isActivated} = req.body;
            const obj = {
                username: 'admin',
                password: 'admin',
                isActivated: true,
                role: 'ADMIN',
                company: 'МЕВЗ'
            }
            const userData = await userService.registration({...obj});

            res.cookie('refreshToken', userData.refreshToken, {maxAge: 5 * 24 * 60 * 60 * 1000, httpOnly: true})
            return res.json(userData);
        } catch (e) {
            next(e);
        }
    }

    async login(req, res, next) {
        try {
            const {username, password, device} = req.body;
            const userData = await userService.login(username, password, device);
            res.cookie('refreshToken', userData.refreshToken, {maxAge: 5 * 24 * 60 * 60 * 1000, httpOnly: true})
            return res.json(userData);
        } catch (e) {
            next(e);
        }
    }

    async logout(req, res, next) {
        try {
            const {refreshToken} = req.cookies;
            const token = await userService.logout(refreshToken);
            res.clearCookie('refreshToken');
            return res.json(token);
        } catch (e) {
            next(e);
        }
    }

    async activate(req, res, next) {
        try {
            const activationLink = req.params.link;
            await userService.activate(activationLink);
            return res.redirect(process.env.CLIENT_URL);
        } catch (e) {
            next(e);
        }
    }

    async refresh(req, res, next) {
        try {
            const {device} = req.body
            const {refreshToken} = req.cookies;
            const userData = await userService.refresh(refreshToken, device);
            res.cookie('refreshToken', userData.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true})
            return res.json(userData);
        } catch (e) {
            next(e);
        }
    }


    async getUsers(req, res, next) {
        try {
            const users = await userService.getAllUsers(req.user.company);
            return res.json(users);
        } catch (e) {
            next(e);
        }
    }

    async createUsers(req, res, next) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return next(ApiError.BadRequest('Ошибка при валидации', errors.array()))
            }
            const user = await userService.createUser({...req.body, company: req.user.company});
            return res.json(user);
        } catch (e) {
            next(e);
        }
    }

    async updateUsers(req, res, next) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return next(ApiError.BadRequest('Ошибка при валидации', errors.array()))
            }
            const user = await userService.updateUser(req.body);
            return res.json(user);
        } catch (e) {
            next(e);
        }
    }

    async deleteUsers(req, res, next) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return next(ApiError.BadRequest('Ошибка при валидации', errors.array()))
            }
            const user = await userService.deleteUser(req.params.id);
            return res.json(user);
        } catch (e) {
            next(e);
        }
    }
}


module.exports = new UserController();
