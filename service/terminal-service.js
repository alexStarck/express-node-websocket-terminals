const TerminalModel=require('../models/terminal-model')
const CompanyModel=require('../models/company-model')
const {validationResult} = require('express-validator');
const ApiError = require('../exceptions/api-error');

class TerminalService {
    async getAllTerminals() {
        let terminals = await TerminalModel.find().sort({number:1});
        return terminals;
    }

    async createTerminal(req) {
        // console.log(req.user)
        const candidate= await TerminalModel.findOne({$or: [ {address:req.body.address}, {number:req.body.number} ]})
        if(candidate){
            throw ApiError.BadRequest('Терминал с таким адрессом или номером уже существует')
        }
        // const candidate2=await TerminalModel.findOne({number:req.body.number})
        // if(candidate2){
        //     throw ApiError.BadRequest('Терминал с таким номером уже существует')
        // }
        const company=await CompanyModel.findOne({name:req.user.company})
        if(!company){
            throw ApiError.BadRequest('компания не найдена')
        }
        // console.log(req.user.company)
        // console.log(company)
        // const number=(await TerminalModel.find().sort({number:-1}).select({_id: 1, number: 1}).exec())[0].number+1
        const terminal = await TerminalModel.create({address:req.body.address,location: req.body.location,number:req.body.number,company:company.id});
        return terminal;
    }


    async updateTerminal(obj) {
        const candidate=await TerminalModel.findOne({number:obj.number})
        if(candidate){
            throw ApiError.BadRequest('Терминал с таким номером уже существует')
        }
        const terminal = await TerminalModel.findByIdAndUpdate(obj._id,{address:obj.address,location: obj.location,number:obj.number});
        return terminal;
    }
    async deleteTerminal(id) {
        const terminal = await TerminalModel.findByIdAndDelete(id);
        return terminal;
    }


}

module.exports = new TerminalService();
