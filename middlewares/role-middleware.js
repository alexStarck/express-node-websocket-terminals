const ApiError = require('../exceptions/api-error');
const roleService = require('../service/role-service');
const ObjectId = require('mongoose').Types.ObjectId;


module.exports = function (roles) {
    return async function (req, res, next) {
        if (req.method === "OPTIONS") {
            return next()
        }

        try {
            let userRole = req.user.role
            let hasRole = false
            if (ObjectId.isValid(req.user.role)) {
                userRole = await roleService.getRoleById(userRole)
            }
            roles.map((role) => {
                if (role === userRole) {
                    hasRole = true
                }
            })
            if (!hasRole) {
                return next(ApiError.PermissionsError());
            }
            return next();
        } catch (e) {
            return next(ApiError.PermissionsError());
        }
    }
};