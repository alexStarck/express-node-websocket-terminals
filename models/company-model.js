const {Schema, model} = require('mongoose');

const CompanySchema = new Schema({
    name: {type: String, unique: true,required:true},
})

module.exports = model('Company', CompanySchema);