const RoleModel = require('../models/role-model')

class RoleService {
    async getAllRoles() {
        const roles = await RoleModel.find({value:{$nin:['ADMIN']}});
        let array=roles.map((role)=>{return role.value})
        // console.log(array)
        return array;
    }
    async getRoleById(id) {
        const obj = await RoleModel.findById(id);
        const role=obj.value;
        return role;
    }
}

module.exports = new RoleService();
