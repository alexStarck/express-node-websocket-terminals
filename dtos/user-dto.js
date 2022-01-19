module.exports = class UserDto {
    username;
    id;
    isActivated;
    role;
    company;

    constructor(model) {
        this.username = model.username;
        this.id = model.id;
        this.isActivated = model.isActivated;
        this.role = model.role;
        this.company = model.company;
    }
}
