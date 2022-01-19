const terminalService=require('../service/terminal-service')
const {validationResult} = require('express-validator');
const ApiError = require('../exceptions/api-error');

class TerminalController {

    async getTerminals(req, res, next) {
        try {
            const terminals = await terminalService.getAllTerminals();
            return res.json(terminals);
        } catch (e) {
            next(e);
        }
    }
    async createTerminal(req, res, next) {
        try {
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                return next(ApiError.BadRequest('Ошибка при валидации', errors.array()))
            }
            const terminal = await terminalService.createTerminal(req);
            return res.json(terminal);
        } catch (e) {
            next(e);
        }
    }
    async updateTerminal(req, res, next) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return next(ApiError.BadRequest('Ошибка при валидации', errors.array()))
            }
            const terminal = await terminalService.updateTerminal(req.body);
            return res.json(terminal);
        } catch (e) {
            next(e);
        }
    }
    async deleteTerminal(req, res, next) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return next(ApiError.BadRequest('Ошибка при валидации', errors.array()))
            }
            const terminal = await terminalService.deleteTerminal(req.params.id);
            return res.json(terminal);
        } catch (e) {
            next(e);
        }
    }

}


module.exports = new TerminalController();
