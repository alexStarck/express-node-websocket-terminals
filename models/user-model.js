const {Schema, model} = require('mongoose');

const UserSchema = new Schema({
    username: {type: String, unique: true, required: true},
    password: {type: String, required: true},
    isActivated: {type: Boolean, default: false},
    role:{type: Schema.Types.ObjectId, ref: 'Role',required:true},
    company:{type: Schema.Types.ObjectId, ref: 'Company',required:true},
})

module.exports = model('User', UserSchema);
