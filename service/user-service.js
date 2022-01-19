const UserModel = require('../models/user-model');
const RoleModel = require('../models/role-model')
const CompanyModel = require('../models/company-model')
const bcrypt = require('bcrypt');
const uuid = require('uuid');
const mailService = require('./mail-service');
const roleService = require('./role-service');
const tokenService = require('./token-service');
const UserDto = require('../dtos/user-dto');
const ApiError = require('../exceptions/api-error');

class UserService {
    async registration({username, password, isActivated, role, company}) {
        // const candidate = await UserModel.findOne({username})
        // if (candidate) {
        //     throw ApiError.BadRequest(`Пользователь с никнеймом ${username} уже существует`)
        // }
        //
        const hashPassword = await bcrypt.hash(password, 3)
        const activationLink = uuid.v4(); // v34fa-asfasf-142saf-sa-asf

        let userRole = await RoleModel.findOne({value: role})
        if (!userRole) {
            userRole = await RoleModel.create({value: role})
        }
        let userCompany = await CompanyModel.findOne({name: company})
        if (!userCompany) {
            userCompany = await CompanyModel.create({name: company})
        }
        const user = await UserModel.create({
            username,
            password: hashPassword,
            isActivated,
            role: userRole._id,
            company: userCompany._id
        })
        console.log(user)
        const userDto = new UserDto({
            username: user.username,
            id: user._id,
            isActivated: user.isActivated,
            role: userRole.value,
            company: userCompany.name
        });
        console.log(userDto)
        // const tokens = tokenService.generateTokens({...userDto});
        // await tokenService.saveToken(userDto.id, tokens.refreshToken);
        //
        // return {...tokens, user: userDto}
        return {}
    }

    async activate(activationLink) {
        const user = await UserModel.findOne({activationLink})
        if (!user) {
            throw ApiError.BadRequest('Неккоректная ссылка активации')
        }
        user.isActivated = true;
        await user.save();
    }

    async login(username, password, device) {
        const user = await UserModel.findOne({username})
            .populate('role', 'value')
            .populate('company', 'name')
            .exec()
        if (!user) {
            throw ApiError.BadRequest('Пользователь с таким email не найден')
        }
        const isPassEquals = await bcrypt.compare(password, user.password);
        if (!isPassEquals) {
            throw ApiError.BadRequest('Неверный пароль');
        }
        const token = await tokenService.findDevice(device, user._id)
        if (!token) {
            const userDto = new UserDto({
                username: user.username,
                id: user._id,
                isActivated: user.isActivated,
                role: user.role.value,
                company: user.company.name
            });
            const tokens = tokenService.generateTokens({...userDto});
            await tokenService.saveToken(userDto.id, tokens.refreshToken, device);
            return {...tokens, user: userDto}
        }
        let validateToken = await tokenService.validateRefreshToken(token.refreshToken)

        if (!validateToken) {
            await tokenService.removeToken(token.refreshToken)
            const userDto = new UserDto({
                username: user.username,
                id: user._id,
                isActivated: user.isActivated,
                role: user.role.value,
                company: user.company.name
            });
            const tokens = tokenService.generateTokens({...userDto});
            await tokenService.saveToken(userDto.id, tokens.refreshToken, device);
            return {...tokens, user: userDto}
        }
        const userDto = new UserDto({
            username: user.username,
            id: user._id,
            isActivated: user.isActivated,
            role: user.role.value,
            company: user.company.name
        });
        const accessToken = tokenService.generateAccessToken({...userDto});

        return {accessToken, refreshToken: token.refreshToken, user: userDto}
    }


    async logout(refreshToken) {
        const token = await tokenService.removeToken(refreshToken);
        return token;
    }

    async refresh(refreshToken, device) {
        if (!refreshToken) {
            throw ApiError.UnauthorizedError();
        }
        const userData = tokenService.validateRefreshToken(refreshToken);
        const tokenFromDb = await tokenService.findToken(refreshToken);
        if (!userData || !tokenFromDb) {
            throw ApiError.UnauthorizedError();
        }
        const user = await UserModel.findById(userData.id)
            .populate('role', 'value')
            .populate('company', 'name')
            .exec()
        if (!user) {
            throw ApiError.UnauthorizedError();
        }
        const userDto = new UserDto({
            username: user.username,
            id: user._id,
            isActivated: user.isActivated,
            role: user.role.value,
            company: user.company.name
        });
        const accessToken = tokenService.generateAccessToken({...userDto});
        return {accessToken: accessToken, refreshToken: tokenFromDb.refreshToken, user: userDto}
    }


    async checkAdmin(id) {
        const isAdmin = await UserModel.findById(id);
        return isAdmin.admin
    }

    async getAllUsers(company) {
        const roleId = await RoleModel.findOne({value: 'ADMIN'})

        const companyId = await CompanyModel.findOne({name: company})
        let users = await UserModel.find({
            role: {$nin: [roleId._id]},
            company: companyId._id
        }).select({'password': 0}).populate('role', 'value').populate('company', 'name').exec()
        users = users.map((user) => {
            return (
                {
                    username: user.username,
                    _id: user._id,
                    isActivated: user.isActivated,
                    role: user.role.value,
                    company: user.company.name
                }
            )
        })
        return users;
    }

    async createUser(obj) {

        const role = await RoleModel.findOne({value: obj.role})
        const company = await CompanyModel.findOne({name: obj.company})
        const hashPassword = await bcrypt.hash(obj.password, 3)
        const user = await UserModel.create({
            username: obj.username,
            password: hashPassword,
            isActivated: obj.isActivated,
            role: role._id,
            company: company._id
        });
        return user;
    }

    async updateUser(obj) {
        let updatedUser
        const role = await RoleModel.findOne({value: obj.role})
        if (obj.password !== '') {
            const hashPassword = await bcrypt.hash(obj.password, 3)
            updatedUser = await UserModel.findByIdAndUpdate(obj._id, {
                username: obj.username,
                role: role._id,
                isActivated: obj.isActivated,
                password: hashPassword
            }, {new: true});
        } else {
            updatedUser = await UserModel.findByIdAndUpdate(obj._id, {
                username: obj.username,
                role: role._id,
                isActivated: obj.isActivated
            }, {new: true});

        }
        return updatedUser;
    }

    async deleteUser(id) {
        const user = await UserModel.findByIdAndDelete(id);
        return user;
    }
}

module.exports = new UserService();
