const {Schema, model} = require('mongoose');

const TerminalSchema = new Schema({
    address: {type: String, unique: true, required: true},
    number: {type: String, unique: true, required: true,},
    location: [{type:Number,required:true,min:-180,max:180},{type:Number,required:true,min:-180,max:180}],
    company:{type: Schema.Types.ObjectId, ref: 'Company',required:true}
})

module.exports = model('Terminal', TerminalSchema);
