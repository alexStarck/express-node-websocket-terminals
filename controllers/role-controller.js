const roleService = require('../service/role-service');
const {validationResult} = require('express-validator');
const ApiError = require('../exceptions/api-error');

class RoleController {




    async getRoles(req, res, next) {
        try {
            const roles = await roleService.getAllRoles();
            return res.json(roles);
        } catch (e) {
            next(e);
        }
    }

}


module.exports = new RoleController();
